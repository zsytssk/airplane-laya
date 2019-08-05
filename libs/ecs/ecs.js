import worker from '../ecs/worker.ecs.js';
import { Mediator } from '../ecs/Mediator.ecs.js';

import { Input } from '../ecs/Input.ecs.js';

import { Pool } from '../ecs/Pool.ecs.js';

import { WorkerManager } from '../ecs/WorkerManager.ecs.js';

import { ComponentManager } from '../ecs/ComponentManager.ecs.js';
import { createComponentClass } from '../ecs/Component.ecs.js';

import { EntityManager } from '../ecs/EntityManager.ecs.js';
import { createEntityClass } from '../ecs/Entity.ecs.js';

import { SystemManager } from '../ecs/SystemManager.ecs.js';
import { createSystemClass } from '../ecs/System.ecs.js';

class ECS {
    constructor() {
        // UI
        this._ui = null;

        // worker
        this.worker = worker;
        // 中介
        this.mediator = new Mediator(this);

        // 输入
        this.input = new Input(this);

        // 对象池
        this.pool = new Pool(this);

        // worker管理器
        this.workerManager = new WorkerManager();

        // 组件管理器
        this.componentManager = new ComponentManager(this);
        // 组件类
        this.Component = createComponentClass(this);

        // 实体管理器
        this.entityManager = new EntityManager(this);
        // 实体类
        this.Entity = createEntityClass(this);

        // 系统管理器
        this.systemManager = new SystemManager(this);
        // 系统类
        this.System = createSystemClass(this);
    }

    /*
     * 设置UI
     * @param {object} obj UI
     */
    set ui(obj) {
        this._ui = obj;
    }

    /*
     * 获取UI
     * @return {object} UI UI
     */
    get ui() {
        return this._ui;
    }

    /*
     * 初始化
     * @param {object} ui UI
     * @param {object} Workers worker类列表
     * @param {object} Systems 系统类列表
     * @param {object} keyCode 输入码
     */
    init({ ui, Workers, Systems, keyCode }) {
        if (!!ui) {
            this._ui = ui;
        }

        if (!!keyCode) {
            this.input.keyCode = keyCode;
        }

        if (!!Workers) {
            for (const name in Workers) {
                this.workerManager.register(name, Workers[name]);
            }
        }

        if (!!Systems) {
            for (const name in Systems) {
                this.systemManager.register(new Systems[name]());
            }
        }
    }

    /*
     * 更新
     * @param {number} dt 帧间隔时间
     */
    update(dt) {
        this.mediator.update(dt);

        this.systemManager.update(dt);
    }

    // 销毁
    destroy() {
        this.ui = null;

        this.systemManager.clear();

        this.mediator.clear();

        this.entityManager.clear();

        this.workerManager.closeAll();

        this.pool.clear();
    }

    /*
     * 发送消息
     * @param {function | string} systemClass 系统类 | 系统类名
     * @param {object} data 数据
     */
    send(systemClass, data) {
        const system = this.systemManager.get(systemClass);

        system.onReceive(data);
    }

    /*
     * 获取类名
     * @param {function | string} ecsClass 类 | 类名
     * @return {string} className 类名
     */
    getClassName(ecsClass) {
        const className =
            typeof ecsClass === 'function' ? ecsClass.name : ecsClass;

        return className;
    }

    /*
     * 获取uuid
     * @return {string} uuid 唯一标识
     */
    getUUID() {
        const s = [];
        const hexDigits = '0123456789abcdef';
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        // bits 12-15 of the time_hi_and_version field to 0010
        s[14] = '4';
        // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('');
    }
}

const ecs = new ECS();

export default ecs;

if (typeof window !== 'undefined') {
    // exports to window
    window.ecs = ecs;

    window.addEventListener('beforeunload', evt => {
        ecs.worker.terminate();

        ecs.destroy();
    });
}
