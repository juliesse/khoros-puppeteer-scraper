const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Web Scraper!');
});

// Scrape route
app.get('/scrape', async (req, res) => {
  try {
    const url = 'https://example.com'; // Replace with the target URL
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Example: scrape all anchor hrefs
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) links.push(href);
    });

    res.json({ links });
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
