'use strict';

exports.install = install;

exports.adopt = sup;

exports.evolve = function (SuperClass, proto) {
    var Child = sup(SuperClass);
    extendProto(Child.prototype, proto);
    return Child;
};

exports.getPropertyDescriptor = function (subject, name) {
    var pd;
    do {
        pd = Object.getOwnPropertyDescriptor(subject, name);
    } while (!pd && (subject = Object.getPrototypeOf(subject)));
    return pd;
};

/**
 * Inheritance method
 *
 * @param {Function} SuperClass super constructor
 * @param {Function} Class constructor to extend
 * @returns {Function}
 */
function sup (SuperClass, Class) {
    var prevProto = Class && Class.prototype;
    if (!Class) {
        Class = function ctor () {
            ctor.Sup.apply(this, arguments);
        };
    }

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
    if (prevProto) {
        extendProto(Class.prototype, prevProto);
    }
    return Class;
}

function extendProto (proto, methods) {
    Object.keys(methods).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // for getters/setters
        var desc = Object.getOwnPropertyDescriptor(methods, key);
        Object.defineProperty(proto, key, desc);
    });
}

function install (SuperClass) {
    SuperClass.adopt = function (Child) {
        return exports.adopt(SuperClass, Child);
    };

    SuperClass.evolve = function (proto) {
        return exports.evolve(SuperClass, proto);
    };
    
    SuperClass.extendPrototype = function (proto) {
        extendProto(SuperClass.prototype, proto);
        return SuperClass;
    };
}
