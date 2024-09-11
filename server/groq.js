const Groq = require("groq-sdk");

const path = require("path");
const { fileToBase64 } = require("./filetoBase64");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function gropImage(url) {
  const pathname = new URL(url).pathname;
  const filePath = path.join(__dirname, pathname);
  const base64 = await fileToBase64(filePath);
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What's in this image?" },
          {
            type: "image_url",
            image_url: { url: base64 },
          },
        ],
      },
    ],
    model: "llava-v1.5-7b-4096-preview",
  });
}
exports.gropImage = gropImage;
