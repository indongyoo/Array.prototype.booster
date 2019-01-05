# Array.prototype.booster

- Array.prototype의 map, filter, reduce, flatMap 등의 속도를 부스팅!
- 너무 진지하게 보면 안되요 ㅋ
- IE에서도 쓰시라고 ES5로 짰어요.
- 구버전 IE에선 polyfill
- IE9에선 부스팅 효과 극대화 (아마도)

## 크롬에서 테스트 결과

```
before boosting
map: 1251.281982421875ms
filter: 173.610107421875ms
reduce: 252.400146484375ms
flatMap: 3641.93603515625ms
map+filter: 5091.51416015625ms
map+filter+flatMap: 2067.625ms

boosting!!!
map: 160.205322265625ms
filter: 128.919189453125ms
reduce: 241.978271484375ms
flatMap: 520.212890625ms
map+filter: 1160.1533203125ms
map+filter+flatMap: 747.23486328125ms
```

## flatMap 활용을 통한 Big Size Array 다루기!

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

booster();

console.time('map+filter+flatMap');
test(1, function() {
  f2(list);
});
console.timeEnd('map+filter+flatMap');
// map+filter+flatMap: 516.843994140625ms
```








