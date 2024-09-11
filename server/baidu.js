const axios = require("axios");
const path = require("path");
const { fileToBase64 } = require("./filetoBase64");
async function baiduImage(url) {
  const pathname = new URL(url).pathname.replace(/^\/api/, "");
  const filePath = path.join(__dirname, pathname);
  const base64 = await fileToBase64(filePath);

  const res1 = await axios.get("https://aip.baidubce.com/oauth/2.0/token", {
    params: {
      grant_type: "client_credentials",
      client_id: process.env.BAIDU_API_KEY,
      client_secret: process.env.BAIDU_CLIENT_SECRET,
    },
  });

  const response = await axios.post(
    `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${res1.data.access_token}`,
    {
      image: encodeURI(base64),
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data?.result?.[0]?.name ?? "Recogonize failed!";
}
exports.baiduImage = baiduImage;
