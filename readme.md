## Install dependecies

`npm run setup`

## Start this demo

`npm run dev`

## Online demo

https://agent-editor-29rr.vercel.app/

## Features

- [x] Text transform

- [x] Image recogonization

- [x] Branch Determination

- [x] Keeping State on refresh

## Troubleshooting

用到的谷歌开源模型，要翻墙才能使用。

这时要取消注释 package.json 的这一行：

```json
 // "postinstall": "patch-package",
```

再重新运行`npm run setup`

并且要让你的翻墙软件暴露的端口是 7890.（clash 默认就是这个端口）
