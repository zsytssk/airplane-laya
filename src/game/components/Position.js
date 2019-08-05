// 位置
export default class Position extends ecs.Component {
	static get name() {
        return 'Position';
    }
    
    /*
     * @param (number) x x轴坐标
     * @param (number) y y轴坐标
     */
    constructor(x, y) {
        super();

        this.x = x;
    	this.y = y;
    }
}