/**
 * @public
 * 创建骨骼动画
 * @param {String} path 骨骼动画路径
 * @param {Number} rate 骨骼动画帧率，引擎默认为30，一般传24
 * @param {Number} type 动画类型 0,使用模板缓冲的数据，模板缓冲的数据，不允许修改	（内存开销小，计算开销小，不支持换装） 1,使用动画自己的缓冲区，每个动画都会有自己的缓冲区，相当耗费内存 （内存开销大，计算开销小，支持换装） 2,使用动态方式，去实时去画	（内存开销小，计算开销大，支持换装,不建议使用）
 *
 * @return 骨骼动画
 */
export function createSkeleton(path, rate?, type?) {
    rate = rate || 30;
    type = type || 0;
    const png = Laya.loader.getRes(path + '.png');
    const sk = Laya.loader.getRes(path + '.sk');
    if (!png || !sk) {
        return null;
    }

    const templet = new Laya.Templet();
    templet.parseData(png, sk, rate);

    return templet.buildArmature(type);
}
