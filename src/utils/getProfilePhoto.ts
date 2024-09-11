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

    // Intercepta e bloqueia o carregamento de imagens, folhas de estilo e fontes
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'other'].includes(req.resourceType())) {
        req.abort(); // Bloqueia o carregamento de recursos desnecessários
      } else {
        req.continue(); // Continua o carregamento de scripts e documentos essenciais
      }
    });

    // Define o timeout para o carregamento da página e espera que não haja mais requisições de rede por 500ms
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Aumenta o tempo de espera pelo seletor, caso a página demore a carregar
    await page.waitForSelector('div[data-e2e="user-avatar"]', { timeout: 10000 });

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
