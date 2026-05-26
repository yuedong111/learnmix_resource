Chapter 20：SPI，高速同步通信

SPI：

Serial Peripheral Interface
串行外设接口

常用 4 根线：

SCK：Serial Clock，时钟
MOSI：Master Out Slave In，主出从入
MISO：Master In Slave Out，主入从出
CS / NSS：片选

特点：

速度比 I2C 快
通信简单
需要更多引脚
一个从设备通常需要一个 CS

常见用途：

SPI Flash
TFT 屏
无线模块
高速 ADC
SD 卡

你可以理解：

SPI 像一条专用高速通道。
主机用 CS 选中谁，就和谁通信。
Chapter 21：ADC，模数转换器

ADC：

Analog to Digital Converter
模数转换器

作用：

把模拟电压转换成数字值

现实世界很多信号是模拟的：

温度
光照
声音
电压
电流
压力

MCU 不能直接理解连续电压，需要 ADC 转成数字。

比如 12 位 ADC：

输入范围：0 ~ 3.3V
数字范围：0 ~ 4095

如果 ADC 读数是 2048，大概代表：

3.3V × 2048 / 4095 ≈ 1.65V

常见概念：

缩写	中文
ADC	模数转换器
Resolution	分辨率
Sampling Time	采样时间
Reference Voltage	参考电压
Channel	通道

注意：

ADC 不是无限精确
电源噪声会影响结果
采样时间太短会不准
模拟前端电路很重要
Chapter 22：DAC，数模转换器

DAC：

Digital to Analog Converter
数模转换器

作用和 ADC 相反：

把数字值转换成模拟电压

比如：

数字 0      -> 0V
数字 2048   -> 1.65V
数字 4095   -> 3.3V

常见用途：

音频输出
模拟电压控制
波形生成
信号源

不是所有 STM32 都有 DAC。

Chapter 23：DMA，直接存储器访问

DMA：

Direct Memory Access
直接存储器访问

它是芯片里的“搬运工”。

正常情况下，数据搬运要 CPU 干：

外设数据寄存器 -> CPU -> 内存

用了 DMA 后：

外设数据寄存器 -> DMA -> 内存

CPU 可以少干很多活。

常见用途：

串口 DMA 接收
ADC DMA 连续采样
SPI DMA 刷屏
I2C DMA 传输
内存到内存拷贝

比如 ADC 连续采样：

ADC 每采一个值
DMA 自动放进数组
CPU 不用每次都处理

你可以理解：

CPU 是老板
DMA 是搬运工
老板不用自己一箱一箱搬货
Chapter 24：Watchdog，看门狗

Watchdog：

看门狗

它的作用是：

防止程序死机后一直卡住

你可以理解成：

程序必须定期“喂狗”
如果长时间不喂狗
看门狗认为程序死了
于是复位芯片

常见类型：

缩写	英文	中文
IWDG	Independent Watchdog	独立看门狗
WWDG	Window Watchdog	窗口看门狗

IWDG 通常使用独立低速时钟，即使主时钟出问题，它也可能继续工作。

用途：

工业控制
无人值守设备
车载设备
远程 IoT 设备
Chapter 25：SysTick，系统滴答定时器

SysTick：

System Tick Timer
系统滴答定时器

它是 Cortex-M 内核自带的一个简单定时器。

常用于：

产生 1ms 系统节拍
HAL_Delay
操作系统任务调度节拍
系统时间计数

比如 STM32 HAL 里的：

HAL_Delay(1000);

背后通常依赖 SysTick。

FreeRTOS 也会用系统 tick 来进行任务调度。

Chapter 26：Debug，调试系统

嵌入式调试非常重要。

常见缩写：

缩写	英文	中文
SWD	Serial Wire Debug	串行线调试
JTAG	Joint Test Action Group	联合测试工作组调试接口
SWO	Serial Wire Output	串行线输出
ST-Link	ST 官方调试器	
J-Link	Segger 调试器	
GDB	GNU Debugger	GNU 调试器
OpenOCD	Open On-Chip Debugger	开源片上调试工具

现在 STM32 最常用的是：

SWD + ST-Link

SWD 常用引脚：

SWDIO
SWCLK
GND
3.3V
NRST 可选

调试器可以做：

下载程序
单步执行
查看变量
查看寄存器
设置断点
查看内存
查看调用栈
复位芯片

你要明白：

调试接口是你观察芯片内部状态的窗口。

没有调试器，你只能靠 LED 和串口猜。

有调试器，你可以直接看 CPU 正在执行哪里，变量是多少，寄存器是什么状态。

Chapter 27：HAL 是什么？

HAL：

Hardware Abstraction Layer
硬件抽象层

中文：

硬件抽象层

它的作用是：

把复杂的寄存器操作封装成比较好用的 C 函数。

比如直接寄存器操作：

GPIOA->ODR |= (1 << 5);

