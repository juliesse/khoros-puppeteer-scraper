const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "https://www.bell.ca/Mobility/Smartphones_and_mobile_internet_devices";

(async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const products = [];

    $(".card-container").each((_, el) => {
      const name = $(el).find(".small-title").text().trim();
      const link = $(el).find("a.card-link-js").attr("href");
      const img = $(el).find("img.img-responsive").attr("data-src");

      products.push({ name, link, img });
    });

    console.log(products);
  } catch (error) {
    console.error("Scraping failed:", error.message);
  }
})();
