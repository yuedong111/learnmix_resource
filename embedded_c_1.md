Chapter 1：为什么嵌入式 C 和普通 C 不一样？

普通 C 更多关注算法、字符串、文件、数据结构。

嵌入式 C 关注的是：

GPIOA->ODR |= (1 << 5);

这行代码背后发生了什么？

它不是普通变量赋值，而是在控制芯片内部某个硬件寄存器。

你最终要理解：

#define GPIOA_ODR (*(volatile unsigned int *)0x4001080C)

GPIOA_ODR |= (1 << 5);

这行代码的含义是：

把地址 0x4001080C 当成一个 32 位寄存器地址，然后修改它的第 5 位，从而控制 GPIOA 的某个引脚输出高电平。

本章重点：

C 语言不是目的
控制硬件才是目的

变量不是只存在内存里
有些“变量”其实是硬件寄存器

指针不是只用来处理数组
还可以直接访问硬件地址


---

第一部分：嵌入式 C 基础语法

Chapter 2：数据类型与整数宽度

嵌入式里不要只写：

int a;

更推荐写：

uint8_t a;
uint16_t b;
uint32_t c;
int32_t d;

因为嵌入式开发非常关心变量占多少字节。

例如：

uint8_t status;
uint16_t adc_value;
uint32_t tick;

你要掌握：

char
short
int
long
uint8_t
uint16_t
uint32_t
int8_t
int16_t
int32_t
sizeof

重点理解：

#include <stdint.h>

为什么嵌入式代码大量使用：

uint8_t
uint16_t
uint32_t

因为寄存器、通信协议、Flash 数据、传感器数据，通常都要求明确字节宽度。

小练习：

printf("%lu\n", sizeof(uint8_t));
printf("%lu\n", sizeof(uint16_t));
printf("%lu\n", sizeof(uint32_t));


---

Chapter 3：结构体 struct：把硬件寄存器组织起来

普通 C 里，结构体可能用于表示一个人：

typedef struct {
    char name[20];
    int age;
} Person;

嵌入式里，结构体经常用于表示“一组寄存器”。

例如 GPIO 外设可能有很多寄存器：

MODER
OTYPER
OSPEEDR
PUPDR
IDR
ODR
BSRR

可以写成：

typedef struct {
    volatile uint32_t MODER;
    volatile uint32_t OTYPER;
    volatile uint32_t OSPEEDR;
    volatile uint32_t PUPDR;
    volatile uint32_t IDR;
    volatile uint32_t ODR;
    volatile uint32_t BSRR;
} GPIO_TypeDef;

然后定义：

#define GPIOA_BASE 0x40020000
#define GPIOA ((GPIO_TypeDef *)GPIOA_BASE)

使用时：

GPIOA->ODR |= (1 << 5);

本章目标：

你要看懂 STM32 HAL 里的这种代码：

GPIOA->MODER
USART1->DR
TIM2->CNT
ADC1->CR2

它们本质上都是：

基地址 + 偏移量 = 某个寄存器地址


---

Chapter 4：宏 define：嵌入式里的“代码替换器”

宏在嵌入式里非常常见。

例如：

#define LED_PIN 5
#define SET_BIT(REG, BIT) ((REG) |= (BIT))
#define CLEAR_BIT(REG, BIT) ((REG) &= ~(BIT))

使用：

SET_BIT(GPIOA->ODR, 1 << LED_PIN);
CLEAR_BIT(GPIOA->ODR, 1 << LED_PIN);

你要掌握：

常量宏
函数式宏
位操作宏
寄存器地址宏
条件编译宏

例如：

#ifdef DEBUG
#define LOG(x) printf(x)
#else
#define LOG(x)
#endif

嵌入式里经常用宏控制不同平台、不同芯片、不同功能开关。

本章重点：

宏不是函数，宏是预处理阶段的文本替换。

所以这个宏有风险：

#define SQUARE(x) x * x

调用：

int a = SQUARE(1 + 2);

展开后是：

1 + 2 * 1 + 2

结果不是 9。

正确写法：

#define SQUARE(x) ((x) * (x))


---

Chapter 5：const：只读数据与配置表

const 表示变量不应该被修改。

例如：

const uint8_t led_pin = 5;

嵌入式中常用于：

配置表
查找表
协议固定字段
字符串常量
Flash 只读数据

例如：

const uint16_t crc_table[256] = {
    0x0000, 0x1021, 0x2042
};

你要理解：

const uint8_t *p;
uint8_t * const p;
const uint8_t * const p;

区别是：

const uint8_t *p;

指针可以变，但指向的内容不能通过 p 修改。

uint8_t * const p;

指针本身不能变，但可以修改指向的内容。

const uint8_t * const p;

指针不能变，指向的内容也不能通过 p 修改。


---

Chapter 6：static：作用域、生命周期、模块封装

static 在嵌入式里非常重要。

第一种用法：函数内部 static 变量。

void counter(void) {
    static uint32_t count = 0;
    count++;
}

普通局部变量函数结束就销毁。

但 static 局部变量会一直存在。

第二种用法：限制函数作用域。

static void uart_send_byte(uint8_t data) {
    // 只在当前 .c 文件内可见
}

这非常适合驱动封装。

例如：

// motor.c
static void motor_set_pwm(uint16_t pwm) {
    // 内部函数
}

void motor_start(void) {
    motor_set_pwm(500);
}

外部只能调用：

motor_start();

不能直接调用：

motor_set_pwm();

本章重点：

static 局部变量：延长生命周期
static 全局变量：限制在当前文件
static 函数：限制在当前文件


---
