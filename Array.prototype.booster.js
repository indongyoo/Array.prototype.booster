function booster() {
  var p = Array.prototype,
    map = p.map,
    filter = p.filter,
    reduce = p.reduce,
    ua = navigator.userAgent,
    bpoint = ua.indexOf('MSIE 8.0') != -1 || ua.indexOf('MSIE 7.0') != -1 ? 0 : 10000;

  p.map = bmap; function bmap(f) {
    if (this.length < bpoint) return map.call(this, f);
    var i = -1, l = this.length, res = Array(l);
    while (++i < l) res[i] = f(this[i], i, this);
    return res;
  }
  p.filter = bfilter; function bfilter(f) {
    if (this.length < bpoint) return filter.call(this, f);
    var i = -1, l = this.length, res = [], a;
    while (++i < l) if (f(a = this[i], i, this)) res[res.length] = a;
    return res;
  }
  p.reduce = function(f, acc) {
    if (this.length < bpoint) return reduce.call(this, f, acc);
    var i = -1, l = this.length;
    if (acc === undefined) {
      i = 0;
      acc = this[i];
    }
    while (++i < l) acc = f(acc, this[i], i, list);
    return acc;
  };
  var isArray = Array.isArray;
  p.flatMap = function(f) {
    p.map = map;
    p.filter = filter;
    var i = -1, tl = this.length, res = [], b, j, bl;
    while (++i < tl) {
      if (isArray(b = f(this[i], i, this))) {
        j = -1, bl = b.length;
        while (++j < bl) res.push(b[j]);
      } else res.push(b);
    }
    p.map = bmap;
    p.fillter = bfilter;
    return res;
  };
}