const cors = require('cors');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Web Data Scraper!');
});

const urls = [
  "https://www.bell.ca/Mobility/Smartphones_and_mobile_internet_devices",
  "https://www.bell.ca/Mobility/Smartwatches",
  "https://www.bell.ca/Mobility/Tablets",
  "https://www.bell.ca/Mobility/Mobile-Internet-Devices-listing",
  "https://www.bell.ca/Mobility/SIM-cards"
];

app.get('/products', async (req, res) => {
  const allProducts = [];

  for (const url of urls) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        },
      });

      const $ = cheerio.load(data);

      $(".card-container").each((_, el) => {
        const name = $(el).find(".small-title").text().trim();
        const link = $(el).find("a.card-link-js").attr("href");
        const img = $(el).find("img.img-responsive").attr("data-src") ||
                    $(el).find("img.img-responsive").attr("src");

        allProducts.push({
          category: url,
          name,
          link: link ? `https://www.bell.ca${link}` : null,
          img
        });
      });

    } catch (error) {
      console.error(`Scraping failed for ${url}:`, error.message);
    }
  }

  res.json({ products: allProducts });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
