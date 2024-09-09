const Groq = require("groq-sdk");
const fs = require("fs").promises;
const path = require("path");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function fileToBase64(filePath) {
  try {
    // 读取文件
    const data = await fs.readFile(filePath);

    // 将文件转换为 Base64 字符串
    const base64String = data.toString("base64");

    // 返回 Base64 字符串
    return base64String;
  } catch (err) {
    console.error("Error reading the file:", err);
    throw err; // 抛出错误，方便调用者处理
  }
}

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
