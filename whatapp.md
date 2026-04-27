下面按自定义开发接入 WhatsApp WABA / WhatsApp Business Platform Cloud API来讲。它更像“企业微信的企业账号 + 应用权限 + 消息 API + 回调事件”，不是普通 WhatsApp App 的扫码登录接口。
一、整体接入方式
推荐走 WhatsApp Business Platform Cloud API。它支持企业用自己的 WhatsApp Business 电话号，通过 API 收发消息、接收 Webhook、管理模板和号码资产；Meta 官方也把 Cloud API 作为开发者接入主线。
典型架构是：
用户 WhatsApp   ↓ 用户发消息Meta WhatsApp Cloud API   ↓ Webhook 回调你的后端服务   ↓ 业务系统 / CRM / 工单 / AI客服 / 人工坐席你的后端调用 Cloud API   ↓Meta 发送 WhatsApp 消息给用户
1. 集成账号有什么要求？
A. 如果是企业自己用
需要准备这些东西：
要求
说明
Meta Business Account / Business Portfolio
类似企业主体，用来管理 WABA、电话号、模板、账单等
WhatsApp Business Account，也就是 WABA
WhatsApp 企业账号资产
Meta Developer App
你的应用，用来申请权限、生成 token、配置 Webhook
WhatsApp Business Phone Number
企业对外展示的 WhatsApp 电话号
Display Name
用户看到的企业名称，需要符合 Meta 的展示名称规范
Access Token
后端调用 API 时使用
Webhook Endpoint
接收用户消息、消息状态、账号状态等事件
Meta 文档里提到 WhatsApp Manager 可管理 WABA、电话号码、模板和数据分析；Cloud API 的快速开始流程包括注册开发者、创建 Meta App、添加电话号码、发送第一条消息、配置测试 Webhook。
电话号需要注册到 WhatsApp Business Platform。业务电话号码要处于可用/connected 状态才能正常用于生产消息发送，并且电话号码会有质量评分和消息限制。
Meta Business Account 初始可注册的业务电话号码数量有限，官方文档提到初始限制为 2 个，可提升到最多 20 个。
B. 如果你是做 SaaS，帮很多客户接入
这种情况不能简单让客户把 token 发给你，推荐走 Embedded Signup，也就是客户点击“连接 WhatsApp”，跳转 Meta 授权，然后把客户的 WABA 和电话号码授权给你的应用。Embedded Signup 成功后，会返回客户的 WABA ID、business phone number ID、可交换的 token code。
如果你的应用是给其他企业使用，需要做 App Review，并为需要的权限申请 Advanced Access；官方文档明确说，其他企业会使用你的 app 时，需要为所需权限申请高级访问权限。
核心权限通常是：
权限
用途
whatsapp_business_messaging
发送 WhatsApp 消息、接收消息相关能力
whatsapp_business_management
管理 WABA 元数据、模板、电话号码等
Meta 权限文档说明，whatsapp_business_management 用于访问 WABA 元数据、模板管理、获取关联的 business phone numbers 等；号码注册等场景也要求 whatsapp_business_management 和 whatsapp_business_messaging。
C. 合规要求
企业主动给用户发 WhatsApp 消息前，需要先获得用户 opt-in，也就是用户同意通过 WhatsApp 接收你的消息。
如果用户先发消息给你，会打开一个 customer service window，在窗口期内可以发送普通非模板消息；如果在窗口外主动联系用户，就需要使用审核通过的 template message。
2. 集成的信息内容能携带哪些信息？
这里要分两类：账号资产信息和消息内容信息。
A. 账号/资产信息
接入后，你通常会保存这些信息：
信息
说明
waba_id
WhatsApp Business Account ID
phone_number_id
发送消息时最关键的号码 ID
business_id
Meta Business 主体 ID
display_name
企业展示名称
phone_number
企业 WhatsApp 电话号
access_token
后端调用 API 的授权凭证
template_name / template_id
消息模板
webhook config
回调地址、verify token、订阅字段
quality / limit 状态
号码质量、消息额度、能力变化
Embedded Signup 会返回 WABA ID、业务电话号码 ID 和可交换 token code；Webhooks 也可以订阅消息、状态、账号能力变化等事件。
B. 可以发送的消息内容
WhatsApp Cloud API 支持多种消息类型，常见包括：
类型
举例
文本消息
普通客服回复
模板消息
验证码、订单通知、营销通知、预约提醒
图片消息
商品图、凭证图、宣传图
文档消息
PDF、报价单、合同、报告
音频 / 视频
语音、视频说明
位置消息
门店位置、配送位置
联系人消息
客服联系方式、业务联系人
交互按钮
最多几个快捷回复按钮
列表消息
菜单、服务选项、订单选项
轮播卡片
多商品、多方案展示
商品 / Catalog
商品目录、商品卡片
Location request
请求用户发送位置
Reaction
表情反应
Flow
表单式流程，例如预约、收集资料、下单流程
Meta 文档分别列出了 template messages、service messages、document messages、image messages、interactive list messages、reply button messages、location request messages、media carousel messages 等能力；媒体消息在 Cloud API 中最大支持 100MB。
模板消息支持变量，例如：
您好 {{1}}，您的订单 {{2}} 已发货，预计 {{3}} 送达。
发送时填入：
{  "1": "张三",  "2": "A123456",  "3": "明天上午"}
Meta 文档说明，模板组件支持变量，发送模板消息时可以通过 Cloud API 提供变量值。
C. Webhook 能接收到什么？
用户给企业发消息时，你的系统会收到 Webhook。通常包含：
字段
说明
用户 WhatsApp 标识
wa_id 或相关用户标识
用户 profile name
用户 WhatsApp 昵称
message id
消息唯一 ID
timestamp
消息时间
message type
text / image / document / location / interactive 等
message content
文本内容、媒体 ID、按钮点击值、列表选择值等
business phone number id
收到消息的企业号码 ID
statuses
sent / delivered / read / failed 等消息状态
Meta 的 Webhook 文档说明，messages webhook 描述的是 WhatsApp 用户发给企业的消息，以及企业发给用户的消息状态。
需要注意：你不能读取用户 WhatsApp 里的历史聊天、好友列表、群聊内容。你只能拿到用户与你的企业号发生交互后，通过 Webhook 发给你的事件和内容。
3. 授权是怎么做的？
授权分两种模式。
模式一：企业自用，直接开发
适合：你们公司只接自己的 WhatsApp 企业号。
流程：
1. 创建 Meta Business Account2. 创建 Meta Developer App3. 添加 WhatsApp 产品4. 创建 / 绑定 WABA5. 添加 WhatsApp Business Phone Number6. 生成 System User Access Token7. 给 token 授权：   - whatsapp_business_messaging   - whatsapp_business_management8. 配置 Webhook9. 后端调用 Cloud API 发消息
官方 Access Token Guide 提到，如果是 direct developer，也就是只访问自己企业的数据，使用 System User access token。
发送消息示例：
curl -X POST "https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages" \  -H "Authorization: Bearer {ACCESS_TOKEN}" \  -H "Content-Type: application/json" \  -d '{    "messaging_product": "whatsapp",    "to": "905xxxxxxxxx",    "type": "text",    "text": {      "body": "您好，这是一条 WhatsApp Cloud API 测试消息"    }  }'
其中：
PHONE_NUMBER_ID = 你的 WhatsApp Business 电话号码 IDACCESS_TOKEN    = System User Token 或授权后得到的 Tokento              = 用户 WhatsApp 手机号，通常为国际格式
模式二：多客户 SaaS，用 Embedded Signup
适合：你做一个系统，让很多企业客户自己接入他们的 WhatsApp WABA。
流程：
1. 你的平台提供“连接 WhatsApp”按钮2. 前端打开 Meta Embedded Signup3. 客户登录 Facebook / Meta Business4. 客户选择或创建 WABA5. 客户绑定或选择 WhatsApp Business 电话号6. 客户授权你的 App7. Meta 返回：   - WABA ID   - Phone Number ID   - exchangeable token code8. 你的后端拿 code 换 access token9. 保存客户 WABA / phone_number_id / token10. 配置 Webhook 订阅11. 客户即可通过你的系统收发 WhatsApp 消息
Embedded Signup 依赖 JavaScript SDK；客户完成流程后，会把 WABA ID、business phone number ID 和 exchangeable token code 返回给发起窗口。
你后端保存的数据结构可以这样设计：
whatsapp_accounts- id- tenant_id- meta_business_id- waba_id- phone_number_id- display_phone_number- display_name- access_token_encrypted- token_expires_at- webhook_status- quality_rating- messaging_limit- created_at- updated_at
自定义开发时，后端模块建议这样拆
whatsapp-auth-service  - Embedded Signup 回调  - token 交换  - token 存储 / 刷新 / 加密whatsapp-message-service  - 发送文本消息  - 发送模板消息  - 发送媒体消息  - 发送交互按钮 / 列表whatsapp-webhook-service  - 验证 Webhook  - 接收用户消息  - 接收消息状态  - 幂等处理 message_idconversation-service  - 会话管理  - 24小时窗口判断  - 人工坐席 / 机器人分流template-service  - 模板创建  - 模板审核状态同步  - 模板变量管理media-service  - 上传媒体  - 下载用户发来的媒体  - 文件安全扫描crm-integration-service  - 客户资料绑定  - 订单 / 工单 / 售后系统打通
最小可落地方案
你可以先做一个 MVP：
第一阶段：1. 企业自己 WABA 接入2. 发文本消息3. 接收用户文本消息4. 接收 delivered / read / failed 状态5. 支持模板消息第二阶段：1. 支持图片 / 文档2. 支持按钮 / 列表3. 支持人工坐席4. 支持 CRM 客户绑定第三阶段：1. Embedded Signup 多租户授权2. 模板管理3. 自动化流程4. AI 客服 / RAG 知识库5. 统计报表
关键注意点
不要用非官方 WhatsApp Web 扫码协议。生产系统应走 WhatsApp Business Platform / Cloud API，否则容易封号、不可控。
主动营销必须谨慎。用户 opt-in、模板审核、消息频率、质量评分都会影响账号能力。Meta 的 Business Messaging Policy 说明，违规可能导致 WhatsApp Business Services 访问被限制或移除。
24 小时窗口很重要。用户主动发消息后，可以在 customer service window 内发普通消息；窗口外主动触达要用模板消息。
如果你要做 AI 客服，建议定位为“企业客服、订单查询、售后、预约、业务问答”等业务功能，不要做成通用 ChatGPT 式入口。近期 Meta 对“通用 AI 助手作为核心功能接入 WhatsApp Business API”有政策变化和争议，业务客服类场景仍是官方平台的主要目标。
一句话总结：
自定义开发 WhatsApp 集成，本质是接 Meta Cloud API：用 WABA + Phone Number ID + Access Token 发消息，用 Webhook 收消息；企业自用走 System User Token，多客户 SaaS 走 Embedded Signup 授权。
