/**
 * 格式化数字
 * @param {number} number 要格式化的数字
 * @param {number} places 保留的小数位，默认不保留
 * @param {string} symbol 货币符号
 * @param {string} thousand 千位分隔符，默认为“,”
 * @param {string} decimal 小数位符号
 *
 * @return 格式化后的货币字符
 */
export function formatMoney(
    number = 0,
    places = 0,
    symbol = '',
    thousand = ',',
    decimal = '.',
) {
    number = Number(number);
    if (isNaN(number)) {
        return null;
    }

    places = !isNaN((places = Math.abs(places))) ? places : 2;

    var negative = number < 0 ? '-' : '',
        i =
            parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) +
            '',
        j = (j = i.length) > 3 ? j % 3 : 0;
    return (
        symbol +
        negative +
        (j ? i.substr(0, j) + thousand : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
        (places
            ? decimal +
              Math.abs(number - i)
                  .toFixed(places)
                  .slice(2)
            : '')
    );
}
