import puppeteer from "puppeteer";

export async function scrapeTikTokProfile(url: string) {
  // Iniciar o navegador em modo headless e abrir uma nova página
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navegar para a URL fornecida
  await page.goto(url);

  // Esperar pela div com data-e2e="user-avatar"
  await page.waitForSelector('div[data-e2e="user-avatar"]');

  // Modificação no $SELECTION_PLACEHOLDER$
  const avatarDiv = await page.$('div[data-e2e="user-avatar"]'); // Encontra a div com data-e2e="user-avatar"
  const profileImgUrl = avatarDiv ? await page.evaluate(el => el.querySelector("img")?.getAttribute("src"), avatarDiv) : null; // Seleciona o src da imagem

  // Fechar o navegador
  await browser.close();

  return profileImgUrl;
}
