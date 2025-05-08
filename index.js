const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      // If you run into issues with browser not found, try adding:
      // executablePath: '/usr/bin/chromium-browser',
    });

    const page = await browser.newPage();

    // ✅ Set headers to spoof a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    // ✅ Go to the Bell page
    await page.goto(
      "https://www.bell.ca/Mobility/Smartphones_and_mobile_internet_devices",
      {
        waitUntil: "networkidle2",
      },
    );

    // ✅ Scrape content
    const products = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll(".product-tile").forEach((el) => {
        const name = el.querySelector(".product-name")?.innerText.trim() || "";
        const price =
          el.querySelector(".monthly-price")?.innerText.trim() || "";
        items.push({ name, price });
      });
      return items;
    });

    await browser.close();
    res.json(products);
  } catch (err) {
    console.error("Scraping error:", err); // Logs actual error in Replit
    res.status(500).send("Scraping failed");
  }
});

app.get("/", (req, res) => {
  res.send("Bell scraper is running. Go to /scrape to get data.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
