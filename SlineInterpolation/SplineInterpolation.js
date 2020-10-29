class Point {
  constructor(x, y) {
    this.x = +x.toFixed(8);
    this.y = +y.toFixed(8);
  }
}

class Spline {
  constructor(point1, point2) {
    this.p1 = point1;
    this.p2 = point2;
  }

  condition1() {
    return [1, 0, 0, 0];
  }

  condition2() {
    return [
      1,
      this.p2.x - this.p1.x,
      (this.p2.x - this.p1.x) ** 2,
      (this.p2.x - this.p1.x) ** 3,
    ];
  }

  condition3() {
    return [
      0,
      1,
      2 * (this.p2.x - this.p1.x),
      3 * (this.p2.x - this.p1.x) ** 2,
      0,
      -1,
      0,
      0,
    ];
  }

  condition4() {
    return [0, 0, 2, 6 * (this.p2.x - this.p1.x), 0, 0, -2, 0];
  }

  setParams(params) {
    this.A = params[0];
    this.B = params[1];
    this.C = params[2];
    this.D = params[3];
  }

  contains(x) {
    if (x >= this.p1.x && x <= this.p2.x) return true;
    return false;
  }

  func(x) {
    return (
      this.A +
      this.B * (x - this.p1.x) +
      this.C * (x - this.p1.x) ** 2 +
      this.D * (x - this.p1.x) ** 3
    );
  }
}

class SplineInterpolation {
  constructor(startPoint, endPoint, step, originalFunction) {
    this.function = this._clearFunction(originalFunction);
    this.a = startPoint;
    this.b = endPoint;
    this.h = step;
    this.points = this._getPointsList();
    this.splines = this._getSplines();
    [this.systemX, this.systemY] = this._buildSystem();
    this.params = this._solveSystem();
    this._setSplnesParams();
  }

  _clearFunction(input) {
    input = `${input}`;
    return input.replace(/\^/g, '**');
  }

  func(x) {
    let X = x;
    return eval(this.function);
  }

  _getPointsList() {
    const output = [];
    for (let x = this.a; x <= this.b; x += this.h) {
      output.push(new Point(x, this.func(x)));
    }
    return output;
  }

  _getSplines() {
    const output = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      output.push(new Spline(this.points[i], this.points[i + 1]));
    }
    return output;
  }

  _getSystemLine(input, i, condirionIndex) {
    let line = '';
    for (let j = 0; j < i; j++) {
      line += ' 0 0 0 0 ';
    }

    line += input.join(' ');

    for (let j = 0; j < this.splines.length - i - condirionIndex; j++) {
      line += ' 0 0 0 0 ';
    }

    return line.match(/-?\b((\d+\.)?\d+)/g);
  }

  _getFirstPointCondition() {
    let line = '0 0 2 0';
    for (let j = 0; j < this.splines.length - 1; j++) {
      line += ' 0 0 0 0 ';
    }

    return line.match(/-?\b((\d+\.)?\d+)/g);
  }

  _getLastPointCondition() {
    let line = '';
    for (let j = 0; j < this.splines.length - 1; j++) {
      line += ' 0 0 0 0 ';
    }

    const n = this.splines.length;
    line += `0 0 2 ${
      6 * (this.splines[n - 1].p2.x - this.splines[n - 1].p1.x)
    }`;

    return line.match(/-?\b((\d+\.)?\d+)/g);
  }

  _buildSystem() {
    const systemX = [];
    const systemY = [];
    for (let i in this.splines) {
      systemX.push(this._getSystemLine(this.splines[i].condition1(), i, 1));
      systemY.push(this.splines[i].p1.y);
      systemX.push(this._getSystemLine(this.splines[i].condition2(), i, 1));
      systemY.push(this.splines[i].p2.y);
    }
    for (let i = 0; i < this.splines.length - 1; i++) {
      systemX.push(this._getSystemLine(this.splines[i].condition3(), i, 2));
      systemY.push(0);
      systemX.push(this._getSystemLine(this.splines[i].condition4(), i, 2));
      systemY.push(0);
    }

    systemX.push(this._getFirstPointCondition());
    systemY.push(0);
    systemX.push(this._getLastPointCondition());
    systemY.push(0);

    return [systemX, systemY];
  }

  _solveSystem() {
    const ansv = math.lusolve(this.systemX, this.systemY);
    const output = [];
    for (let line of ansv) {
      output.push(...line);
    }
    return output;
  }

  _setSplnesParams() {
    let params = [...this.params];
    for (let spline of this.splines) {
      spline.setParams(params.splice(0, 4));
    }
  }

  interpolate(x) {
    for (let spline of this.splines) {
      if (spline.contains(x)) return spline.func(x);
    }
  }

  correlation() {
    const A = [];
    const B = [];

    for (let x = this.a; x <= this.b; x += (this.b + this.a) / 200) {
      A.push(this.func(x));
      B.push(this.interpolate(x));
    }
    return +pearsonCorrelation([A, B], 0, 1).toFixed(6);
    // return +this.pearson(A, B).toFixed(6);
  }

  // pearson(x, y) {
  //   let promedio = (lista) => {
  //     return lista.reduce((s, a) => s + a, 0) / lista.length;
  //   };
  //   let n = x.length,
  //     prom_x = promedio(x),
  //     prom_y = promedio(y);
  //   return (
  //     (x
  //       .map((e, i, r) => (r = { x: e, y: y[i] }))
  //       .reduce((s, a) => s + a.x * a.y, 0) -
  //       n * prom_x * prom_y) /
  //     (Math.sqrt(x.reduce((s, a) => s + a * a, 0) - n * prom_x * prom_x) *
  //       Math.sqrt(y.reduce((s, a) => s + a * a, 0) - n * prom_y * prom_y))
  //   );
  // }
}
