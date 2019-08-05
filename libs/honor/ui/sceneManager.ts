import { loaderManager } from 'honor/state';
import { HonorScene } from './view';
export type SceneChangeListener = (
    cur1: string,
    cur2: string,
) => boolean | void;
export type SceneChangeData = { cur: string; prev: string };
export type SceneClassMap = { [key: string]: HonorScene };

export type SceneRefUrl = string | Ctor<HonorScene> | HonorScene;
type SceneMap = Map<SceneRefUrl, HonorScene>;
export class SceneManagerCtor {
    public sceneChangeBeforeListener = [] as SceneChangeListener[];
    public sceneChangeAfterListener = [] as SceneChangeListener[];
    public sceneClassMap: SceneClassMap = {};
    public scene_pool = new Map() as SceneMap;
    private cur_scene: HonorScene;
    private dialog_manager = new Laya.DialogManager();
    constructor() {}
    public onResize(width, height) {
        if (this.cur_scene) {
            this.cur_scene.size(width, height);
            if (this.cur_scene.onResize) {
                this.cur_scene.onResize(width, height);
            }
        }
    }

    public getCurScene() {
        return this.cur_scene;
    }

    public switchScene(params: any[], scene: HonorScene): SceneChangeData {
        const { scene_pool } = this;
        const { width, height } = Laya.stage;
        scene.size(width, height);

        const old_scene = this.cur_scene;
        const prev = old_scene ? old_scene.url : null;

        this.cur_scene = scene;
        if (scene.onMounted) {
            scene.onMounted.apply(scene, params);
        }
        scene.open(true);

        if (old_scene && !old_scene.destroyed) {
            scene_pool.set(prev, old_scene);
        }

        const cur = scene.url;
        return {
            cur,
            prev,
        };
    }
    private callChangeListener(
        type: 'after' | 'before',
        ...params: any[]
    ): boolean {
        let listener;
        if (type === 'before') {
            listener = this.sceneChangeBeforeListener;
        } else if (type === 'after') {
            listener = this.sceneChangeAfterListener;
        }

        for (const fn of listener) {
            const result = fn(...params);
            if (result) {
                return result;
            }
        }
    }
    /** 运行场景 */
    public runScene(url: SceneRefUrl, ...params): Promise<Laya.Scene> {
        return new Promise(async (resolve, reject) => {
            /** 场景切换前执行, 如果被截取 就不进入场景 */
            const before_handle = this.callChangeListener(
                'before',
                this.cur_scene && this.cur_scene.url,
                url,
            );
            if (before_handle) {
                return reject(
                    `has callChangeListener interrupt open:> ${url} `,
                );
            }

            let scene: HonorScene = this.scene_pool.get(url);
            if (!scene) {
                if (typeof url === 'string') {
                    scene = (await loaderManager.loadScene(
                        'Scene',
                        url,
                    )) as HonorScene;
                } else if (typeof url === 'function') {
                    scene = new url();
                    await new Promise((_resolve, _reject) => {
                        if (!scene.active) {
                            return _resolve(scene);
                        }
                        scene.once('onViewCreated', this, () => {
                            return _resolve(scene);
                        });
                    });
                } else if (url instanceof Laya.Scene) {
                    scene = url;
                }
            }

            const change_data = this.switchScene(params, scene);
            this.callChangeListener('after', change_data.cur, change_data.prev);
            return resolve(scene);
        });
    }
}
