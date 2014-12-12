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

Это помогает убрать изо всех дочерних файлов запрос типа `var SUP = require('sup')`.

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
При наследовании конструктор опционален.

```javascript
// My child class should be inherited
var BBB = AAA.inheritWith(function BBB () {
    this._bbb = 'BBB';
    BBB.Sup.call(this);
});

// Initial inheitance
BBB.prototype.getTag = function () {
    return '<bar>' + this._bbb + BBB.sup.getTag.call(this) + '</bar>';
};

var bar = new BBB;
console.log('bar', bar.getTag());
// "bar" "<bar>BBB<aaa>AAA</aaa></bar>"
```



Указывать наследование можно уже *после* того, как в прототипе появились методы, они будут скопированы

```javascript
function CCC () {
    CCC.Sup.call(this);
    this._baz = 'CCC';
}

CCC.prototype.getTag = function () {
    return '<ccc>' + CCC.sup.getTag.call(this) + '</ccc>'
};

BBB.inheritWith(CCC); // или SUP.sup(ССС, BBB);

var ccc = new CCC;
console.log('ccc', ccc.getTag());
// "ccc" "<ccc><bbb>BBB<aaa>AAA</aaa></bbb></ccc>"
```


Можно расширять прототип в объектной нотации.
Есть статические методы-помощники `getter`, `setter`, `desc` для свойств/геттеров/сеттеров.
Их легко доопределять:

```javascript
var DDD = BBB.inheritWith(function fn () {
    DDD.Sup.call(this);
    this._ddd = 'DDD';
});

// you can extend class from with object
DDD.extendPrototype({
    // getters supported
    get prop () {
        return this._ddd + ':' + DDD.Sup.getter('prop').call(this);
    },
    createTag: function () {
        return '<ddd>' + this.prop + '</ddd>';
    }
});

var ddd = new DDD;
console.log('ddd', ddd.getTag());
// "ddd" "<ddd>DDD:</ddd>"
```
