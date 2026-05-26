$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$inputFiles = @(
  (Join-Path $root 'frontend_detail_comparison_template_v3_full.html'),
  (Join-Path $root 'frontend_detail_comparison_template_v4_extended.html'),
  (Join-Path $root 'frontend_detail_comparison_template_v5_complete.html')
)
$outputFile = Join-Path $root 'frontend_detail_comparison_template_all_in_one.html'

$notes = [ordered]@{
  '01' = @(
    'font-weight: 650、letter-spacing: -0.05em、line-height: 0.97 和 max-width: 11ch 让标题更紧、更有重心；15px / 1.65 的正文节奏也更稳。',
    '这是实际项目里非常常见的写法，尤其在 landing page、营销页和产品首页中，通常会和品牌字体、断点一起微调。'
  )
  '02' = @(
    'grid-template-columns: 3fr 2fr、align-items: end 和更克制的文案宽度一起拉出了主次层级，让页面重心不再平均分散。',
    '属于真实开发里的常见布局方式，一般会用 Grid 或 Flex 组合实现，并补上移动端断点。'
  )
  '03' = @(
    'outline: 1px solid rgba(...)、更轻的 box-shadow，以及卡片内侧高光，让边界更细腻，不会像厚边框那样生硬。',
    '这是很常见的卡片处理手法，但实际项目里通常会沉淀成 design token，而不是每张卡片单独硬编码。'
  )
  '04' = @(
    'padding: 10px 16px、border-radius: 999px、font-weight: 600 和统一的边界处理，让按钮体积更克制、视觉更整齐。',
    '非常符合实际开发习惯，通常会做成 Button 组件的 size 和 variant，不会在页面里散落手写。'
  )
  '05' = @(
    '18px / 1.7 的正文节奏、较轻的文字颜色，以及 strong 的字距收紧，让卖点读起来像一句完整说明，而不是碎块堆叠。',
    '这类写法在 feature list、卖点区和产品说明区很常见，通常通过内容组件或富文本样式统一输出。'
  )
  '06' = @(
    'font-family: ui-monospace、letter-spacing: 0.18em 和 text-transform: uppercase 会明显强化标签感与识别度。',
    '实际开发里常见于 eyebrow、section label、数据标签，但是否使用等宽字体要看整体品牌风格，不是通用强制项。'
  )
  '07' = @(
    'max-width: 40ch 搭配 line-height: 1.65，把每行字数压在舒适区间里，阅读节奏会马上变顺。',
    '这是正文排版里非常实用的真实做法，尤其适合介绍文案、说明文和摘要区。'
  )
  '08' = @(
    'border-left、border-right、顶部和底部细线，再配合统一 padding，形成了更稳定的页面画布与栅格边界。',
    '这种 canvas grid 更常见于品牌页、作品集或设计感较强的后台首页；真实项目会作为页面容器规范来复用。'
  )
  '09' = @(
    'outline、border-radius: 18px、box-shadow 和 backdrop-filter: blur(8px) 让导航既有层次又不过分厚重。',
    '实际开发很常见，但 backdrop-filter 上线前要看浏览器兼容和性能，后台系统里也常用更保守的纯色方案。'
  )
  '10' = @(
    '1px 的低对比边框、14px 圆角、半透明背景，以及 focus 时的边框色和外发光，让输入框更像可交互控件而不是静态盒子。',
    '这是非常标准的实际开发写法，通常会做成统一的 Input 组件，把默认态、hover 和 focus 态一次封装好。'
  )
  '11' = @(
    'outline、22px 圆角、分层阴影，以及 featured 卡片的轻微上移和渐变背景，共同建立了主卡的优先级。',
    '真实项目里很常见，尤其在 pricing、plan selector 和套餐页；常见做法是组件化并配合状态类切换。'
  )
  '12' = @(
    '400px 的克制宽度、22px 圆角、模糊背景和更深一层的阴影，让弹窗层级更清楚，也更像浮在页面上方。',
    '属于常见的实际开发模式，不过 blur 效果会因产品风格和兼容性要求决定是否保留。'
  )
  '13' = @(
    '表头的 uppercase 与 letter-spacing、统一 padding，以及 hover 行背景，能快速建立表格层级和扫描节奏。',
    '这是非常真实的数据表格写法，实际项目里还会继续补齐 sticky header、排序、空态和响应式策略。'
  )
  '14' = @(
    '手机容器的 outline、30px 圆角、外层投影，以及内部卡片的边界控制，让移动端首屏更像完整产品而不是简单缩略图。',
    '属于真实展示页常用手法，但上线时通常会结合真实断点、设备安全区和更完整的移动端组件规范。'
  )
  '15' = @(
    '无边框的 pill 形态、font-weight: 600，以及 active 态的浅色背景和 inset 细边，让 tab 更像导航状态而不是按钮集合。',
    '这是设计系统里很常见的 Tabs 做法，实际开发会再补 keyboard focus、hover 与 aria 状态。'
  )
  '16' = @(
    'sidebar 的浅 outline、18px 圆角、半透明背景，再配 active 项的低饱和高亮和字重提升，让导航更安静。',
    '实际后台系统里很常见，通常会抽象成导航容器和 menu item 组件，统一 active / hover 规则。'
  )
  '17' = @(
    '图标容器的渐变背景、轻 outline、阴影，以及文案 max-width 控制，让 empty state 更像引导而不是简单占位。',
    '这是非常常见的真实写法，尤其适合空列表、首次使用和零数据页面；通常会复用成 EmptyState 组件。'
  )
  '18' = @(
    'toast / alert 的轻 outline、16px 圆角、柔和阴影，加上 info 态的浅渐变背景，让提示更有层次又不刺眼。',
    '符合实际开发方式，通常会继续配不同 severity token，并接入自动关闭、图标和动画。'
  )
  '19' = @(
    'search 与 filter 统一使用 10px 12px 内边距、14px 圆角、低对比边框和半透明背景，让工具条看起来是一套系统。',
    '这就是实际项目里常见的工具栏写法，通常会做成输入框、筛选器和排序器的统一样式族。'
  )
  '20' = @(
    'widget 的 outline、18px 圆角、分层阴影，以及 metric 的负字距，让信息卡片更稳、更像仪表盘部件。',
    '属于非常常见的 dashboard 设计模式，真实开发里会再结合骨架屏、数据状态和图表组件。'
  )
  '21' = @(
    '22px 的卡片内边距、22px 圆角、半透明白底和浅 outline，让登录框既聚焦又不压迫；标题字距收紧也会更显精致。',
    '这是实际登录页常见的视觉写法，项目里一般会在 Auth layout 组件层处理容器和表单样式。'
  )
  '22' = @(
    'setting 卡片的轻 outline、18px 圆角、柔和阴影，再配开关的浅蓝底色，让“可配置”状态更明显。',
    '这种写法在设置页里很常见，真实项目会把卡片和 switch 一并做成可复用组件。'
  )
  '23' = @(
    '较小的 padding、12px 圆角、font-weight: 600，以及 active 页的深色反白处理，让分页控件更紧凑、状态更明确。',
    '这是实际产品里很常见的分页处理方式，项目中通常还会补禁用态、悬停态和小屏折叠逻辑。'
  )
  '24' = @(
    'trigger 的 14px 圆角、低对比边框，以及 menu 的 outline 和 16px 圆角，共同让下拉容器更像一个完整层级。',
    '属于真实开发的常规写法，实际项目还会配合弹层定位、键盘操作和选中项滚动定位。'
  )
  '25' = @(
    'drawer 的 outline、24px 顶部圆角、向上的分层阴影，以及更轻的 handle 色块，让组件层级和可拖拽感更明确。',
    '很符合真实产品做法，但生产环境里通常会额外处理动效、遮罩、焦点锁定和手势交互。'
  )
  '26' = @(
    'step-dot 的浅蓝底和 outline、step-card 的轻边界与圆角，让步骤状态更清楚，同时避免传统流程条那种笨重感。',
    '这是常见的向导式流程写法，真实开发还会加入 completed、current、error 等状态映射。'
  )
  '27' = @(
    'day 的统一底色、active 态深色反白，以及 range 态的浅蓝衔接，能马上建立日期选择的主次关系。',
    '这是日历控件里非常常见的生产写法，实际项目还会处理不可选日期、键盘导航和月份切换。'
  )
  '28' = @(
    '2px 虚线边框、22px 圆角、浅渐变底色和额外 outline，让上传区既像拖拽热区，又不会显得太重。',
    '非常常见于上传组件，真实开发会再配合 dragover 状态、进度条、文件校验和错误提示。'
  )
  '29' = @(
    'detail-card 的 outline、18px 圆角、柔和阴影，以及 metric 的负字距，让详情页的信息块更稳、更好扫读。',
    '这就是实际后台详情页常见的卡片化手法，项目中一般会再补响应式分栏和字段组件规范。'
  )
  '30' = @(
    'avatar 的渐变背景、outline、阴影，以及 chip 的浅色背景和边框，让个人页信息层级更完整，也更有身份感。',
    '属于真实账号页和成员页里常见的样式组织方式，实际开发通常会把 avatar、tag、meta row 全部组件化。'
  )
}

