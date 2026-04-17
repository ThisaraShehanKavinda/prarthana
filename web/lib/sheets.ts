import { google } from "googleapis";
import { normalizeArticleStatus } from "@/lib/article-feed";
import type {
  AppNotification,
  Article,
  ArticleLike,
  Comment,
  CommentVisibility,
  ContentReport,
  ReportStatus,
  ReportTargetType,
} from "@/lib/types";

const ARTICLES_TAB = process.env.SHEETS_ARTICLES_TAB ?? "articles";
const COMMENTS_TAB = process.env.SHEETS_COMMENTS_TAB ?? "comments";
const LIKES_TAB = process.env.SHEETS_LIKES_TAB ?? "article_likes";
/** Add sheet tabs + headers (row 1) in Google Sheets, or set env tab names to match yours. */
const NOTIFICATIONS_TAB = process.env.SHEETS_NOTIFICATIONS_TAB ?? "notifications";
const REPORTS_TAB = process.env.SHEETS_REPORTS_TAB ?? "content_reports";

function getSheetsClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
  if (!raw || !spreadsheetId) {
    return null;
  }
  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId };
}

export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON &&
      process.env.SHEETS_SPREADSHEET_ID
  );
}

function parseTagsCell(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

function rowToArticle(row: string[]): Article | null {
  if (row.length < 10) return null;
  const id = row[0] ?? "";
  const slug = row[6] ?? "";
  if (!id || !slug) return null;
  return {
    id,
    createdAt: row[1] ?? "",
    updatedAt: row[2] ?? "",
    authorEmail: row[3] ?? "",
    authorName: row[4] ?? "",
    title: row[5] ?? "",
    slug,
    excerpt: row[7] ?? "",
    bodyMarkdown: row[8] ?? "",
    status: normalizeArticleStatus(row[9]),
    heroImageUrl: row[10] ?? "",
    tags: parseTagsCell(row[11]),
    scheduledPublishAt: (row[12] ?? "").trim(),
    authorImageUrl: (row[13] ?? "").trim(),
  };
}

function parseCommentVisibility(raw: string | undefined): CommentVisibility {
  return (raw ?? "").toLowerCase() === "hidden" ? "hidden" : "public";
}

function rowToComment(row: string[]): Comment | null {
  if (row.length < 6) return null;
  const [id, createdAt, articleId, authorEmail, authorName, body, visRaw, parentRaw, imgRaw] =
    row;
  if (!id || !articleId) return null;
  return {
    id,
    createdAt: createdAt ?? "",
    articleId,
    authorEmail: authorEmail ?? "",
    authorName: authorName ?? "",
    authorImageUrl: (imgRaw ?? "").trim(),
    body: body ?? "",
    visibility: parseCommentVisibility(visRaw),
    parentCommentId: (parentRaw ?? "").trim(),
  };
}

function rowToLike(row: string[]): ArticleLike | null {
  if (row.length < 5) return null;
  const [id, createdAt, articleId, authorEmail, authorName, imgRaw] = row;
  if (!id || !articleId) return null;
  return {
    id,
    createdAt: createdAt ?? "",
    articleId,
    authorEmail: authorEmail ?? "",
    authorName: authorName ?? "",
    authorImageUrl: (imgRaw ?? "").trim(),
  };
}

export async function fetchAllArticles(): Promise<Article[]> {
  const client = getSheetsClient();
  if (!client) return [];
  const { sheets, spreadsheetId } = client;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${ARTICLES_TAB}!A2:N2000`,
  });
  const rows = res.data.values ?? [];
  return rows
    .map((r) => rowToArticle(r.map(String)))
    .filter((a): a is Article => a !== null);
}

export async function fetchAllComments(): Promise<Comment[]> {
  const client = getSheetsClient();
  if (!client) return [];
  const { sheets, spreadsheetId } = client;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${COMMENTS_TAB}!A2:I2000`,
  });
  const rows = res.data.values ?? [];
  return rows
    .map((r) => rowToComment(r.map(String)))
    .filter((c): c is Comment => c !== null);
}

