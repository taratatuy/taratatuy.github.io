class Builder {
  constructor(SplineInterpolation, ctx) {
    this.f = SplineInterpolation;
    this.ctx = ctx;
    [
      this.axisX,
      this.original,
      this.interpolated,
      this.pointsY,
    ] = this._getAxis();
    this.config = this._getConfig();
    this.chart = new Chart(this.ctx, this.config);
  }

  _getAxis() {
    const a = this.f.a;
    const b = this.f.b;
    const axisX = [];
    const original = [];
    const interpolated = [];
    const pointsY = [];

    for (let x = a - (b - a) / 30; x <= b + (b - a) / 30; x += (b - a) / 60) {
      axisX.push(+x.toFixed(8));
      original.push(+this.f.func(x).toFixed(8));

      let flagY = NaN;
      this.f.points.forEach((point) => {
        if (point.x == +(+x).toFixed(8)) {
          flagY = point.y;
        }
      });
      pointsY.push(flagY);

      if (this.f.interpolate(x) != undefined)
        interpolated.push(+this.f.interpolate(x).toFixed(8));
      else interpolated.push(undefined);
    }

    return [axisX, original, interpolated, pointsY];
  }

  update(SplineInterpolation) {
    this.f = SplineInterpolation;
    [
      this.axisX,
      this.original,
      this.interpolated,
      this.pointsY,
    ] = this._getAxis();

    this.chart.config.data.labels = (() => {
      const output = [];
      const axis = this.axisX;
      axis.forEach((x) => {
        output.push(+(+x).toFixed(3));
      });
      return output;
    })();
    this.chart.config.data.datasets[0].data = this.pointsY;
    this.chart.config.data.datasets[1].data = this.interpolated;
    this.chart.config.data.datasets[2].data = this.original;

    this.chart.config.options.title.text =
      'Qubic spline interpolation. Current correlation: ' +
      this.f.correlation();

    this.chart.update();
  }

  _getConfig() {
    return {
      type: 'line',

      data: {
        labels: (() => {
          const output = [];
          const axis = this.axisX;
          axis.forEach((x) => {
            output.push(+(+x).toFixed(3));
          });
          return output;
        })(),
        datasets: [
          {
            label: '',
            backgroundColor: 'rgb(255, 100, 100)',
            borderColor: 'rgb(255, 255, 255)',
            data: this.pointsY,
            fill: false,
            pointRadius: 3,
          },
          {
            label: 'Interpolation',
            backgroundColor: 'orange',
            borderColor: 'orange',
            data: this.interpolated,
            fill: false,
            lineTension: 0,
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Original function',
            backgroundColor: 'rgb(132, 99, 255)',
            borderColor: 'rgb(132, 99, 255)',
            data: this.original,
            fill: false,
            lineTension: 0,
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontSize: 16,
          },
        },
        title: {
          display: true,
          fontSize: 16,
          text:
            'Qubic spline interpolation. Current correlation: ' +
            this.f.correlation(),
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'X',
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Y',
              },
            },
          ],
        },
      },
    };
  }
}
