import { google } from "googleapis";
import type { Article, Comment } from "@/lib/types";

const ARTICLES_TAB = process.env.SHEETS_ARTICLES_TAB ?? "articles";
const COMMENTS_TAB = process.env.SHEETS_COMMENTS_TAB ?? "comments";

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

function rowToArticle(row: string[]): Article | null {
  if (row.length < 10) return null;
  const [
    id,
    createdAt,
    updatedAt,
    authorEmail,
    authorName,
    title,
    slug,
    excerpt,
    bodyMarkdown,
    status,
    heroImageUrl,
  ] = row;
  if (!id || !slug) return null;
  const st = status === "pending" ? "pending" : "published";
  return {
    id,
    createdAt: createdAt ?? "",
    updatedAt: updatedAt ?? "",
    authorEmail: authorEmail ?? "",
    authorName: authorName ?? "",
    title: title ?? "",
    slug,
    excerpt: excerpt ?? "",
    bodyMarkdown: bodyMarkdown ?? "",
    status: st,
    heroImageUrl: heroImageUrl ?? "",
  };
}

function rowToComment(row: string[]): Comment | null {
  if (row.length < 6) return null;
  const [id, createdAt, articleId, authorEmail, authorName, body] = row;
  if (!id || !articleId) return null;
  return {
    id,
    createdAt: createdAt ?? "",
    articleId,
    authorEmail: authorEmail ?? "",
    authorName: authorName ?? "",
    body: body ?? "",
  };
}

export async function fetchAllArticles(): Promise<Article[]> {
  const client = getSheetsClient();
  if (!client) return [];
  const { sheets, spreadsheetId } = client;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${ARTICLES_TAB}!A2:K2000`,
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
    range: `${COMMENTS_TAB}!A2:F2000`,
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
  ];
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${ARTICLES_TAB}!A${rowNumber}:K${rowNumber}`,
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
    range: `${COMMENTS_TAB}!A2:F2000`,
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
  await deleteCommentsForArticle(articleId);
  return deleteArticleSheetRow(rowNumber);
}
