import { Component } from 'ecs/ecs';
// 归属
export default class Owner extends Component {
    static get name() {
        return 'Owner';
    }

    /*
     * @param (string) id 唯一标识
     * @param (boolean) enabled 激活状态
     */
    constructor(id, enabled = true) {
        super();

        this.id = id;
        this.enabled = enabled;
    }
}
