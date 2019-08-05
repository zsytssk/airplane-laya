var isPlainObject = (function () {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    function isPlainObject (obj) {
        var proto, Ctor;

        if(!obj || toString.call(obj) !== "[object Object]"){
            return false;
        }

        proto = Object.getPrototypeOf(obj);

        if(!proto){
            return true;
        }

        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    return isPlainObject;
})();

/**
 * @public
 * 将两个或更多对象的内容合并到第一个对象。使用方式见Jquery.extend
 * 调用方式
 * Sail.Utils.extend( [deep ], target, object1 [, objectN ] )
 * Sail.Utils.extend( target [, object1 ] [, objectN ] )
 *
 * @return 合并后的对象
 */
export function extend () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if(typeof target === "boolean"){deep = target;target = arguments[i] || {};i++;}
    if(typeof target !== "object" && !typeof target !== "function"){target = {};}
    if(i === length){target = this;i--;}

    for (;i < length; i++){
        if( (options = arguments[i]) != null){
            for (name in options){
                src = target[name];
                copy = options[name];
                if(target === copy){continue;}
                if(deep && copy && (isPlainObject(copy) ||
                    (copyIsArray = Array.isArray(copy) ) ) ){
                    if(copyIsArray){
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = Utils.extend(deep, clone, copy);
                } else if(copy !== undefined){
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};
