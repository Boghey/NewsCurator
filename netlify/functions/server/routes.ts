import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function scrapeMetadata(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      $('meta[name="title"]').attr("content");

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[property="twitter:image"]').attr("content");

    // Extract published date from various meta tags
    const publishedDate =
      $('meta[property="article:published_time"]').attr("content") ||
      $('meta[property="og:published_time"]').attr("content") ||
      $('meta[name="publishedDate"]').attr("content") ||
      $('meta[name="date"]').attr("content");

    return { title, image, publishedDate };
  } catch (error) {
    console.error("Error scraping metadata:", error);
    return { title: null, image: null, publishedDate: null };
  }
}