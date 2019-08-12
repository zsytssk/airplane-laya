import { ECS } from './ecs';

// 系统基类
export function createSystemClass(ecs) {
    return class BaseSystem {
        // ecs
        protected _ecs = ecs;
        // world
        protected _world: any;

        // 运行状态
        protected _started = false;
        // 锁定状态
        protected _locked = false;
        // 激活状态
        protected _enabled = true;
        constructor(world: any) {
            this._world = world;
        }

        /*
         * 获取运行状态
         * @return (boolean) isStarted 运行状态
         */
        get started() {
            return this._started;
        }

        /*
         * 设置运行状态
         * @param (boolean) val 是否激活
         */
        set started(val) {
            if (!val) {
                return;
            }

            if (this._started === val) {
                return;
            }

            this._started = val;

            if (this._started) {
                this.onStart();
            }
        }

        /*
         * 获取激活状态
         * @return (boolean) isEnabled 激活状态
         */
        get enabled() {
            return this._enabled;
        }

        /*
         * 设置激活状态
         * @param (boolean) val 是否激活
         */
        set enabled(val) {
            if (this._locked) {
                console.warn(
                    'Cannot change the enabled value when the system is updating.',
                );

                return;
            }

            if (this._enabled === val) {
                return;
            }

            this._enabled = val;

            if (this._enabled) {
                this.onEnable();
            } else {
                this.onDisable();
            }
        }

        // 系统内部初始化
        public initialize() {
            this.onLoad();
            this.onEnable();
        }

        // 系统内部卸载
        public uninitialize() {
            this._ecs = null;

            this.onDestroy();
        }

        /*
         * 系统内部更新
         * @param (number) dt 帧间隔时间
         */
        public update(dt: number) {
            if (!this._started || !this._enabled) {
                return;
            }

            this._locked = true;

            this.onUpdate(dt);

            this._locked = false;
        }

        /*
         * 系统内部更新
         * @param (number) dt 帧间隔时间
         */
        public lateUpdate(dt) {
            if (!this._started || !this._enabled) {
                return;
            }

            this._locked = true;

            this.onLateUpdate(dt);

            this._locked = false;
        }

        /*
         * 系统内部收到消息时调用
         * @param (object) data 数据
         */
        public receive(data) {
            this.onReceive(data);
        }

        // 系统初始化时调用
        public onLoad() {}

        // 系统开始运行时调用
        public onStart() {}

        /*
         * 系统更新时调用
         * @param (number) dt 帧间隔时间
         */
        public onUpdate(dt) {}

        public onLateUpdate(dt) {}

        // 系统被激活时调用
        public onEnable() {}

        // 系统被禁用时调用
        public onDisable() {}

        // 系统被注销时调用
        public onDestroy() {}

        /*
         * 系统收到消息时调用
         * @param (object) data 数据
         */
        public onReceive(data) {}
    };
}
