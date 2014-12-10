sup
===

JS Inheritance helpers

Usage
===

```javascript
// my simple class
function Foo () {
    this._foo = 'FOO';
}
// exports is like `require('sup');`
exports.install(Foo);

Foo.prototype = {
    get prop () {
        return this._foo;
    }
};

Foo.prototype.getTag = function () {
    return '<foo>' + this.prop + '</foo>';
};

var foo = new Foo;
console.log('foo', foo.getTag());



// My child class should be inherited
var Bar = Foo.inherit();

// Initial inheitance
Bar.prototype.getTag = function () {
    return '<bar>' + Bar.sup.getTag.call(this) + '</bar>';
};

var bar = new Bar;
console.log('bar', bar.getTag());



function Baz1 () {
    Baz1.Sup.call(this);
    this._baz = 'BAZ 2';
}

// most clean/simple way
Bar.inherit(Baz1);

Baz1.prototype.getTag = function () {
    return '<baz1>' + Baz1.sup.getTag.call(this) + this.prop + '</baz1>'
};

var baz1 = new Baz1;
console.log('baz1', baz1.getTag());



// you can create class from prototype object
var Baz2 = Bar.inherit(function fn () {
    fn.Sup.call(this);
    this._baz = 'BAZ 2';
});
Baz2.extendPrototype({
    // getters supported
    get prop () {
        return this._baz + ':' + Baz2.Sup.getter('prop').call(this);
    },
    createTag: function () {
        return '<baz2>' + this.prop + '</baz2>';
    }
});

var baz2 = new Baz2;
console.log('baz2', baz2.getTag());

```
