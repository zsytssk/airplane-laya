import { Component } from 'ecs/ecs';

// 皮肤
export default class Skin extends Component {
    static get name() {
        return 'Skin';
    }

    /*
     * @param (object) texture 纹理名称
     */
    constructor(texture) {
        super();

        this.texture = texture;
    }
}
