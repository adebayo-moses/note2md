const express = require("express");
const { Client } = require("notion-api-worker");
const TurndownService = require("turndown");
const turndownService = new TurndownService();

const app = express();
const port = process.env.PORT || 3000;

// Notion integration token goes here
const integrationToken = "YOUR_INTEGRATION_TOKEN";

app.use(express.urlencoded({ extended: true }));

app.post("/convert", async (req, res) => {
  const { notionUrl } = req.body;

  if (!notionUrl) {
    return res.status(400).json({ error: "Notion URL is required" });
  }

  const notion = new Client({ auth: integrationToken });

  try {
    const page = await notion.getPageByUrl(notionUrl);

    if (!page) {
      return res.status(404).json({ error: "Notion page not found" });
    }

    const blocks = page.recordMap.block;

    let markdownContent = "";

    for (const blockId in blocks) {
      const block = blocks[blockId].value;

      if (block.type === "text") {
        markdownContent +=
          turndownService.turndown(block.properties.title[0][0]) + "\n\n";
      }
    }

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader("Content-Disposition", `attachment; filename="${page.title[0][0]}.md"`);
    res.send(markdownContent);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: "Error fetching Notion data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
