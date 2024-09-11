const fs = require("fs").promises;
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
exports.fileToBase64 = fileToBase64;
