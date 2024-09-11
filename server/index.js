require("dotenv").config();
const Koa = require("koa");
const { koaBody } = require("koa-body");
const fs = require("fs");
const path = require("path");
const app = new Koa();
const cors = require("@koa/cors");
const { GeminiText, GeminiImage } = require("./gemini");
const { gropImage } = require("./groq");
const PORT = 3000;
// 设置文件上传路径
const uploadDir = path.join(__dirname, "/uploads");
app.use(cors());
// Koa-body 中间件配置，支持文件上传
app.use(
  koaBody({
    multipart: true, // 支持 multipart/form-data
    formidable: {
      uploadDir, // 上传文件的存储路径
      keepExtensions: true, // 保留文件扩展名
      maxFileSize: 5 * 1024 * 1024, // 限制文件大小为5MB
    },
  })
);
function uploadHandler(ctx) {
  const files = ctx.request.files;
  const file = files?.image; // 假设表单中的图片字段名称为 'image'

  if (file) {
    const fileName = path.basename(file.filepath); // 从临时路径中获取文件名
    const fileUrl = `${ctx.origin}/uploads/${fileName}`; // 构建图片的URL

    ctx.body = {
      status: "success",
      message: "Image uploaded successfully!",
      url: fileUrl,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: "error",
      message: "Invalid file type, please upload an image!",
    };
  }
}
function staticImageHandler(ctx) {
  // 提供静态文件服务，返回上传的图片
  const filePath = path.join(__dirname, ctx.url);
  if (fs.existsSync(filePath)) {
    ctx.type = path.extname(filePath); // 设置响应的 Content-Type
    ctx.body = fs.createReadStream(filePath); // 返回文件流
  } else {
    ctx.status = 404;
    ctx.body = "File not found";
  }
}

async function modelHandler(ctx) {
  const nodes = ctx.request.body.data;

  let resultMap = {};

  async function traverseTree(node, lastResult) {
    // 输出当前节点的 data.value
    const type = node.type;
    console.log("start---", type);
    if (type === "ImageModel") {
      lastResult = await gropImage(node.data.value);
    } else {
      lastResult = await GeminiText(
        lastResult ? `${node.data.value}: ${lastResult}` : node.data.value
      );
    }
    console.log("end---", lastResult);
    resultMap[node.id] = lastResult;

    // 如果当前节点有 children，则递归遍历每个子节点
    if (node.children && node.children.length > 0) {
      // node.children.forEach((child) => traverseTree(child));
      for (let child of node.children) {
        const hasCondition = !!child.data.if;
        if (hasCondition) {
          const conditionResult = eval(
            child.data?.if?.replace("{output}", lastResult)
          );
          if (conditionResult) {
            await traverseTree(child, lastResult);
          }
        } else {
          await traverseTree(child, lastResult);
        }
      }
    }
  }

  await traverseTree(nodes[0]);
  // 返回成功响应
  ctx.body = {
    status: "success",
    message: "Nodes and edges received successfully!",
    data: resultMap,
  };
}
// 图片上传接口
app.use(async (ctx) => {
  if (ctx.method === "POST" && ctx.url === "/api/upload-image") {
    uploadHandler(ctx);
  } else if (ctx.method === "GET" && ctx.url.startsWith("/uploads/")) {
    staticImageHandler(ctx);
  } else if (ctx.method === "POST" && ctx.url === "/api/nodes") {
    await modelHandler(ctx);
  } else {
    ctx.status = 404;
    ctx.body = "Not Found";
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
