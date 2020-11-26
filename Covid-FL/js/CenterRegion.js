class CenterRegion {
  constructor(s, p, e, label) {
    this.s = s;
    this.p = p;
    this.e = e;
    this.label = label;
  }

  Mu(x) {
    let output = 0;
    if (x < this.p) {
      output = this._grow(x);
    } else {
      output = this._fall(x);
    }

    if (output < 0) output = 0;
    return +output.toFixed(5);
  }

  _grow(x) {
    return (x - this.s) / (this.p - this.s);
  }

  _fall(x) {
    return (this.e - x) / (this.e - this.p);
  }

  _getX(mu) {
    if (mu < 0 || mu > 1)
      throw new Error('Mu cannot be more than 1 or less than 0');

    const output = [];
    output.push(mu * (this.p - this.s) + this.s);
    output.push(this.e - mu * (this.e - this.p));

    return output;
  }

  trapezoidalFunc(x, mu) {
    if (x < this.s) return 0;
    if (x > this.e) return 0;

    const [a, b] = this._getX(mu);
    if (x < a) return this._grow(x);
    if (x >= a && x <= b) return this.Mu(a);
    if (x > b) return this._fall(x);
  }

  getAvgY(mu) {
    return +(this._getUpperSquare(mu) / this._getSquare(mu)).toFixed(6);
  }

  _getSquare(mu) {
    const [a, b] = this._getX(mu);
    return +(
      this._S1(this.s, a) +
      this._S2(a, b) +
      this._S3(b, this.e)
    ).toFixed(6);
  }

  _getUpperSquare(mu) {
    const [a, b] = this._getX(mu);
    return +(
      this._upperS1(this.s, a) +
      this._upperS2(a, b) +
      this._upperS3(b, this.e)
    ).toFixed(6);
  }

  _S1(intStart, intEnd) {
    return this._S1IntF(intEnd) - this._S1IntF(intStart);
  }

  _S2(intStart, intEnd) {
    return (intEnd - intStart) * this.Mu(intStart);
  }

  _S3(intStart, intEnd) {
    return this._S3IntF(intEnd) - this._S3IntF(intStart);
  }

  _S1IntF(x) {
    return (
      (x ** 2 / 2) * (1 / (this.p - this.s)) - (this.s * x) / (this.p - this.s)
    );
  }

  _S3IntF(x) {
    return (
      (this.e * x) / (this.e - this.p) - ((1 / (this.e - this.p)) * x ** 2) / 2
    );
  }

  _upperS1(intStart, intEnd) {
    return this._upperS1IntF(intEnd) - this._upperS1IntF(intStart);
  }

  _upperS2(intStart, intEnd) {
    return this._upperS2IntF(intEnd) - this._upperS2IntF(intStart);
  }

  _upperS3(intStart, intEnd) {
    return this._upperS3IntF(intEnd) - this._upperS3IntF(intStart);
  }

  _upperS1IntF(x) {
    return (
      (x ** 3 / 3) * (1 / (this.p - this.s)) -
      ((this.s * x ** 2) / 2) * (1 / (this.p - this.s))
    );
  }

  _upperS2IntF(x) {
    return (x ** 2 / 2) * 0.4;
  }

  _upperS3IntF(x) {
    return (
      ((this.e * x ** 2) / 2) * (1 / (this.e - this.p)) -
      (x ** 3 / 3) * (1 / (this.e - this.p))
    );
  }
}
