exports.sup = sup;
exports.supProto = supProto;

/**
 * Inheritance method
 *
 * @param {Function} Ctor constructor to extend
 * @param {Function} Super super constructor
 * @returns {Function}
 */
function sup (Ctor, Super) {
    let ctorProto = Ctor.prototype;

    Ctor.Sup = Super;
    Ctor.sup = Super.prototype;
    Ctor.prototype = Object.create(Super.prototype, {
        constructor: {
            value: Ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    Ctor.sup = function (Child) {
        return sup(Child, Ctor);
    };

    Ctor.supProto = function (proto) {
        return supProto(Ctor, proto);
    };

    // Reassign methods
    if (ctorProto) {
        Object.keys(ctorProto).forEach(function (key) {
            // for get/set
            let desc = Object.getOwnPropertyDescriptor(ctorProto, key);
            Object.defineProperty(Ctor.prototype, key, desc);
        });
    }

    return Ctor;
}

/**
 *
 * @param {Function} Super
 * @param {Object} proto
 * @return {Function}
 */
function supProto (Super, proto) {
    let Ctor = proto.constructor || ctor;
    Ctor.prototype = proto;

    return sup(Ctor, Super);

    function ctor () {
        ctor.Sup.apply(this, arguments);
    }
}

