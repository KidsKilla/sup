exports.sup = sup;
exports.install = install;

/**
 * Inheritance method
 *
 * @param {Function} Class constructor to extend
 * @param {Function} SuperClass super constructor
 * @returns {Function}
 */
function sup (Class, SuperClass) {
    if (!Class) {
        Class = function ctor () {
            ctor.Sup.apply(this, arguments);
        };
    }

    let prevProto = Class.prototype;
    Class.Sup = SuperClass;
    Class.sup = SuperClass.prototype;
    Class.prototype = Object.create(SuperClass.prototype, {
        constructor: {
            value: Class,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    install(Class);
    // Reassign methods
    prevProto && Class.extendPrototype(prevProto);
    return Class;
}

function extendProto (proto, methods) {
    Object.keys(methods).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // for getters/setters
        let desc = Object.getOwnPropertyDescriptor(methods, key);
        Object.defineProperty(proto, key, desc);
    });
}

function install (Class) {
    Class.inheritWith = function (Child) {
        return sup(Child, Class);
    };

    Class.extendPrototype = function (proto) {
        extendProto(Class.prototype, proto) ;
        return Class;
    };

    Class.desc = function (name) {
        return getDescriptor(Class.prototype, name);
    };

    Class.getter = function (name) {
        return Class.desc(name).get;
    };

    Class.setter = function (name) {
        return Class.desc(name).set;
    };
}

var getDescriptor = Object['getPropertyDescriptor'] || function (subject, name) {
    var pd;
    do {
        pd = Object.getOwnPropertyDescriptor(subject, name);
    } while (!pd && (subject = Object.getPrototypeOf(subject)));
    return pd;
};
