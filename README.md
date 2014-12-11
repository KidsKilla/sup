sup
===

JS Inheritance helpers

Примеры
===

Допустим нам нужно насделоваться от какого-то класса `AAA`:

```javascript
// my simple class
function AAA () {
    this._aaa = 'AAA';
}

AAA.prototype = {
    get prop () {
        return this._aaa;
    }
};

AAA.prototype.getTag = function () {
    return '<aaa>' + this.prop + '</aaa>';
};

var aaa = new AAA;
console.log('aaa', aaa.getTag());
// "aaa" "<aaa>AAA</aaa>"
```

С помощью `sup` это можно сделать так:

```javascript
var SUP = require('sup');
function BBB () {
    // ...
}
SUP.sup(BBB, AAA);
```

или мы можем установить его в родительский класс, тогда у него появятся статические методы:
  * `inherit`
  * `extendPrototype`
  * `getter`, `setter`, `desc`
Это помогает убрать изо всех дочерних файлов запрос `var SUP = require('sup')`.

```javascript
// где-то в aaa.js
SUP.install(AAA);

// где-то в bar.js
AAA.inheritWith(BBB);

// или даже
SUP.install(AAA).inheritWith(BBB);
```


Теперь у дочернего класса есть новые статические св-ва, при помощи которых доопределение упрощается:
  * `Sup` - конструктор родительского класса
  * `sup` - прототип родительского класса

```javascript
function AAA () {
    this._aaa = 'AAA';
}
exports.install(AAA);

AAA.prototype = {
    get prop () {
        return this._aaa;
    }
};

AAA.prototype.getTag = function () {
    return '<aaa>' + this.prop + '</aaa>';
};

var aaa = new AAA;
console.log('aaa', aaa.getTag());
// "aaa" "<aaa>AAA</aaa>"
```



```javascript
// my simple class
function AAA () {
    this._aaa = 'AAA';
}

// exports is like `require('sup');`
SUP.install(AAA);

AAA.prototype = {
    get prop () {
        return this._aaa;
    }
};

AAA.prototype.getTag = function () {
    return '<aaa>' + this.prop + '</aaa>';
};

var aaa = new AAA;
console.log('aaa', aaa.getTag());
// "bar" "<bar><aaa>AAA</aaa></bar>"
```



При наследовании конструктор опционален.

```javascript
// My child class should be inherited
var BBB = AAA.inheritWith();

// Initial inheitance
BBB.prototype.getTag = function () {
    return '<bar>' + BBB.sup.getTag.call(this) + '</bar>';
};

var bar = new BBB;
console.log('bar', bar.getTag());
// "bar" "<bar><aaa>AAA</aaa></bar>"
```



Указывать наследование можно уже *после* того, как в прототипе появились методы, они будут скопированы

```javascript
function CCC () {
    CCC.Sup.call(this);
    this._baz = 'BAZ 2';
}

CCC.prototype.getTag = function () {
    return '<ccc>' + CCC.sup.getTag.call(this) + '</ccc>' + this.prop
};

BBB.inheritWith(CCC);

var ccc = new CCC;
console.log('ccc', ccc.getTag());
// "ccc" "<ccc><bar><aaa>AAA</aaa></bar></ccc>"
```


Можно расширять прототип в объектной нотации.
Есть статические методы-помощники `getter`, `setter`, `desc` для геттеров/сеттеров.
Их легко доопределять:

```javascript
var DDD = BBB.inheritWith(function fn () {
    fn.Sup.call(this);
    this._baz = 'BAZ 2';
});

// you can extend class from with object
DDD.extendPrototype({
    // getters supported
    get prop () {
        return this._baz + ':' + DDD.Sup.getter('prop').call(this);
    },
    createTag: function () {
        return '<baz2>' + this.prop + '</baz2>';
    }
});

var ddd = new DDD;
console.log('ddd', ddd.getTag());
```
