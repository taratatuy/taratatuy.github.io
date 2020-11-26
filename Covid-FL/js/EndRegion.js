class EndRegion {
  constructor(s, p, label) {
    this.s = s;
    this.p = p;
    this.label = label;
  }

  Mu(x) {
    let output = 1;
    if (x < this.p) output = this._grow(x);

    if (output < 0) output = 0;
    return +output.toFixed(5);
  }

  _grow(x) {
    return (x - this.s) / (this.p - this.s);
  }

  getAvgY(mu) {
    return +(mu * (this.p - this.s) + this.s).toFixed(6);
  }
}
