/**
 * @public
 * 获取HTMLDivElement的宽高
 * @param {Laya.HTMLDivElement} html 要获取宽高的HTMLDivElement元素
 *
 * @return HTMLDivElement的宽高，{width,height}
 */
export function getHtmlElementSize(html) {
    //由于Laya -> HTMLDivElement的bug，需要根据私有元素的属性来获取正确的数据
    const { contextWidth, contextHeight } = html['_element']['_children'][0];
    return {
        width: contextWidth,
        height: contextHeight,
    };
}