export async function appendArticleRow(values: string[]): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${ARTICLES_TAB}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
  return true;
}

export async function appendCommentRow(values: string[]): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${COMMENTS_TAB}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
  return true;
}

export function slugExists(articles: Article[], slug: string): boolean {
  return articles.some((a) => a.slug === slug);
}

/** 1-based row number on the articles sheet (row 1 = header). */
export function articleSheetRowNumber(
  articles: Article[],
  articleId: string
): number | null {
  const i = articles.findIndex((a) => a.id === articleId);
  if (i < 0) return null;
  return i + 2;
}

let articlesSheetIdCache: number | null | undefined;
let commentsSheetIdCache: number | null | undefined;
/** Set only when the likes tab exists, so adding the tab later is picked up without redeploy. */
let likesSheetIdCache: number | undefined;

async function sheetIdForTab(tabTitle: string): Promise<number | null> {
  const client = getSheetsClient();
  if (!client) return null;
  const { sheets, spreadsheetId } = client;
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });
  const sheet = res.data.sheets?.find((s) => s.properties?.title === tabTitle);
  return sheet?.properties?.sheetId ?? null;
}

export async function getArticlesSheetId(): Promise<number | null> {
  if (articlesSheetIdCache !== undefined) return articlesSheetIdCache;
  articlesSheetIdCache = await sheetIdForTab(ARTICLES_TAB);
  return articlesSheetIdCache;
}

export async function getCommentsSheetId(): Promise<number | null> {
  if (commentsSheetIdCache !== undefined) return commentsSheetIdCache;
  commentsSheetIdCache = await sheetIdForTab(COMMENTS_TAB);
  return commentsSheetIdCache;
}

export async function getLikesSheetId(): Promise<number | null> {
  if (typeof likesSheetIdCache === "number") return likesSheetIdCache;
  const id = await sheetIdForTab(LIKES_TAB);
  if (id !== null) likesSheetIdCache = id;
  return id;
}

export async function fetchAllLikes(): Promise<ArticleLike[]> {
  const client = getSheetsClient();
  if (!client) return [];
  const { sheets, spreadsheetId } = client;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${LIKES_TAB}!A2:F2000`,
    });
    const rows = res.data.values ?? [];
    return rows
      .map((r) => rowToLike(r.map(String)))
      .filter((l): l is ArticleLike => l !== null);
  } catch (e) {
    console.warn("[sheets] likes tab read failed (create tab article_likes?):", e);
    return [];
  }
}

export async function appendLikeRow(values: string[]): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${LIKES_TAB}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
  return true;
}

export async function findLikeSheetRowNumber(
  articleId: string,
  likerEmail: string
): Promise<number | null> {
  const client = getSheetsClient();
  if (!client) return null;
  const { sheets, spreadsheetId } = client;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${LIKES_TAB}!A2:F2000`,
    });
    const rows = res.data.values ?? [];
    const em = likerEmail.toLowerCase();
    for (let i = 0; i < rows.length; i++) {
      const l = rowToLike(rows[i].map(String));
      if (
        l &&
        l.articleId === articleId &&
        l.authorEmail.toLowerCase() === em
      ) {
        return i + 2;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteLikeSheetRow(rowNumber: number): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const sheetId = await getLikesSheetId();
  if (sheetId === null) return false;
  const { sheets, spreadsheetId } = client;
  const startIndex = rowNumber - 1;
  const endIndex = rowNumber;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex,
              endIndex,
            },
          },
        },
      ],
    },
  });
  return true;
}

