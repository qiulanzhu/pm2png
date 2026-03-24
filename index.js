#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

// 检查 puppeteer 是否安装
let puppeteer
try {
  puppeteer = require('puppeteer')
} catch (e) {
  console.error('错误: 请先安装 puppeteer')
  console.error('运行: pnpm add puppeteer -D')
  process.exit(1)
}

// 主题配置
const THEMES = {
  note: { name: '便签', boxBg: '#fffcf5', contentBorder: '1px solid #e8e5dc' },
  vitality: { name: '元气', boxBg: 'linear-gradient(225deg, #9cccfc 0, #e6cefd 99.54%)' },
  gradient: { name: '渐变', boxBg: 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)' },
  antiquity: { name: '古风', boxBg: '#e9e7d9' },
  classic: { name: '经典', boxBg: '#f2f2f2' },
  dark: { name: '暗黑', boxBg: 'linear-gradient(to right, #434343 0%, black 100%)' },
  minimal: { name: '极简', boxBg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  sakura: { name: '樱花', boxBg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)' },
  ocean: { name: '海洋', boxBg: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 50%, #06b6d4 100%)' },
  tech: { name: '科技', boxBg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
}

// 尺寸配置
const SIZES = {
  laptop: { name: '电脑端', width: '50rem', padding: '3rem' },
  mobile: { name: '移动端', width: '20rem', padding: '1.2rem', fontSize: '0.9rem' },
  tablet: { name: '平板端', width: '28rem', padding: '1rem' },
  desktop: { name: '超级屏', width: '60rem', padding: '4rem' },
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    input: null,
    output: null,
    theme: 'note',
    size: 'tablet', // 默认平板端
    help: false,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '-h' || arg === '--help') {
      options.help = true
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i]
    } else if (arg === '-t' || arg === '--theme') {
      options.theme = args[++i]
    } else if (arg === '-s' || arg === '--size') {
      options.size = args[++i]
    } else if (!arg.startsWith('-')) {
      options.input = arg
    }
  }

  return options
}

// 显示帮助信息
function showHelp() {
  console.log(`
md2png - Markdown 转图片命令行工具

使用方法:
  md2png <markdown内容或文件路径> [选项]

选项:
  -o, --output <file>   输出文件路径 (默认: output.png)
  -t, --theme <theme>   主题 (默认: note)
  -s, --size <size>     尺寸 (默认: tablet 平板端)
  -h, --help            显示帮助信息

可用主题:
  ${Object.entries(THEMES).map(([k, v]) => `${k} (${v.name})`).join(', ')}

可用尺寸:
  ${Object.entries(SIZES).map(([k, v]) => `${k} (${v.name})`).join(', ')}

示例:
  md2png "# Hello World"
  md2png README.md -o readme.png
  md2png "# 标题" -t dark -s laptop
  md2png ./doc.md -t sakura -o beautiful.png
`)
}

