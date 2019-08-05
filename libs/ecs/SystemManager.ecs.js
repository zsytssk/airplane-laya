// 系统管理器
export class SystemManager {
    constructor(ecs) {
        // ecs
        this._ecs = ecs;

        // 系统集合
        this._systemMap = new Map();
        // 当前运行系统
        this._currentSystem = null;
    }

    /*
     * 检测系统是否已注册
     * @param (function) systemClass 系统类
     * @return (boolean) isRegister 是否已注册
     */
    _preRegister(systemClass) {
        if (this.has(systemClass)) {
            console.warn('The system has been registered.');

            return true;
        }

        return false;
    }

    /*
     * 注册系统
     * @param (object) system 系统实例
     */
    register(system) {
        if (this._preRegister(system.constructor)) {
            return this;
        }

        const systems = [...this._systemMap];

        systems.push([system.constructor.name, system]);

        this._systemMap = new Map(systems);

        system.initialize();
    }

    /*
     * 注册系统，并添加到指定系统之前，如果没有指定，则添加到系统列表首部
     * @param (object) system 系统实例
     * @param (function) beforeSystemClass 系统类
     */
    registerBefore(system, beforeSystemClass) {
        if (this._preRegister(system.constructor)) {
            return this;
        }

        let index = -1;
        const systems = [...this._systemMap];
        const systemName = system.constructor.name;
        const beforeSystemName = this._ecs.getClassName(beforeSystemClass);

        if (this._preRegister(beforeSystemClass)) {
            for (let i = 0, l = systems.length; i < l; ++i) {
                if (systems[i][0] === beforeSystemClass) {
                    index = i;
                    systems.splice(index, 0, [systemName, system]);

                    break;
                }
            }
        }

        if (index < 0) {
            systems.unshift([systemName, system]);
        }

        this._systemMap = new Map(systems);

        system.initialize();
    }

    /*
     * 注册系统，并添加到指定系统之前，如果没有指定，则添加到系统列表尾部
     * @param (object) system 系统实例
     * @param (function) afterSystemClass 系统类
     */
    registerAfter(system, afterSystemClass) {
        if (this._preRegister(system.constructor)) {
            return this;
        }

        let index = -1;
        const systems = [...this._systemMap];
        const systemName = system.constructor.name;
        const afterSystemName = this._ecs.getClassName(afterSystemClass);

        if (this._preRegister(afterSystemClass)) {
            for (let i = 0, len = systems.length; i < len; i++) {
                if (systems[i][0] === afterSystemName) {
                    index = i + 1;
                    systems.splice(index, 0, [systemName, system]);

                    break;
                }
            }
        }

        if (index < 0) {
            systems.push([systemName, system]);
        }

        this._systemMap = new Map(systems);

        system.initialize();
    }

    /*
     * 获取系统
     * @param (function | string) systemClass 系统类 | 系统名
     * @return (object) system 当前系统
     */
    get(systemClass) {
        const systemName = this._ecs.getClassName(systemClass);
        return this._systemMap.get(systemName);
    }

    /*
     * 获取所有系统
     * @return (array) systems 所有系统
     */
    getAll() {
        const systems = [];

        for (let system of this._systemMap.values()) {
            systems.push(system);
        }

        return systems;
    }

    /*
     * 检测系统是否存在
     * @param (function | string) systemClass 系统类 | 系统名
     */
    has(systemClass) {
        const systemName = this._ecs.getClassName(systemClass);

        return this._systemMap.has(systemName);
    }

    /*
     * 激活系统
     * @param (function | string) systemClass 系统类 | 系统名
     */
    enable(systemClass) {
        const system = this.get(systemClass);

        if (system === undefined) {
            console.warn('Enable system error.');

            return;
        }

        system.enabled = true;
    }

    /*
     * 禁用系统
     * @param (function | string) systemClass 系统类 | 系统名
     */
    disable(systemClass) {
        const system = this.get(systemClass);

        if (system === undefined) {
            console.warn('Disable system error.');

            return;
        }

        system.enabled = false;
    }

    /*
     * 移除系统
     * @param (function | string) systemClass 系统类 | 系统名
     */
    remove(systemClass) {
        const system = this.get(systemClass);

        if (system === undefined) {
            console.warn('Remove system error.');

            return;
        }

        const systemName = this._ecs.getClassName(systemClass);

        this._systemMap.delete(systemName);

        system.uninitialize();
    }

    // 清空系统
    clear() {
        for (const [systemName, system] of this._systemMap) {
            if (system) {
                system.uninitialize();
            }
        }

        this._systemMap.clear();
    }

    /*
     * 更新系统
     * @param (number) dt 帧间隔时间
     */
    update(dt) {
        for (const [systemName, system] of this._systemMap) {
            if (system && system.enabled && !system.started) {
                this._currentSystem = system;
                system.started = true;
            }
        }

        for (const [systemName, system] of this._systemMap) {
            if (system && system.enabled && system.started) {
                this._currentSystem = system;
                system.update(dt);
            }
        }

        for (const [systemName, system] of this._systemMap) {
            if (system && system.enabled && system.started) {
                this._currentSystem = system;
                system.lateUpdate(dt);
            }
        }
    }
}