Chapter 7：指针：嵌入式 C 的核心

指针是嵌入式 C 最重要的内容之一。

普通变量：

uint32_t a = 100;

指针变量：

uint32_t *p = &a;

访问：

*p = 200;

含义：

p 保存的是地址
*p 表示访问这个地址里的数据

嵌入式里，指针最大作用是访问固定硬件地址。

例如：

uint32_t *p = (uint32_t *)0x4001080C;
*p = 0x20;

但是这还不够，必须加 volatile：

volatile uint32_t *p = (volatile uint32_t *)0x4001080C;
*p = 0x20;

否则编译器可能优化掉你的读写。

本章重点掌握：

普通指针
数组指针
结构体指针
指针强制类型转换
指针和地址
指针访问寄存器
空指针
野指针
指针越界

重点代码：

#define REG32(addr) (*(volatile uint32_t *)(addr))

REG32(0x4001080C) |= (1 << 5);

这句就是嵌入式 C 的灵魂代码之一。

Chapter 8：位运算：控制寄存器的基本功

嵌入式不是经常操作整个变量，而是经常操作某几个 bit。

常用位运算：

&   按位与
|   按位或
^   按位异或
~   按位取反
<<  左移
>>  右移

设置某一位：

reg |= (1 << 5);

清除某一位：

reg &= ~(1 << 5);

翻转某一位：

reg ^= (1 << 5);

判断某一位：

if (reg & (1 << 5)) {
    // bit5 是 1
}

设置多位字段：

假设要修改 bit[3:2]：

reg &= ~(0x3 << 2);
reg |=  (0x2 << 2);

本章要配合寄存器图来学。

例如一个寄存器：

bit7 bit6 bit5 bit4 bit3 bit2 bit1 bit0
  0    0    1    0    1    0    0    1

你要能一眼看出：

reg |= (1 << 3);
reg &= ~(1 << 5);

分别在干什么。

Chapter 9：volatile：告诉编译器“这个值会变”

volatile 是嵌入式 C 必须掌握的关键字。

普通变量：

uint32_t flag = 0;

编译器可能认为：

这个变量没人改
我可以优化

但嵌入式里变量可能被：

中断修改
硬件寄存器修改
DMA 修改
另一个任务修改

所以要写：

volatile uint32_t flag = 0;

典型例子：

volatile uint8_t uart_rx_done = 0;

void USART1_IRQHandler(void) {
    uart_rx_done = 1;
}

int main(void) {
    while (uart_rx_done == 0) {
        // 等待中断修改 flag
    }
}

如果没有 volatile，编译器可能把 uart_rx_done 缓存在寄存器里，导致 main 里一直看不到变化。

寄存器也要用 volatile：

#define GPIOA_ODR (*(volatile uint32_t *)0x4001080C)

因为硬件寄存器的值可能随时被硬件改变。

本章重点：

中断共享变量要 volatile
硬件寄存器要 volatile
DMA 缓冲区有时要 volatile
volatile 不是线程锁
volatile 不保证原子性
volatile 不等于内存屏障

这句话很重要：

volatile 只能防止编译器错误优化，不能解决并发安全问题。

Chapter 10：内存模型：Flash、RAM、栈、堆

嵌入式里你必须知道代码和变量放在哪里。

典型 MCU 内存：

Flash：存放程序代码、只读数据
RAM：运行时变量
Stack：函数调用、局部变量
Heap：malloc 动态分配
Peripheral：外设寄存器地址区

例如：

const uint8_t table[10] = {1,2,3};

一般放在 Flash。

uint8_t buffer[128];

全局变量一般放在 RAM。

void func(void) {
    uint8_t temp[64];
}

局部数组一般放在栈。

嵌入式里要谨慎使用：

malloc
free

因为小内存 MCU 上动态分配容易导致：

内存碎片
分配失败
不可预测延迟
难调试

所以很多嵌入式项目更喜欢：

static uint8_t buffer[1024];

本章要理解：

.text
.rodata
.data
.bss
stack
heap

简单理解：

.text    代码区
.rodata  只读常量区
.data    已初始化全局变量
.bss     未初始化全局变量
stack    函数调用栈
heap     动态内存

Chapter 11：数组越界：嵌入式最常见 bug 之一

例如：

uint8_t buf[10];

buf[10] = 1;

这是越界。

数组下标范围是：

0 ~ 9

不是：

1 ~ 10

嵌入式里数组越界很危险，因为它可能破坏：

其他变量
任务栈
函数返回地址
驱动状态
RTOS 控制块

例如：

uint8_t rx_buf[32];

for (int i = 0; i <= 32; i++) {
    rx_buf[i] = 0;
}

这里 i <= 32 是错误，应该是：

for (int i = 0; i < 32; i++) {
    rx_buf[i] = 0;
}

本章重点：

数组边界
字符串结尾 \0
memcpy 长度
串口接收缓冲区
环形缓冲区
协议包长度检查
Chapter 12：栈 / 堆：为什么程序会莫名其妙死机？

很多嵌入式死机来自栈溢出。

例如：

void task_func(void) {
    uint8_t big_buffer[4096];
}

如果 MCU RAM 只有几十 KB，这可能直接炸。

特别是在 FreeRTOS 中，每个任务都有自己的栈。

例如：

xTaskCreate(task_func, "task", 128, NULL, 1, NULL);

这里的 128 是任务栈大小，设置太小会导致任务跑着跑着崩溃。

本章重点：

局部大数组危险
递归函数危险
printf 可能占用较多栈
中断嵌套也需要栈
FreeRTOS 每个任务有独立栈
malloc/free 尽量少用

建议习惯：

static uint8_t rx_buffer[1024];

而不是：

void func(void) {
    uint8_t rx_buffer[1024];
}
Chapter 13：内存对齐：为什么结构体大小比想象的大？

例如：

typedef struct {
    uint8_t  a;
    uint32_t b;
} Test;

你可能以为大小是：

1 + 4 = 5 字节

但实际可能是：

8 字节

因为 CPU 访问 4 字节数据时，通常希望它在 4 字节对齐地址上。

内存可能这样排：

a        padding padding padding b b b b
1 字节    3 字节填充              4 字节

本章重点：

结构体对齐
padding 填充
#pragma pack
__attribute__((packed))
通信协议结构体
Flash 存储结构体
跨平台数据格式

例如通信协议中：

typedef struct {
    uint8_t  header;
    uint16_t length;
    uint32_t crc;
} Packet;

不能想当然地直接发送：

send((uint8_t *)&packet, sizeof(packet));

因为中间可能有 padding。

更稳妥的是自己按字节编码：

buf[0] = header;
buf[1] = length & 0xFF;
buf[2] = length >> 8;
