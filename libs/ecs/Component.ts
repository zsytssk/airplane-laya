// 组件基类
export function createComponentClass(ecs) {
    return class BaseComponent {
        private _ecs: any;
        constructor() {
            // ecs
            this._ecs = ecs;
        }

        // 销毁
        public destroy() {
            this._ecs = null;
        }
    };
}
