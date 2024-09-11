import puppeteer from "puppeteer";

export async function scrapeTikTokProfile(url: string) {
  let browser;

  if (process.env.NODE_ENV === "production") {
    const chromium = (await import('chrome-aws-lambda'))?.default;
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
  } else {
    browser = await puppeteer.launch();
  }

  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector('div[data-e2e="user-avatar"]');

  const avatarDiv: any = await page.$('div[data-e2e="user-avatar"]');
  const profileImgUrl = await avatarDiv?.evaluate((el: any) => {
    const imgElement = el.querySelector("img");
    return imgElement ? imgElement.getAttribute("src") : null;
  });

  await browser.close();

  return profileImgUrl;
}
