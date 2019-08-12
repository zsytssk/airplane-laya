// 实体基类
export function createEntityClass(ecs) {
    return class BaseEntity {
        protected _ecs;
        protected _name: string;
        protected _uniqueId: string;
        constructor(entityName = 'default') {
            this._ecs = ecs;

            // 实体名称
            this._name = entityName;

            // 唯一标识
            this._uniqueId = this._ecs.getUUID();

            // 实体添加到实体管理器中
            this._ecs.entityManager.set(this);
        }

        /*
         * 获取名称
         * @return {string} name 名称
         */
        get name() {
            return this._name;
        }

        /*
         * 获取ID
         * @return {string} id ID
         */
        get id() {
            return this._uniqueId;
        }

        // 销毁
        public destroy() {
            this.clearComps();

            this._ecs = null;
        }

        /*
         * 获取指定组件
         * @param {function | string} compClass 组件类 | 组件名
         * @return {object} comp 当前组件
         */
        public getComp(compClass) {
            return this._ecs.componentManager.get(compClass, this._uniqueId);
        }

        /*
         * 获取所有组件
         * @return (array) comps 所有组件
         */
        public getComps() {
            return this._ecs.componentManager.getAll(this._uniqueId);
        }

        /*
         * 设置组件状态
         * @param {function | string} compClass 组件类 | 组件名
         * @param {object} state 状态
         * @param {boolean} hasDiff 是否开启比对
         */
        public setCompsState(compClass, state, hasDiff = true) {
            const attrs = [];

            const comp = this.getComp(compClass);

            if (!!comp) {
                for (const key in state) {
                    if (comp.hasOwnProperty(key)) {
                        let isDiff = false;

                        const oldVal = comp[key];
                        const newVal = state[key];

                        if (typeof oldVal === typeof newVal) {
                            switch (typeof oldVal) {
                                case 'array':
                                    isDiff =
                                        oldVal.toString() !== newVal.toString();

                                    break;
                                case 'object':
                                    isDiff = true;

                                    break;
                                default:
                                    isDiff = oldVal !== newVal;
                            }
                        } else {
                            isDiff = true;
                        }

                        if (isDiff || !hasDiff) {
                            comp[key] = newVal;

                            attrs.push(key);
                        }
                    }
                }
            }

            // 添加脏标记
            if (attrs.length) {
                const compName = this._ecs.getClassName(compClass);

                this._ecs.entityManager.setDirty(
                    `${this._name}@${this._uniqueId}`,
                    compName,
                    attrs,
                );
            }
        }

        /*
         * 检测组件是否存在
         * @param {function | string} compClass 组件类 | 组件名
         * @return (boolean) isExist 组件是否存在
         */
        public hasComp(compClass) {
            return this._ecs.componentManager.has(compClass, this._uniqueId);
        }

        /*
         * 添加组件
         * @param {object} comp 组件实例
         * @return {object} this chain
         */
        public addComp(comp) {
            this._ecs.componentManager.set(comp, this._uniqueId);

            // 添加脏标记
            this._ecs.entityManager.setDirty(
                `${this._name}@${this._uniqueId}`,
                comp.constructor.name,
            );

            return this;
        }

        /*
         * 移除组件
         * @param {function | string} compClass 组件类 | 组件名
         * @return {object} this chain
         */
        public removeComp(compClass) {
            this._ecs.componentManager.remove(compClass, this._uniqueId);

            return this;
        }

        /*
         * 清空组件
         * @return {object} this chain
         */
        public clearComps() {
            this._ecs.componentManager.clear(this._uniqueId);

            return this;
        }
    };
}