HAL 写法：

HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);

HAL 的优点：

容易上手
可读性好
移植相对方便
不用一开始死磕寄存器细节
配合 CubeMX 方便生成初始化代码

HAL 的缺点：

代码较厚
性能不如直接寄存器/LL
有些细节被隐藏
出了问题仍然要看寄存器

所以学习建议是：

先用 HAL 跑通
再看 HAL 背后配置了哪些寄存器
最后关键地方可以用 LL 或寄存器优化
Chapter 28：LL 是什么？

LL：

Low Layer
低层库

STM32 里 LL 比 HAL 更接近寄存器。

对比：

HAL：高层封装，简单，但厚
LL：低层封装，接近寄存器，轻量
Register：直接操作寄存器，最底层

例如：

HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);

可能对应 LL：

LL_GPIO_SetOutputPin(GPIOA, LL_GPIO_PIN_5);

直接寄存器：

GPIOA->BSRR = (1 << 5);

学习顺序：

HAL 入门
LL 理解
寄存器深入
Chapter 29：芯片启动流程

你按下复位键后，大概流程是：

上电 / 复位
↓
读取 Flash 开头的中断向量表
↓
设置栈顶地址
↓
跳转到 Reset_Handler
↓
初始化 .data 段
↓
清零 .bss 段
↓
SystemInit 配置时钟
↓
进入 main()
↓
初始化 HAL 和外设
↓
while(1) 主循环

所以：

int main(void)
{
    HAL_Init();
    SystemClock_Config();

    MX_GPIO_Init();
    MX_USART1_UART_Init();

    while (1) {
    }
}

不是芯片真正的第一行代码。

真正更早执行的是：

启动文件 startup_xxx.s
Reset_Handler
SystemInit
Chapter 30：把整个芯片串起来理解

一个最简单的点灯程序，背后其实涉及很多模块：

HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);

背后流程：

电源正常
↓
复位释放
↓
CPU 从 Flash 启动
↓
启动文件初始化内存
↓
SystemClock_Config 配置时钟
↓
RCC 打开 GPIOC 时钟
↓
GPIOC 第 13 脚配置为输出
↓
CPU 调用 HAL_GPIO_WritePin
↓
HAL 修改 GPIOC 的 BSRR/ODR 寄存器
↓
PC13 输出电平变化
↓
LED 亮或灭

所以一个点灯程序，不只是 GPIO。

它牵涉：

Power
Reset
Clock
Flash
SRAM
CPU
Bus
RCC
GPIO
Register
HAL
Debug

这就是你要建立的整体图景。

必须掌握的缩写总表
缩写	英文	中文
MCU	Microcontroller Unit	微控制器 / 单片机
CPU	Central Processing Unit	中央处理器
RAM	Random Access Memory	随机访问内存
SRAM	Static RAM	静态随机访问内存
Flash	Flash Memory	闪存
ROM	Read Only Memory	只读存储器
GPIO	General Purpose Input Output	通用输入输出
RCC	Reset and Clock Control	复位与时钟控制
HSI	High Speed Internal Clock	高速内部时钟
HSE	High Speed External Clock	高速外部时钟
LSI	Low Speed Internal Clock	低速内部时钟
LSE	Low Speed External Clock	低速外部时钟
PLL	Phase Locked Loop	锁相环
SYSCLK	System Clock	系统时钟
HCLK	AHB Clock	AHB 总线时钟
PCLK	Peripheral Clock	外设时钟
AHB	Advanced High-performance Bus	高性能总线
APB	Advanced Peripheral Bus	外设总线
NVIC	Nested Vectored Interrupt Controller	嵌套向量中断控制器
EXTI	External Interrupt/Event Controller	外部中断/事件控制器
IRQ	Interrupt Request	中断请求
ISR	Interrupt Service Routine	中断服务函数
TIM	Timer	定时器
PWM	Pulse Width Modulation	脉宽调制
UART	Universal Asynchronous Receiver Transmitter	通用异步收发器
USART	Universal Synchronous/Asynchronous Receiver Transmitter	通用同步/异步收发器
I2C	Inter-Integrated Circuit	集成电路间通信总线
SPI	Serial Peripheral Interface	串行外设接口
ADC	Analog to Digital Converter	模数转换器
DAC	Digital to Analog Converter	数模转换器
DMA	Direct Memory Access	直接存储器访问
IWDG	Independent Watchdog	独立看门狗
WWDG	Window Watchdog	窗口看门狗
RTC	Real-Time Clock	实时时钟
HAL	Hardware Abstraction Layer	硬件抽象层
LL	Low Layer	低层库
SWD	Serial Wire Debug	串行线调试
JTAG	Joint Test Action Group	调试接口标准
SWO	Serial Wire Output	串行线输出
ISP	In-System Programming	在系统编程
IAP	In-Application Programming	应用内编程
BOOT	Boot Mode	启动模式
