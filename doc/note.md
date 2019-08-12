-   @todo 保持核心代码的简洁

    -   非核心功能全部抽离出来

*   @ques input 是做什么的...
*   @ques Mediator 是做什么的...

-   @todo ecs 对 system 优化...
    -   system 保留逻辑...

*   @todo 张笑的 ecs 迁移过来...

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

-   @todo 错误处理

*   @todo delete
    -   workerManager
    -   pool
    -   `getClassName`
    -   getUUID
    -   BaseEntity :> entityManager

-   @ques 原来的 send 是如何一路传递信息到 system 上...

-   @ques window.ecs

-   @ques system 在

-   @ques work 是怎么使用的 ??
