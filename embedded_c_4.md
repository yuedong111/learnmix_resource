Chapter 20：从零写一个 GPIO 寄存器驱动

目标：不用 HAL，直接操作寄存器点亮 LED。

你要实现：

void gpio_init(void);
void led_on(void);
void led_off(void);
void led_toggle(void);

需要理解：

RCC 时钟使能
GPIO 模式配置
输出寄存器 ODR
置位/复位寄存器 BSRR

示例方向：

#define RCC_APB2ENR (*(volatile uint32_t *)0x40021018)
#define GPIOC_CRH   (*(volatile uint32_t *)0x40011004)
#define GPIOC_ODR   (*(volatile uint32_t *)0x4001100C)

void led_init(void) {
    RCC_APB2ENR |= (1 << 4);

    GPIOC_CRH &= ~(0xF << 20);
    GPIOC_CRH |=  (0x2 << 20);
}

void led_on(void) {
    GPIOC_ODR &= ~(1 << 13);
}

void led_off(void) {
    GPIOC_ODR |= (1 << 13);
}

这个项目能串起：

指针
volatile
宏
位运算
寄存器地址
芯片手册
Chapter 21：写一个串口接收协议解析器

目标：实现简单通信协议。

协议格式：

0xAA  长度  命令  数据...  校验

例如：

AA 03 01 64 68

你要实现：

void protocol_parse_byte(uint8_t byte);
void protocol_on_packet(uint8_t cmd, uint8_t *data, uint8_t len);

这个项目训练：

数组
缓冲区
状态机
函数指针
回调函数
边界检查
校验和

示例状态机：

typedef enum {
    WAIT_HEADER,
    WAIT_LEN,
    WAIT_CMD,
    WAIT_DATA,
    WAIT_CHECKSUM
} ProtocolState;
Chapter 22：写一个环形缓冲区 RingBuffer

串口接收经常会用环形缓冲区。

你要实现：

typedef struct {
    uint8_t *buffer;
    uint16_t size;
    volatile uint16_t head;
    volatile uint16_t tail;
} RingBuffer;

接口：

void rb_init(RingBuffer *rb, uint8_t *buffer, uint16_t size);
int rb_write(RingBuffer *rb, uint8_t data);
int rb_read(RingBuffer *rb, uint8_t *data);
int rb_available(RingBuffer *rb);

训练内容：

结构体
指针
数组
volatile
中断共享数据
边界处理
取模运算

这是嵌入式里非常常见的基础组件。

Chapter 23：封装一个传感器驱动

例如 I2C 温湿度传感器。

设计接口：

typedef struct {
    int (*i2c_write)(uint8_t addr, uint8_t *data, uint16_t len);
    int (*i2c_read)(uint8_t addr, uint8_t *data, uint16_t len);
} SensorBus;

驱动代码不直接依赖具体 I2C 外设，而是依赖函数指针。

typedef struct {
    SensorBus bus;
    uint8_t addr;
} Sensor;

初始化：

void sensor_init(Sensor *sensor, SensorBus *bus, uint8_t addr);
int sensor_read_temp(Sensor *sensor, float *temp);

训练内容：

结构体封装
函数指针
驱动抽象
回调思想
硬件解耦
