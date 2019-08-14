import { ui } from 'ui/layaMaxUI';
import { Entity } from 'ecs/Entity';
import { DirtyCompMap } from 'ecs/EntityManager';
import Position from 'game/components/Position';

export class Player extends ui.scenes.playerUI {
    private missile: Laya.Sprite[] = [];
    private entity: Entity;
    constructor(entity: Entity) {
        super();
        this.entity = entity;
    }
    public onEnable() {
        this.pivotX = -49;
    }
    public updateUI(dirty_map: DirtyCompMap) {
        for (const [comp] of dirty_map) {
            if (comp instanceof Position) {
                this.pos(comp.x, comp.y);
            }
        }
    }

    /*
     * 获取火力信息
     * @param {number} type 类型 0: 机枪, 1: 机枪&导弹
     */
    public getFirepowerInfo(type = 0) {
        const arr = [];
        const { x, y } = this.gun;
        let pos = this.localToGlobal(new Laya.Point(x, y));

        arr.push({
            model: 0,
            x: pos.x,
            y: pos.y,
            id: this.entity.id,
        });

        if (type > 0) {
            for (const node of this.missile) {
                const { x, y } = node;
                pos = this.localToGlobal(new Laya.Point(x, y));

                arr.push({
                    model: 1,
                    x: pos.x,
                    y: pos.y,
                    id: this.entity.id,
                });
            }
        }

        return arr;
    }
}
