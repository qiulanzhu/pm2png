---
name: md2png
description: 将 Markdown 文档转换为精美 PNG 图片。当用户要求将 markdown 文件、markdown 文本转成图片、截图、png 时触发。支持多种主题（note/dark/sakura/ocean/tech 等）和尺寸（mobile/tablet/laptop/desktop）。
argument-hint: <markdown文件路径或文本> [-t 主题] [-s 尺寸] [-o 输出路径]
allowed-tools: Bash, Read, Write, Glob
---

# md2png — Markdown 转 PNG 图片

将 Markdown 内容渲染为精美的 PNG 图片，支持 10 种主题和 4 种尺寸。

## 使用方式

用户通过 `/md2png` 调用，传入参数 `$ARGUMENTS`。

## 执行步骤

1. **解析参数**：从 `$ARGUMENTS` 中识别：
   - Markdown 文件路径或直接文本内容（必填）
   - `-t` 或 `--theme`：主题名称（可选，默认 `note`）
   - `-s` 或 `--size`：尺寸规格（可选，默认 `tablet`）
   - `-o` 或 `--output`：输出文件路径（可选，默认 `output.png`）

2. **检查输入**：
   - 如果参数是文件路径，确认文件存在
   - 如果参数为空，提示用户提供 Markdown 文件路径或文本

3. **检查 md2png 是否已安装**：运行 `which md2png || command -v md2png` 检查。如果未安装，提示用户先执行：
   ```bash
   npm install -g md2png-cli
   ```
   确认安装成功后再继续。

4. **执行转换**：运行以下命令：
   ```bash
   md2png <输入> -t <主题> -s <尺寸> -o <输出路径>
   ```
   - 如果输入是文件路径，直接传入
   - 如果输入是文本内容，用双引号包裹传入

5. **展示结果**：
   - 告知用户图片已生成及保存路径
   - 用 Read 工具读取生成的 PNG 图片，展示给用户预览

## 可用主题

| 主题 | 名称 | 风格 |
|------|------|------|
| `note` | 便签 | 暖黄便签风格，适合笔记 |
| `vitality` | 元气 | 蓝紫渐变，活泼明亮 |
| `gradient` | 渐变 | 粉绿渐变，清新自然 |
| `antiquity` | 古风 | 古典纹理，国风韵味 |
| `classic` | 经典 | 灰色背景，简约大方 |
| `dark` | 暗黑 | 深色主题，适合代码 |
| `minimal` | 极简 | 浅灰渐变，干净利落 |
| `sakura` | 樱花 | 粉色渐变，浪漫唯美 |
| `ocean` | 海洋 | 蓝色渐变，沉稳大气 |
| `tech` | 科技 | 赛博朋克，荧光酷炫 |

## 可用尺寸

| 尺寸 | 名称 | 宽度 |
|------|------|------|
| `mobile` | 移动端 | 20rem |
| `tablet` | 平板端 | 28rem |
| `laptop` | 电脑端 | 50rem |
| `desktop` | 超级屏 | 60rem |

## 示例

- `/md2png README.md` — 用默认主题转换文件
- `/md2png README.md -t dark -o readme.png` — 暗黑主题输出为 readme.png
- `/md2png "# Hello World" -t sakura -s mobile` — 樱花主题移动端尺寸
