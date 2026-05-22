Chapter 14：函数指针：驱动框架和回调机制基础

函数指针就是“指向函数的指针”。

普通函数：

void led_on(void) {
}

函数指针：

void (*func)(void);

赋值：

func = led_on;

调用：

func();

嵌入式里常用于：

回调函数
驱动适配层
状态机
命令表
中断事件处理
RTOS hook

例如串口收到数据后调用回调：

typedef void (*uart_rx_callback_t)(uint8_t data);

static uart_rx_callback_t rx_callback;

void uart_register_callback(uart_rx_callback_t cb) {
    rx_callback = cb;
}

void USART1_IRQHandler(void) {
    uint8_t data = USART1->DR;

    if (rx_callback != NULL) {
        rx_callback(data);
    }
}

上层使用：

void app_uart_received(uint8_t data) {
    // 处理收到的数据
}

uart_register_callback(app_uart_received);

这就是驱动和业务解耦。

Chapter 15：回调函数：驱动通知应用层的方式

回调函数本质是：

你先把一个函数地址交给底层，等事件发生时，底层再调用你。

比如：

串口收到数据
定时器时间到了
按键按下
ADC 转换完成
DMA 传输完成

底层驱动不应该直接写死业务逻辑，而是通过回调通知上层。

错误设计：

void USART1_IRQHandler(void) {
    if (data == '1') {
        motor_start();
    }
}

更好的设计：

void USART1_IRQHandler(void) {
    uart_rx_callback(data);
}

业务层自己决定收到数据后干什么。

本章重点：

回调注册
回调触发
回调参数
空指针判断
中断中调用回调的风险
回调函数不能执行太久
Chapter 16：模块化驱动设计

不要把所有代码都写在 main.c。

推荐结构：

project
├── Core
│   ├── main.c
│   ├── stm32fxxx_it.c
│   └── system_stm32fxxx.c
├── Drivers
│   ├── led.c
│   ├── led.h
│   ├── key.c
│   ├── key.h
│   ├── uart.c
│   ├── uart.h
│   ├── sensor.c
│   └── sensor.h
└── App
    ├── app_main.c
    ├── protocol.c
    └── protocol.h

一个简单 LED 驱动：

// led.h
#ifndef LED_H
#define LED_H

void led_init(void);
void led_on(void);
void led_off(void);
void led_toggle(void);

#endif
// led.c
#include "led.h"

void led_init(void) {
}

void led_on(void) {
}

void led_off(void) {
}

void led_toggle(void) {
}

main.c 只负责调用：

int main(void) {
    led_init();

    while (1) {
        led_toggle();
        delay_ms(500);
    }
}

本章重点：

.h 文件放接口
.c 文件放实现
static 隐藏内部函数
main.c 不写太多业务
驱动层和应用层分离

Chapter 17：寄存器地址映射

芯片内部有很多硬件模块：

GPIO
USART
SPI
I2C
TIM
ADC
DMA
RCC
NVIC

每个模块都有自己的寄存器地址。

例如：

GPIOA_BASE = 0x40020000
GPIOB_BASE = 0x40020400
USART1_BASE = 0x40011000

寄存器本质就是固定地址上的特殊内存。

例如：

#define GPIOA_BASE 0x40020000
#define GPIOA_ODR  (*(volatile uint32_t *)(GPIOA_BASE + 0x14))

操作：

GPIOA_ODR |= (1 << 5);

等价于：

修改 GPIOA 输出数据寄存器的 bit5

本章目标：

你要能看懂芯片手册里的：

Register map
Base address
Offset
Reset value
Bit definition
Chapter 18：裸机启动流程

当 MCU 上电后，不是直接进入 main()。

大致流程是：

上电 / 复位
↓
读取中断向量表
↓
设置栈顶地址
↓
进入 Reset_Handler
↓
初始化 .data 段
↓
清零 .bss 段
↓
SystemInit()
↓
main()

你要理解：

main 不是程序真正的第一行
Reset_Handler 才是启动入口
启动文件负责准备 C 运行环境

常见启动文件：

startup_stm32fxxx.s

里面会有：

中断向量表
Reset_Handler
默认中断处理函数

本章重点：

中断向量表
栈顶地址
Reset_Handler
.data 拷贝
.bss 清零
SystemInit
main
Chapter 19：链接脚本基本概念

链接脚本告诉编译器：

代码放到哪里
常量放到哪里
全局变量放到哪里
栈放到哪里
堆放到哪里
Flash 有多大
RAM 有多大

常见文件：

STM32F103C8Tx_FLASH.ld

里面通常有：

MEMORY
{
  RAM   (xrw) : ORIGIN = 0x20000000, LENGTH = 20K
  FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 64K
}

含义：

Flash 从 0x08000000 开始，大小 64KB
RAM 从 0x20000000 开始，大小 20KB

链接脚本会安排：

.text 放 Flash
.rodata 放 Flash
.data 初始值在 Flash，运行时拷贝到 RAM
.bss 放 RAM 并清零
stack 放 RAM
heap 放 RAM

本章不需要一开始深入写链接脚本，但要能看懂基本结构。
