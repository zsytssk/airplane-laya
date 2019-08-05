// 形状
export default class Shape extends ecs.Component {
	static get name() {
        return 'Shape';
    }

    /*
     * @param (number) width 宽
     * @param (number) height 高
     * @param (number) radius 半径
     */
    constructor({
    	width = 0,
    	height = 0,
    	radius = 0
    } = {}) {
        super();

		this.width = width;
		this.height = height;
    	this.radius = radius;
    }
}