function Get-FileText([string]$path) {
  return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

function Add-ProExplanation([string]$sectionHtml) {
  $idMatch = [regex]::Match($sectionHtml, '<p class="eyebrow">(\d{2})\s*/')
  if (-not $idMatch.Success) {
    throw '无法识别 section 编号。'
  }

  $sectionId = $idMatch.Groups[1].Value
  if (-not $notes.Contains($sectionId)) {
    throw "缺少 section $sectionId 的说明文案。"
  }

  $why = $notes[$sectionId][0]
  $practice = $notes[$sectionId][1]
  $extra = @"
<div class="why-note">
  <div class="why-title">专业效果说明</div>
  <p><strong>关键属性：</strong>$why</p>
  <p><strong>是否属于实际开发用法：</strong>$practice</p>
</div>
"@

  $pattern = '(?s)(<div class="panel">\s*<div class="label"><span class="dot good"></span>专业效果 \+ CSS</div>.*?<aside class="code-note">.*?</code>)(</aside>)'
  $result = [regex]::Replace($sectionHtml, $pattern, "`$1$extra`$2")
  if ($result -eq $sectionHtml) {
    throw "section $sectionId 未成功插入专业效果说明。"
  }

  return $result
}

$styleBlocks = New-Object System.Collections.Generic.List[string]
$sections = New-Object System.Collections.Generic.List[string]

foreach ($file in $inputFiles) {
  $raw = Get-FileText $file

  $styleMatch = [regex]::Match($raw, '(?s)<style>\s*(.*?)\s*</style>')
  if (-not $styleMatch.Success) {
    throw "未找到样式块: $file"
  }
  [void]$styleBlocks.Add($styleMatch.Groups[1].Value.Trim())

  $sectionMatches = [regex]::Matches($raw, '(?s)<section class="section">.*?</section>')
  if ($sectionMatches.Count -eq 0) {
    throw "未找到内容区块: $file"
  }

  foreach ($match in $sectionMatches) {
    [void]$sections.Add($match.Value.Trim())
  }
}

if ($sections.Count -ne 30) {
  throw "预期合并 30 个模块，实际找到 $($sections.Count) 个。"
}

$mergedSections = foreach ($section in $sections) {
  Add-ProExplanation $section
}

$customStyle = @'
.hero-quick{
  display:grid;
  grid-template-columns:repeat(3, minmax(0,1fr));
  gap:12px;
  margin:0 0 28px;
  padding:0 8px;
}
.quick-card{
  background:linear-gradient(180deg, rgba(255,255,255,.94), rgba(255,255,255,.82));
  border:1px solid rgba(15,23,42,.08);
  border-radius:20px;
  padding:16px 18px;
  box-shadow:0 12px 30px rgba(15,23,42,.06);
}
.quick-card .eyebrow{
  margin-bottom:10px;
}
.quick-card strong{
  display:block;
  font-size:24px;
  letter-spacing:-.04em;
  margin-bottom:4px;
}
.quick-card p{
  margin:0;
  color:#64748b;
  font-size:14px;
  line-height:1.65;
}
.why-note{
  margin-top:12px;
  padding-top:12px;
  border-top:1px solid rgba(148,163,184,.18);
  font-family:var(--sans);
}
.why-title{
  font-size:12px;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:#93c5fd;
  font-weight:700;
  margin-bottom:8px;
}
.why-note p{
  margin:8px 0 0;
  color:#cbd5e1;
  font-size:12px;
  line-height:1.7;
}
.why-note strong{
  color:#f8fafc;
}
@media (max-width: 960px){
  .hero-quick{
    grid-template-columns:1fr;
  }
}
'@

$allStyles = ($styleBlocks + $customStyle) -join "`r`n`r`n"
$sectionsHtml = $mergedSections -join "`r`n`r`n"

$html = @"
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>前端专业细节全模块对比模板（合并版）</title>
  <style>
$allStyles
  </style>
</head>
<body>
  <div class="page">
    <div class="canvas">
      <section class="hero">
        <div>
          <p class="eyebrow">Frontend Detail Lab / All In One</p>
          <h1>前端 CSS 专业细节总对照页</h1>
          <p>把 <span class="kbd">css_dev</span> 下 3 份模板合并为 1 份总表。左侧保留原始效果与原始 CSS，右侧展示专业效果、专业 CSS，并额外说明哪些属性在拉开专业感，以及这些写法在实际开发中的使用方式。</p>
        </div>
        <div class="actions">
          <button class="btn">30 个模块总览</button>
          <button class="btn secondary">左原始 / 右专业 / 右侧含解释</button>
        </div>
      </section>

      <section class="hero-quick">
        <div class="quick-card">
          <p class="eyebrow">Coverage</p>
          <strong>30</strong>
          <p>从 Typography、Layout 一直到 Profile / Account Page，三份模板内容已按编号顺序整合。</p>
        </div>
        <div class="quick-card">
          <p class="eyebrow">Comparison</p>
          <strong>2 Columns</strong>
          <p>左侧始终是原始效果，右侧始终是专业效果，版式和阅读路径保持一致，便于逐项对照。</p>
        </div>
        <div class="quick-card">
          <p class="eyebrow">Review Focus</p>
          <strong>CSS + 原因</strong>
          <p>两侧都带 CSS 属性；专业侧额外补了“关键属性”和“是否属于实际开发用法”的解释。</p>
        </div>
      </section>

$($mergedSections -join "`r`n`r`n")
      <section class="tips">
        <h3>这份合并版最适合怎么用</h3>
        <ol>
          <li>先只看左右视觉差异，判断你第一眼感受到的“专业感”到底来自哪里。</li>
          <li>再对照两边 CSS，确认差异是来自排版、边界、状态层级，还是信息密度控制。</li>
          <li>最后阅读右侧新增说明，把这些细节判断转成可复用的开发规则，而不是停留在“感觉更高级”。</li>
        </ol>
      </section>

      <div class="foot">合并来源：v3（01-14）+ v4（15-22）+ v5（23-30）。当前文件用于统一浏览、教学对照和前端 code review 训练。</div>
    </div>
  </div>
</body>
</html>
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputFile, $html, $utf8NoBom)
Write-Output "Generated: $outputFile"
