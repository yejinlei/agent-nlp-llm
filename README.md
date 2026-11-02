# agent-nlp-llm

NLP与大语言模型本体论研究站，单站点双子目录架构，部署于GitHub Pages。

## 站点结构

```
agent-nlp-llm/
├── index.html          # 首页
├── nlp/                # 传统NLP子模块
│   └── index.html
├── llm/                # 大语言模型子模块
│   └── index.html
├── css/                # 样式文件
│   └── style.css
├── js/                 # 脚本文件
│   └── main.js
├── assets/             # 资源文件
└── README.md
```

## 姊妹站点

- [agent-cv](https://yejinlei.github.io/agent-cv/) - 传统计算机视觉本体论研究站
- [agent-yolo](https://yejinlei.github.io/agent-yolo/) - YOLO系列目标检测本体论研究站

## 本地预览

直接用浏览器打开 `index.html` 即可预览，或启动本地服务器：

```bash
python -m http.server 8000
```

然后访问 http://localhost:8000

## 部署

上传所有文件到GitHub仓库main分支根目录，在Settings -> Pages开启main分支部署即可。

## 技术栈

- 纯静态HTML/CSS/JavaScript，无构建依赖
- 支持深色/浅色主题切换
- 响应式设计，适配移动端
- 平滑滚动导航