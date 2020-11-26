class StartRegion {
  constructor(p, e, label) {
    this.p = p;
    this.e = e;
    this.label = label;
  }

  Mu(x) {
    let output = 1;
    if (x > this.p) output = this._fall(x);

    if (output < 0) output = 0;
    return +output.toFixed(5);
  }

  _fall(x) {
    return (this.e - x) / (this.e - this.p);
  }

  getAvgY(mu) {
    return +(this.e - mu * (this.e - this.p)).toFixed(6);
  }
}