export async function deleteLikesForArticle(articleId: string): Promise<void> {
  const client = getSheetsClient();
  if (!client) return;
  const sheetId = await getLikesSheetId();
  if (sheetId === null) return;
  const { sheets, spreadsheetId } = client;
  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${LIKES_TAB}!A2:F2000`,
    });
  } catch {
    return;
  }
  const rows = res.data.values ?? [];
  const rowsToDelete: number[] = [];
  rows.forEach((r, i) => {
    const l = rowToLike(r.map(String));
    if (l?.articleId === articleId) {
      rowsToDelete.push(i + 2);
    }
  });
  rowsToDelete.sort((a, b) => b - a);
  for (const rowNum of rowsToDelete) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNum - 1,
                endIndex: rowNum,
              },
            },
          },
        ],
      },
    });
  }
}

export async function findCommentSheetRowNumber(
  commentId: string
): Promise<number | null> {
  const client = getSheetsClient();
  if (!client) return null;
  const { sheets, spreadsheetId } = client;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${COMMENTS_TAB}!A2:I2000`,
  });
  const rows = res.data.values ?? [];
  for (let i = 0; i < rows.length; i++) {
    const c = rowToComment(rows[i].map(String));
    if (c?.id === commentId) return i + 2;
  }
  return null;
}

export async function deleteCommentSheetRow(rowNumber: number): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const sheetId = await getCommentsSheetId();
  if (sheetId === null) return false;
  const { sheets, spreadsheetId } = client;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });
  return true;
}

export async function updateCommentVisibilityAtRow(
  rowNumber: number,
  visibility: CommentVisibility
): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${COMMENTS_TAB}!G${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[visibility]] },
  });
  return true;
}

export async function updateArticleRowAt(
  rowNumber: number,
  article: Article
): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  const row = [
    article.id,
    article.createdAt,
    article.updatedAt,
    article.authorEmail,
    article.authorName,
    article.title,
    article.slug,
    article.excerpt,
    article.bodyMarkdown,
    article.status,
    article.heroImageUrl ?? "",
    article.tags.join(","),
    article.scheduledPublishAt ?? "",
    article.authorImageUrl ?? "",
  ];
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${ARTICLES_TAB}!A${rowNumber}:N${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
  return true;
}

export async function deleteArticleSheetRow(rowNumber: number): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const sheetId = await getArticlesSheetId();
  if (sheetId === null) return false;
  const { sheets, spreadsheetId } = client;
  const startIndex = rowNumber - 1;
  const endIndex = rowNumber;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex,
              endIndex,
            },
          },
        },
      ],
    },
  });
  return true;
}

/** Removes comment rows for an article (other tab; safe before deleting the article row). */
export async function deleteCommentsForArticle(articleId: string): Promise<void> {
  const client = getSheetsClient();
  if (!client) return;
  const sheetId = await getCommentsSheetId();
  if (sheetId === null) return;
  const { sheets, spreadsheetId } = client;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${COMMENTS_TAB}!A2:I2000`,
  });
  const rows = res.data.values ?? [];
  const rowsToDelete: number[] = [];
  rows.forEach((r, i) => {
    const c = rowToComment(r.map(String));
    if (c?.articleId === articleId) {
      rowsToDelete.push(i + 2);
    }
  });
  rowsToDelete.sort((a, b) => b - a);
  for (const rowNum of rowsToDelete) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNum - 1,
                endIndex: rowNum,
              },
            },
          },
        ],
      },
    });
  }
}

export async function deleteArticleById(articleId: string): Promise<boolean> {
  const articles = await fetchAllArticles();
  const rowNumber = articleSheetRowNumber(articles, articleId);
  if (rowNumber === null) return false;
  await deleteLikesForArticle(articleId);
  await deleteCommentsForArticle(articleId);
  return deleteArticleSheetRow(rowNumber);
}

const NOTIFICATION_TYPES = new Set<string>([
  "comment_reply",
  "mention",
  "mod_comment_hidden",
  "mod_post_hidden",
]);

function rowToNotification(row: string[]): AppNotification | null {
  if (row.length < 8) return null;
  const [id, createdAt, recipientEmail, type, title, body, linkHref, readAt] = row;
  if (!id || !recipientEmail || !NOTIFICATION_TYPES.has(String(type))) return null;
  return {
    id,
    createdAt: createdAt ?? "",
    recipientEmail: recipientEmail ?? "",
    type: type as AppNotification["type"],
    title: title ?? "",
    body: body ?? "",
    linkHref: linkHref ?? "",
    readAt: readAt ?? "",
  };
}

export async function appendNotificationRow(values: string[]): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${NOTIFICATIONS_TAB}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });
    return true;
  } catch (e) {
    console.warn("[sheets] notifications append failed (add tab notifications?):", e);
    return false;
  }
}

export async function fetchNotificationsForEmail(
  email: string,
  limit = 60
): Promise<AppNotification[]> {
  const client = getSheetsClient();
  if (!client) return [];
  const { sheets, spreadsheetId } = client;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${NOTIFICATIONS_TAB}!A2:H2000`,
    });
    const rows = res.data.values ?? [];
    const em = email.toLowerCase();
    const list = rows
      .map((r) => rowToNotification(r.map(String)))
      .filter((n): n is AppNotification => n !== null)
      .filter((n) => n.recipientEmail.toLowerCase() === em)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return list.slice(0, limit);
  } catch (e) {
    console.warn("[sheets] notifications read failed:", e);
    return [];
  }
}

