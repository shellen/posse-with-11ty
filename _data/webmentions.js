import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

export default async function () {
  const token = process.env.WEBMENTION_IO_TOKEN;
  const domain = process.env.DOMAIN_NAME;

  if (!token || !domain) {
    console.error(
      "Missing environment variables: WEBMENTION_IO_TOKEN or DOMAIN_NAME"
    );
    return [];
  }

  const url = `https://webmention.io/api/mentions.jf2?domain=${domain}&token=${token}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const feed = await response.json();
      return feed.children;
    } else {
      console.error(`Failed to fetch webmentions: ${response.statusText}`);
      return [];
    }
  } catch (err) {
    console.error(`Error fetching webmentions: ${err.message}`);
    return [];
  }
}