// 生成 HTML 模板
function generateHTML(markdownContent, theme, size) {
  const themeConfig = THEMES[theme] || THEMES.note
  const sizeConfig = SIZES[size] || SIZES.tablet

  const htmlContent = marked.parse(markdownContent, { breaks: true })

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
                   'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      padding: 0;
    }

    .container {
      width: ${sizeConfig.width};
    }

    .wrapper {
      padding: ${sizeConfig.padding};
      background: ${themeConfig.boxBg};
      ${theme === 'antiquity' ? `background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVQoU2NkIBIwEqmOgQFJITsQfw/i/wfivxD+f0b8JjKi8v+jK0S2EcMCrArRHYFsI1ENQ7aRaIXoNpJkIQBq7BGLphN6SQAAAABJRU5ErkJggg=='); background-repeat: repeat;` : ''}
    }

    .content {
      position: relative;
      background: ${getContentBg(theme)};
      border-radius: ${getContentRadius(theme)};
      ${themeConfig.contentBorder ? `border: ${themeConfig.contentBorder};` : ''}
      ${theme === 'note' ? 'position: relative;' : ''}
    }

    ${theme === 'note' ? `
    .content::before {
      position: absolute;
      content: '';
      left: 3px;
      right: 3px;
      bottom: 3px;
      top: 3px;
      border: 1px solid #e8e5dc;
      z-index: 0;
    }` : ''}

    ${theme === 'antiquity' ? `
    .content {
      border: 3px solid #c02c38;
      padding: 1rem;
    }` : ''}

    .editor {
      padding: 1rem;
      min-height: 8rem;
      font-size: ${sizeConfig.fontSize || '1rem'};
      line-height: 1.8;
      color: ${getTextColor(theme)};
      ${getEditorBg(theme)}
    }

    /* Markdown 样式 */
    .editor h1 { font-size: 1.8em; font-weight: bold; margin: 0.8em 0 0.5em; }
    .editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.8em 0 0.5em; }
    .editor h3 { font-size: 1.25em; font-weight: bold; margin: 0.6em 0 0.4em; }
    .editor h4 { font-size: 1.1em; font-weight: bold; margin: 0.5em 0 0.3em; }
    .editor p { margin: 0.5em 0; }
    .editor ul, .editor ol { padding-left: 1.5em; margin: 0.5em 0; }
    .editor li { margin: 0.25em 0; }
    .editor code {
      background: ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
      padding: 0.15em 0.4em;
      border-radius: 3px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.9em;
    }
    .editor pre {
      background: ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'};
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
      margin: 0.8em 0;
    }
    .editor pre code {
      background: transparent;
      padding: 0;
    }
    .editor blockquote {
      border-left: 4px solid ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'};
      padding-left: 1em;
      margin: 0.8em 0;
      color: ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'};
    }
    .editor a {
      color: ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? '#60a5fa' : '#3b82f6'};
      text-decoration: none;
    }
    .editor a:hover { text-decoration: underline; }
    .editor hr {
      border: none;
      border-top: 1px solid ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
      margin: 1em 0;
    }
    .editor table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.8em 0;
    }
    .editor th, .editor td {
      border: 1px solid ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
      padding: 0.5em 0.8em;
      text-align: left;
    }
    .editor th {
      background: ${theme === 'dark' || theme === 'ocean' || theme === 'tech' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'};
    }
    .editor img {
      max-width: 100%;
      height: auto;
    }
    .editor strong { font-weight: bold; }
    .editor em { font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <div class="wrapper">
      <div class="content">
        <div class="editor">${htmlContent}</div>
      </div>
    </div>
  </div>
</body>
</html>`
}

function getContentBg(theme) {
  const bgMap = {
    note: 'transparent',
    vitality: '#f2f2f2',
    gradient: 'transparent',
    antiquity: 'transparent',
    classic: '#f2f2f2',
    dark: 'transparent',
    minimal: '#ffffff',
    sakura: 'rgba(255, 255, 255, 0.7)',
    ocean: 'rgba(255, 255, 255, 0.15)',
    tech: 'transparent',
  }
  return bgMap[theme] || 'transparent'
}

function getContentRadius(theme) {
  const radiusMap = {
    vitality: '1rem',
    sakura: '0.75rem',
    ocean: '1rem',
    minimal: '0.5rem',
  }
  return radiusMap[theme] || '0'
}

function getTextColor(theme) {
  const colorMap = {
    dark: '#f2f2f2',
    ocean: '#ffffff',
    tech: '#00ffff',
  }
  return colorMap[theme] || '#1f2937'
}

function getEditorBg(theme) {
  const bgMap = {
    dark: 'background: transparent;',
    ocean: 'background: transparent; backdrop-filter: blur(8px);',
    tech: 'background: rgba(0, 0, 0, 0.4); border-radius: 0.25rem; box-shadow: 0 0 10px rgba(0, 255, 255, 0.2); text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);',
    sakura: 'background: transparent; backdrop-filter: blur(4px);',
    gradient: 'background: transparent;',
    bbburst: 'background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(2px);',
  }
  return bgMap[theme] || ''
}

// 主函数
async function main() {
  const options = parseArgs()

  if (options.help) {
    showHelp()
    process.exit(0)
  }

  if (!options.input) {
    console.error('错误: 请提供 Markdown 内容或文件路径')
    console.error('使用 md2png --help 查看帮助')
    process.exit(1)
  }

  // 判断输入是文件还是直接内容
  let markdownContent = options.input
  if (fs.existsSync(options.input)) {
    markdownContent = fs.readFileSync(options.input, 'utf-8')
    console.log(`读取文件: ${options.input}`)
  }

  // 验证主题
  if (!THEMES[options.theme]) {
    console.error(`错误: 未知主题 "${options.theme}"`)
    console.error(`可用主题: ${Object.keys(THEMES).join(', ')}`)
    process.exit(1)
  }

  // 验证尺寸
  if (!SIZES[options.size]) {
    console.error(`错误: 未知尺寸 "${options.size}"`)
    console.error(`可用尺寸: ${Object.keys(SIZES).join(', ')}`)
    process.exit(1)
  }

  // 生成输出文件名
  const outputPath = options.output || 'output.png'

  console.log(`主题: ${THEMES[options.theme].name}`)
  console.log(`尺寸: ${SIZES[options.size].name}`)
  console.log(`输出: ${outputPath}`)

  // 生成 HTML
  const html = generateHTML(markdownContent, options.theme, options.size)

  // 使用 puppeteer 渲染
  console.log('正在渲染图片...')

  let browser = null
  try {

    const system = process.platform.toLowerCase();
    if (system === 'win32') {
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
          ],
        })
    } else{
        browser = await puppeteer.launch({
          executablePath: "/usr/bin/chromium-browser",
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
          ],
        })
    }

    const page = await browser.newPage()

    // 设置视口大小
    const sizeConfig = SIZES[options.size]
    const widthPx = parseFloat(sizeConfig.width) * 16 // rem to px
    await page.setViewport({
      width: Math.ceil(widthPx + 100),
      height: 800,
      deviceScaleFactor: 2, // 高清
    })

    await page.setContent(html, { waitUntil: 'load' })

    // 等待页面稳定
    await new Promise(resolve => setTimeout(resolve, 500))

    // 等待字体加载
    await page.evaluate(() => document.fonts.ready)

    // 获取容器元素并截图
    const container = await page.$('.container')
    if (container) {
      await container.screenshot({
        path: outputPath,
        type: 'png',
        omitBackground: true,
      })
      console.log(`图片已保存: ${path.resolve(outputPath)}`)
    } else {
      console.error('错误: 无法找到容器元素')
    }
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

main().catch((error) => {
  console.error('错误:', error.message)
  process.exit(1)
})
