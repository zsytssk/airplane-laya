// 组件基类
export function createComponentClass(ecs) {
    return class BaseComponent {
        constructor() {
            // ecs
            this._ecs = ecs;
        }

        // 销毁
        destroy() {
            this._ecs = null;
        }
    }
};