export async function findNotificationSheetRowNumber(
  notificationId: string
): Promise<number | null> {
  const client = getSheetsClient();
  if (!client) return null;
  const { sheets, spreadsheetId } = client;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${NOTIFICATIONS_TAB}!A2:H2000`,
    });
    const rows = res.data.values ?? [];
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i]?.[0]) === notificationId) return i + 2;
    }
  } catch {
    return null;
  }
  return null;
}

export async function updateNotificationReadAtRow(
  rowNumber: number,
  readAtIso: string
): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${NOTIFICATIONS_TAB}!H${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[readAtIso]] },
    });
    return true;
  } catch {
    return false;
  }
}

function rowToReport(row: string[]): ContentReport | null {
  if (row.length < 7) return null;
  const [
    id,
    createdAt,
    reporterEmail,
    targetType,
    targetId,
    articleId,
    reasonCode,
    note,
    statusRaw,
  ] = row;
  if (!id || !reporterEmail) return null;
  const tt = String(targetType) as ReportTargetType;
  if (tt !== "article" && tt !== "comment") return null;
  const st = String(statusRaw ?? "open").toLowerCase() as ReportStatus;
  const status: ReportStatus = st === "reviewed" ? "reviewed" : "open";
  return {
    id,
    createdAt: createdAt ?? "",
    reporterEmail,
    targetType: tt,
    targetId: targetId ?? "",
    articleId: articleId ?? "",
    reasonCode: reasonCode ?? "",
    note: note ?? "",
    status,
  };
}

export async function appendReportRow(values: string[]): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${REPORTS_TAB}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });
    return true;
  } catch (e) {
    console.warn("[sheets] reports append failed (add tab content_reports?):", e);
    return false;
  }
}

export async function fetchOpenReports(limit = 100): Promise<ContentReport[]> {
  const client = getSheetsClient();
  if (!client) return [];
  const { sheets, spreadsheetId } = client;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${REPORTS_TAB}!A2:I500`,
    });
    const rows = res.data.values ?? [];
    return rows
      .map((r) => rowToReport(r.map(String)))
      .filter((r): r is ContentReport => r !== null)
      .filter((r) => r.status === "open")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  } catch (e) {
    console.warn("[sheets] reports read failed:", e);
    return [];
  }
}

export async function findReportSheetRowNumber(
  reportId: string
): Promise<number | null> {
  const client = getSheetsClient();
  if (!client) return null;
  const { sheets, spreadsheetId } = client;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${REPORTS_TAB}!A2:I500`,
    });
    const rows = res.data.values ?? [];
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i]?.[0]) === reportId) return i + 2;
    }
  } catch {
    return null;
  }
  return null;
}

export async function updateReportStatusAtRow(
  rowNumber: number,
  status: ReportStatus
): Promise<boolean> {
  const client = getSheetsClient();
  if (!client) return false;
  const { sheets, spreadsheetId } = client;
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${REPORTS_TAB}!I${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[status]] },
    });
    return true;
  } catch {
    return false;
  }
}
