Chapter 10：Bus，总线系统

Bus 中文：

总线

你可以理解成芯片内部的道路系统。

CPU 要访问 Flash、SRAM、GPIO、UART、Timer，都要通过总线。

常见总线缩写：

缩写	英文	中文
AHB	Advanced High-performance Bus	高性能总线
APB	Advanced Peripheral Bus	外设总线
AXI	Advanced eXtensible Interface	高性能扩展总线
ICode	Instruction Code Bus	指令总线
DCode	Data Code Bus	数据总线
System Bus	System Bus	系统总线

在 STM32 里经常看到：

AHB
APB1
APB2

简单理解：

AHB：高速主干道
APB1：低速外设道路
APB2：高速外设道路

常见外设分布大概是：

AHB：GPIO、DMA、CRC、FSMC 等
APB1：USART2、I2C、SPI2、TIM2 等
APB2：USART1、SPI1、ADC、TIM1 等

不同系列会有差异，但大概思想一样。

Chapter 11：GPIO，通用输入输出

GPIO：

General Purpose Input Output
通用输入输出

这是最基础的外设。

GPIO 就是芯片对外的引脚。

它可以配置成：

输入
输出
复用功能
模拟输入

常见 GPIO 模式：

模式	中文	用途
Input	输入	读取按键、电平
Output	输出	控制 LED、继电器
Alternate Function	复用功能	UART、SPI、I2C 等
Analog	模拟模式	ADC 采样

常见 GPIO 概念：

缩写	中文
IDR	输入数据寄存器
ODR	输出数据寄存器
BSRR	位设置/复位寄存器
MODER	模式寄存器
PUPDR	上拉/下拉寄存器
AFR	复用功能寄存器

你可以理解：

GPIO 是芯片和外部世界接触的门窗。
Chapter 12：Pull-up / Pull-down，上拉下拉

上拉：

Pull-up

下拉：

Pull-down

作用是让引脚在没有外部信号时，有一个确定状态。

如果没有上拉/下拉，引脚可能处于：

悬空 Floating

悬空时，读到的电平可能一会儿 0，一会儿 1。

比如按键输入：

按键未按下：靠上拉电阻保持高电平
按键按下：接地，变成低电平

所以代码可能是：

if (HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_RESET) {
    // 按键按下
}
Chapter 13：Alternate Function，复用功能

AF：

Alternate Function
复用功能

一个引脚不只能做普通 GPIO，还可以连接到芯片内部其他外设。

比如 PA9 可能可以配置成：

普通 GPIO
USART1_TX
TIM1_CH2
I2C 引脚
SPI 引脚

这叫：

引脚复用

你要理解：

同一个物理引脚，可以通过配置寄存器连接到不同内部外设。

所以使用 UART 时，不只是初始化 UART，还要把对应 GPIO 配置为复用功能。

例如：

PA9  -> USART1_TX
PA10 -> USART1_RX
Chapter 14：EXTI，外部中断

EXTI：

External Interrupt/Event Controller
外部中断/事件控制器

作用：

检测外部引脚变化
触发中断
通知 CPU

比如按键按下，不想一直轮询：

while (1) {
    if (key_pressed()) {
        // 处理
    }
}

可以用外部中断：

按键电平变化
↓
EXTI 检测到下降沿
↓
通知 NVIC
↓
CPU 暂停当前代码
↓
执行中断服务函数

常见触发方式：

上升沿 Rising edge
下降沿 Falling edge
双边沿 Both edge
Chapter 15：NVIC，中断控制器

NVIC：

Nested Vectored Interrupt Controller
嵌套向量中断控制器

中文：

嵌套向量中断控制器

它是 Cortex-M 内核里的中断管理模块。

作用：

管理所有中断
决定哪个中断先执行
支持中断优先级
支持中断嵌套
根据中断号跳转到对应函数

你可以把 NVIC 理解成：

芯片里的急诊调度中心

比如同时发生：

串口收到数据
定时器到点
按键按下
ADC 转换完成

NVIC 会根据优先级决定先处理哪个。

常见概念：

IRQ：Interrupt Request，中断请求
ISR：Interrupt Service Routine，中断服务函数
Priority：优先级
Vector Table：中断向量表
Chapter 16：Timer，定时器

Timer：

定时器

这是 MCU 非常重要的外设。

它本质上是一个硬件计数器。

你可以理解成：

每来一个时钟脉冲，计数器加 1
数到指定值，就产生事件或中断

常见用途：

定时中断
延时
PWM 输出
输入捕获
频率测量
脉冲计数
电机控制
编码器读取

常见缩写：

缩写	英文	中文
TIM	Timer	定时器
CNT	Counter	计数器
PSC	Prescaler	预分频器
ARR	Auto Reload Register	自动重装载寄存器
CCR	Capture Compare Register	捕获/比较寄存器
PWM	Pulse Width Modulation	脉宽调制
OC	Output Compare	输出比较
IC	Input Capture	输入捕获

一个定时器核心公式：

定时器计数频率 = 定时器时钟 / (PSC + 1)
溢出时间 = (ARR + 1) / 定时器计数频率

比如：

定时器时钟 = 72MHz
PSC = 7199
ARR = 9999

那么：

计数频率 = 72MHz / 7200 = 10kHz
溢出时间 = 10000 / 10000 = 1 秒
Chapter 17：PWM，脉宽调制

PWM：

Pulse Width Modulation
脉宽调制

它是一种用数字信号模拟“强弱”的方法。

例如 LED 调光：

一直亮：很亮
亮一半时间、灭一半时间：看起来半亮
亮 10% 时间、灭 90% 时间：看起来很暗

核心概念：

名称	中文
Period	周期
Duty Cycle	占空比
Frequency	频率

占空比：

高电平时间 / 总周期时间

比如：

占空比 10%：很弱
占空比 50%：中等
占空比 90%：很强

用途：

LED 调光
电机调速
舵机控制
蜂鸣器发声
电源控制
Chapter 18：UART / USART，串口通信

UART：

Universal Asynchronous Receiver Transmitter
通用异步收发器

USART：

Universal Synchronous/Asynchronous Receiver Transmitter
通用同步/异步收发器

简单说：

UART 是异步串口
USART 可以支持同步和异步

串口是最常用的调试和通信方式。

常见引脚：

TX：Transmit，发送
RX：Receive，接收
GND：地

常见参数：

参数	中文
Baudrate	波特率
Data bits	数据位
Stop bits	停止位
Parity	校验位
Flow control	流控

最常见配置：

115200 8N1

意思是：

波特率 115200
8 个数据位
No parity，无校验
1 个停止位

你调试 STM32 时，串口 printf 基本是必学技能。

Chapter 19：I2C，总线通信

I2C：

Inter-Integrated Circuit
集成电路间通信总线

中文常叫：

I 平方 C

它只需要两根线：

SCL：Serial Clock，串行时钟线
SDA：Serial Data，串行数据线

特点：

两根线可以挂多个设备
每个设备有地址
适合低速传感器
需要上拉电阻

常见用途：

OLED 屏
温湿度传感器
EEPROM
RTC 时钟芯片
电源管理芯片

常见概念：

Master 主机
Slave 从机
Address 地址
ACK 应答
NACK 非应答
Start 起始信号
Stop 停止信号

你可以理解：

I2C 像一条共享公交线路。
每个设备都有站牌地址。
主机点名某个地址，那个设备回应。
