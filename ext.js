const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const TurndownService = require("turndown");
const turndownService = new TurndownService();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/convert", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Notion URL is required" });
    }

    const response = await axios.get(url);

    if (response.status !== 200) {
      return res.status(404).json({ error: "Notion page not found" });
    }

    const dom = new JSDOM(response.data);
    const markdownContent = turndownService.turndown(dom.window.document.body.innerHTML);

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader("Content-Disposition", "attachment; filename=notion-export.md");
    res.send(markdownContent);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: "Error fetching Notion data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
