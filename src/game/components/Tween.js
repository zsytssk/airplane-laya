import { Component } from 'ecs/ecs';

// 缓动
export default class Tween extends Component {
    static get name() {
        return 'Tween';
    }

    /*
     * @param (boolean) enabled 激活状态
     * @param (number) x 目标x轴坐标
     * @param (number) y 目标y轴坐标
     * @param (number) speed 移动速度
     */
    constructor({ enabled = false, x = 0, y = 0, speed = 10 } = {}) {
        super();

        this.enabled = enabled;
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
}
