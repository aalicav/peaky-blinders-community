import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function scrapeTikTokProfile(url: string) {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.waitForSelector('div[data-e2e="user-avatar"]', { timeout: 5000 });

    const avatarDiv = await page.$('div[data-e2e="user-avatar"]');
    const profileImgUrl = await avatarDiv?.evaluate((el) => {
      const imgElement = el.querySelector("img");
      return imgElement ? imgElement.getAttribute("src") : null;
    });

    return profileImgUrl;
  } catch (error) {
    console.error("Erro ao scrape TikTok profile:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
