const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const path = require("path");
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function GeminiText(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error(error);
  }
}

async function GeminiImage(url) {
  const pathname = new URL(url).pathname;
  const filePath = path.join(__dirname, pathname);
  const fileManager = new GoogleAIFileManager(API_KEY);

  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType: `image/${path.extname(filePath).replace(/^\./, "")}`,
    displayName: "an image",
  });
  // View the response.
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  try {
    const result = await model.generateContent([
      "Tell me about this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    return result.response.text();
  } catch (error) {
    throw error;
  }
}

exports.GeminiText = GeminiText;
exports.GeminiImage = GeminiImage;
