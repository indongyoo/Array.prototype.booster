# Array.prototype.booster

- Array.prototype의 map, filter, reduce, flatMap 등의 속도를 부스팅!
- 너무 진지하게 보면 안되요 ㅋ
- IE에서도 쓰시라고 ES5로 짰어요.
- 구버전 IE에선 polyfill
- IE9에선 부스팅 효과 극대화 (아마도)

## 사용법

```javascript
var a = Array.prototype.map;
console.log(a == Array.prototype.map);
// true
booster();
console.log(a == Array.prototype.map);
// false
[1, 2, 3].map(a => a + 1);
// [2, 3, 4]
```

## 크롬에서 테스트 결과

[테스트 코드 보기](https://github.com/indongyoo/Array.prototype.booster/blob/master/test.html)

```
before boosting
map: 1251.281982421875ms
filter: 173.610107421875ms
reduce: 252.400146484375ms
flatMap: 3641.93603515625ms
map+filter: 5091.51416015625ms
map+filter+flatMap: 2067.625ms

boosting!!!
map: 160.205322265625ms (와우 7.8배 빨라요!)
filter: 128.919189453125ms (미세하지만 그래도!)
reduce: 241.978271484375ms
flatMap: 520.212890625ms (와우! 7배 빨라요!)
map+filter: 1160.1533203125ms
map+filter+flatMap: 747.23486328125ms (와우!)
```

## 어떻게?

```javascript
Array.prototype.map = function(f) {
  var i = -1, l = this.length, res = Array(l);
  while (++i < l) res[i] = f(this[i], i, this);
  return res;
};
Array.prototype.filter = function(f) {
  var i = -1, l = this.length, res = [], a;
  while (++i < l) f(a = this[i], i, this) && (res[res.length] = a);
  return res;
};
```

## flatMap 활용을 통한 Big Size Array 다루기!

큰 사이즈의 Array를 다룰 때, 같은 함수를 작성한 후 `magic`을 감싸주기만하면 빨라지고!

```javascript
function test(count, f) {
  while (count--) f();
}
function range(stop) {
  var i = -1, res = [];
  while (++i < stop) res.push(i);
  return res;
}

const list = range(10000000);

const f = list => list
  .map(a => a + 1)
  .map(a => a + 1)
  .filter(a => a % 2);

const magic = f => list => list.flatMap(x => f([x]));

const f2 = magic(list => list
  .map(a => a + 1)
  .map(a => a + 1)
  .filter(a => a % 2));

console.time('map+filter');
test(1, function() {
  f(list);
});
console.timeEnd('map+filter');
// map+filter: 2778.0751953125ms

console.time('map+filter+flatMap');
test(1, function() {
  f2(list);
});
console.timeEnd('map+filter+flatMap');
// map+filter+flatMap: 1874.667724609375ms
```

`flatMap`을 아래와 같이 덮어쓰면 더 빨라집니다 ㅋ (크롬이랑 사파리 만드는 애들 말야! 제대로 안할꺼야? -_-;; ㅋ)

```javascript
Array.prototype.flatMap = function(f) {
  var i = -1, tl = this.length, res = [], b, j, bl;
  while (++i < tl) {
    if (Array.isArray(b = f(this[i], i, this))) {
      j = -1, bl = b.length;
      while (++j < bl) res.push(b[j]);
    } else res.push(b);
  }
  return res;
};

console.time('map+filter+flatMap');
test(1, function() {
  f2(list);
});
console.timeEnd('map+filter+flatMap');
// map+filter+flatMap: 507.843994140625ms
```

트릭은 트릭일뿐. 너무 진지해지면 좋지 않아요.
아! 실제로 코드는 다 정상동작합니다.
