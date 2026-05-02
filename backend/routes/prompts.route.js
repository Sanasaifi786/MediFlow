const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const PROMPTS_DIR = path.join(__dirname, "../prompts");

// GET /api/prompts - List all prompt files and their content
router.get("/", (req, res) => {
  try {
    const files = fs.readdirSync(PROMPTS_DIR);
    const prompts = files
      .filter(file => file.endsWith(".js"))
      .map(file => {
        const content = fs.readFileSync(path.join(PROMPTS_DIR, file), "utf8");
        return { name: file, content };
      });
    
    res.json({ success: true, prompts });
  } catch (error) {
    console.error("Error reading prompts:", error);
    res.status(500).json({ success: false, error: "Could not read prompt files" });
  }
});

// POST /api/prompts/update - Update a specific prompt file
router.post("/update", (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ success: false, error: "Name and content are required" });
  }

  // Security: Prevent path traversal
  const fileName = path.basename(name);
  const filePath = path.join(PROMPTS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: "Prompt file not found" });
  }

  try {
    fs.writeFileSync(filePath, content, "utf8");
    res.json({ success: true, message: `Prompt ${fileName} updated successfully` });
  } catch (error) {
    console.error("Error updating prompt:", error);
    res.status(500).json({ success: false, error: "Could not update prompt file" });
  }
});

module.exports = router;
