sup
===

JS Inheritance helpers

Примеры
===

Допустим нам нужно насделоваться от какого-то класса:

```javascript
var SUP = require('sup');
function Bar () {
    // ...
}
SUP.sup(Bar, Foo);
```



Теперь у дочернего класса есть новые статические св-ва, при помощи которых переопределение упрощается:
  * `Sup` - конструктор родительского класса
  * `sup` - прототип родительского класса

```javascript
function Bar () {
    // do cool
    Bar.Sup.call(this);
}
Foo.inherit(Bar);

// Initial inheitance
Bar.prototype.getTag = function () {
    return '<bar>' + Bar.sup.getTag.call(this) + '</bar>';
};

var bar = new Bar;
console.log('bar', bar.getTag());
// "bar" "<bar><foo>FOO</foo></bar>"
```



Так же, в родительском классе мы можем установить `Sup`, тогда у класса появятся статические методы:
  * `inherit`
  * `extendPrototype`
  * `getter`, `setter`, `desc`

```javascript
// my simple class
function Foo () {
    this._foo = 'FOO';
}
// exports is like `require('sup');`
SUP.install(Foo);

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
// "foo" "<foo>FOO</foo>"
```



При наследовании конструктор опционален.

```javascript
// My child class should be inherited
var Bar = Foo.inherit();

// Initial inheitance
Bar.prototype.getTag = function () {
    return '<bar>' + Bar.sup.getTag.call(this) + '</bar>';
};

var bar = new Bar;
console.log('bar', bar.getTag());
// "bar" "<bar><foo>FOO</foo></bar>"
```



Указывать наследование можно уже *после* того, как в прототипе появились методы, они будут скопированы

```javascript
function Baz1 () {
    Baz1.Sup.call(this);
    this._baz = 'BAZ 2';
}

Baz1.prototype.getTag = function () {
    return '<baz1>' + Baz1.sup.getTag.call(this) + '</baz1>' + this.prop
};

Bar.inherit(Baz1);

var baz1 = new Baz1;
console.log('baz1', baz1.getTag());
// "baz1" "<baz1><bar><foo>FOO</foo></bar></baz1>" + FOO
```


Можно расширять прототип в объектной нотации.
Есть статические методы-помощники для геттеров/сеттеров. Их легко можно доопределять:

```javascript
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
