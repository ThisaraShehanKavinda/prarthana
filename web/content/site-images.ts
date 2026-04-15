/**
 * External https image URLs (Wikimedia Commons). Resolved via Special:FilePath.
 * Edit this file to swap photos — allow `upload.wikimedia.org` in next.config.ts.
 *
 * next/image uses `unoptimized` on these pages so the browser loads the URL
 * directly (avoids many Next optimizer / hotlink issues).
 */

export const siteImages = {
  nutritionKingCoconut:
    "https://upload.wikimedia.org/wikipedia/commons/c/c0/King_coconut.jpg",
  /** Delum — pomegranate (Punica granatum); Sinhala දෙලුම් */
  nutritionDelum:
    "https://upload.wikimedia.org/wikipedia/commons/6/6b/Pomegranate_fruit.jpg",
  learnAgeChildren:
    "https://upload.wikimedia.org/wikipedia/commons/5/52/Children_playing.jpg",
  homeHero:
    "https://upload.wikimedia.org/wikipedia/commons/c/c4/DNA_double_helix_horizontal.png",
} as const;
