# md2png-cli

Markdown 转精美图片的命令行工具，支持多种主题和尺寸。

## 效果预览

<p align="center">
  <img src="https://raw.githubusercontent.com/qiulanzhu/pm2png/refs/heads/main/examples/preview-note.png" width="280" alt="便签主题" />
  <img src="https://raw.githubusercontent.com/qiulanzhu/pm2png/refs/heads/main/examples/preview-dark.png" width="280" alt="暗黑主题" />
  <img src="https://raw.githubusercontent.com/qiulanzhu/pm2png/refs/heads/main/examples/preview-sakura.png" width="280" alt="樱花主题" />
</p>

<p align="center">
  <b>便签 (note)</b> &nbsp;&nbsp;&nbsp;&nbsp;
  <b>暗黑 (dark)</b> &nbsp;&nbsp;&nbsp;&nbsp;
  <b>樱花 (sakura)</b>
</p>

## 安装

```bash
npm install -g md2png-cli
```

## 使用

```bash
# 直接传入 Markdown 文本
md2png "# Hello World"

# 从文件读取
md2png README.md -o readme.png

# 指定主题和尺寸
md2png "# 标题" -t dark -s laptop

# 组合使用
md2png ./doc.md -t sakura -s mobile -o beautiful.png
```

## 选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-o, --output <file>` | 输出文件路径 | `output.png` |
| `-t, --theme <theme>` | 主题名称 | `note` |
| `-s, --size <size>` | 尺寸规格 | `tablet` |
| `-h, --help` | 显示帮助信息 | - |

## 主题

| 名称 | 说明 |
|------|------|
| `note` | 便签风格 |
| `vitality` | 元气渐变 |
| `gradient` | 粉绿渐变 |
| `antiquity` | 古风纹理 |
| `classic` | 经典灰色 |
| `dark` | 暗黑模式 |
| `minimal` | 极简风格 |
| `sakura` | 樱花粉色 |
| `ocean` | 海洋蓝色 |
| `tech` | 科技赛博 |

## 尺寸

| 名称 | 宽度 | 说明 |
|------|------|------|
| `mobile` | 20rem | 移动端 |
| `tablet` | 28rem | 平板端 |
| `laptop` | 50rem | 电脑端 |
| `desktop` | 60rem | 超级屏 |

## 致谢

本项目基于 [markdown2png](https://github.com/nicejade/markdown2png) 修改而来。

## 依赖

- [marked](https://github.com/markedjs/marked) - Markdown 解析
- [puppeteer](https://github.com/puppeteer/puppeteer) - 浏览器渲染截图

## License

MIT
