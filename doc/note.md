-   @todo pool entityManager

-   @todo pool 使用所有 component + entity 使用缓冲池

-   @todo ui 使用观察者...

-   @todo `system.constructor.name` 怎么处理...

-   @ques component 里面的属性 不使用用对象

-   @todo pool

*   @todo 将这个项目的所有代码全部转换为 ts

    -   这是 ecs 的测试+展示项目....

*   @opt system.constructor .. system.constructor.name

*   @opt 将创建 + 更新 分开

*   @ques
    -   EntityManager 这些函数实际到底需不需要
        -   filter
        -   first
        -   set ...
    -   SystemManager
        -   registerBefore
        -   registerAfter

-   @todo 整理所有的对象的函数 将不需要的去掉...

-   @ques `attrs !== 'all'`
-   @ques Mediator 传递 worker 的信息 我这里根本不需要这个功能

    -   但是信息通过帧数去执行我觉得是可以的...

-   @ques input 的 code 到底有什么用...

-   @todo 清理所有下划线属性...

*   @review

    -   新手引导 怎么做...
    -   ecs 看法 思路 + 我们的项目改动需要怎么做...

*   @ques EntityManager.first 有没有必要存在

*   @todo entityManager.setDirty

*   @todo entity createEntity 函数来创建....

*   @todo 保持核心代码的简洁

    -   非核心功能全部抽离出来

-   @ques input 是做什么的...
-   @ques Mediator 是做什么的...

*   @todo ecs 对 system 优化...

    -   system 保留逻辑...

*   \_compMaps 到底是做什么的

*   componentManager `public set(comp, entityId: string) {` 有点奇怪

-   @todo 张笑的 ecs 迁移过来...

    -   ts ecs:any;
    -   ts `_compMaps: Map<string, any>;`
    -   ts `compClass`
    -   `Component = createComponentClass`
    -   `window.addEventListener('beforeunload',`
    -   `this.Entity = createEntityClass(this);`
    -   `this.System = createSystemClass(this);`
    -   `private _entityMaps: Map<string, any>;`
    -   `// world protected _world: World;`
    -   `attrs = new Set(attrs);`
    -   `send`
    -   观察者 监听改变...
    -   不再初始 实例化

*   @todo 错误处理

-   @todo delete
    -   ecs.ui
    -   workerManager
    -   pool
    -   `getClassName`
    -   getUUID
    -   BaseEntity :> entityManager

*   @ques 原来的 send 是如何一路传递信息到 system 上...

*   @ques window.ecs

*   @ques system 在

*   @ques work 是怎么使用的 ??
