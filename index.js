const express = require("express");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto("https://www.bell.ca/Mobility/Smartphones_and_mobile_internet_devices", { waitUntil: "domcontentloaded" });

    const pageTitle = await page.title();

    await browser.close();
    res.send({ title: pageTitle });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).send("Scraping failed");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
