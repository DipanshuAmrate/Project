import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";   // FIXED IMPORT
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// SIMPLE SCRAPER — ALWAYS WORKS
app.post("/api/generate-apis", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL required" });
        }

        // Fetch webpage
        const response = await fetch(url);
        const html = await response.text();

        // Load into cheerio
        const $ = cheerio.load(html);

        const items = [];
        $("body *").each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 15) items.push(text);
        });

        res.json({
            success: true,
            url,
            extracted: items.slice(0, 25), // first 25 blocks
            endpoints: [
                {
                    name: "get_extracted_text",
                    method: "GET",
                    path: "/api/extracted",
                    sampleResponse: items.slice(0, 5)
                }
            ]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Scraping failed!",
            details: err.message
        });
    }
});

app.listen(3000, () => console.log("🔥 Server running on port 3000"));
