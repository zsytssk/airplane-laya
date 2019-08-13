-   @todo 将 es 核心组件转化成 ts

-   @todo 修改 es 核心组件

## 优化

-   精简核心模块

-   ecs 能不能只遍历更新的 system

    -   system 可以在 onReceive 设置自己 start 属性为 true 在功能完成的时候设置回去... 表示他的状态...

-   system 能不能只遍历更新的 component 为改变
    -   component 需要和 system 进行绑定
        -   可以在 onReceive 的时候将要改变的 entity 放在一个 component 中, 然后再去修改 systemChangeEntity

## 完善 demo 的功能

    - 碰撞检测
    - 血量
    - 追踪子弹
