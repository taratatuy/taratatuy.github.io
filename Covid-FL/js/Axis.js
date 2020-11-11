/**
 * Class for an axis. It contains all information about one of the param of
 * the system (x1 for example).
 */
class Axis {
  /**
   * Creation class of the axis and setting down all properties.
   * @param {Array<number>} values - List of values from the input.
   * @param {number} N - Number of regions between start and center.
   */
  constructor(values, N) {
    this.values = values;
    this.N = N;
    this.min = Math.min(...values);
    this.max = Math.max(...values);
    this.interval = +(this.max - this.min).toFixed(6);
    this.peaks = this._getPeaks(this.min, this.max, this.interval, this.N);
    this.regions = this._getRegions(this.peaks);
    this.baseData = this._getBaseData(this.values, this.regions);
  }

  /**
   * Returns an array of {labels, funcs} of each region.
   * @param {Array<number>} peaks - Peaks of the regions.
   * @returns {Array<Object>}
   * @private
   */
  _getRegions(peaks) {
    const funcs = this._getRegionFunctions(peaks);
    const labels = this._getRegionLabels(funcs);
    const regions = [];
    for (let i = 0; i < labels.length; i++) {
      regions.push({ label: labels[i], func: funcs[i] });
    }
    return regions;
  }

  /**
   * Returns an array of (x, label, y) of each input value.
   * @param {Array<number>} values - List of values from the input.
   * @param {Array<Object>} regions - List of regions.
   * @returns {Array<Object>}
   * @private
   */
  _getBaseData(values, regions) {
    const output = [];

    for (let i = 0; i < values.length; i++) {
      let funcMaxVal = 0;
      let maxRegion = {};
      regions.forEach((region) => {
        if (funcMaxVal < region.func(values[i])) {
          funcMaxVal = region.func(values[i]);
          maxRegion = region;
        }
      });
      output.push({
        xValue: values[i],
        label: maxRegion.label,
        yValue: funcMaxVal,
      });
    }

    return output;
  }

  /**
   * Split the interval betveen min and max axis values into regions.
   * Returns an array of numbers with equal distance between each.
   * @param {number} min - Min value od the axis.
   * @param {number} max - Max value od the axis.
   * @param {number} interval - Interval between min and max values of the axis
   * @param {number} N - Number of regions between start and center.
   * @returns {Array<number>} - Peaks of the regions.
   * @private
   */
  _getPeaks(min, max, interval, N) {
    const peaks = [];
    const step = +(interval / (2 * N)).toFixed(6);
    for (let i = min; +i.toFixed(4) < +(max + step).toFixed(4); i += step) {
      peaks.push(+i.toFixed(6));
    }
    return peaks;
  }

  /**
   * Returns an array of regions labels (for example [S1, M, L1]).
   * @param {Array<function>} regionsFunctions - List of functions of each region
   * @returns {Array<string>}
   * @private
   */
  _getRegionLabels(regionsFunctions) {
    let letterFlag = 'small';
    const labels = [];

    const namingRules = {
      large: (i, N) => {
        return `L${i - N}`;
      },
      medium: (i, N) => {
        letterFlag = 'large';
        return `M`;
      },
      small: (i, N) => {
        if (N - i == 1) {
          letterFlag = 'medium';
        }
        return `S${this.N - i}`;
      },
    };

    for (let i = 0; i < regionsFunctions.length; i++) {
      labels.push(namingRules[letterFlag](i, this.N));
    }

    return labels;
  }

  /**
   * Returns a list of functions of each region.
   * @param {Array<number>} peaks - Peaks of the regions.
   * @returns {Array<function>}
   * @private
   */
  _getRegionFunctions(peaks) {
    const regionFuncs = [];

    regionFuncs.push(
      this._funcionBuilder(peaks[0] - (peaks[1] - peaks[0]), peaks[0], 'start')
    );

    for (let i = 0; i < peaks.length - 2; i++) {
      regionFuncs.push(this._funcionBuilder(peaks[i], peaks[i + 1]));
    }

    regionFuncs.push(
      this._funcionBuilder(
        peaks[peaks.length - 2],
        peaks[peaks.length - 1],
        'end'
      )
    );

    return regionFuncs;
  }

  /**
   * Returns region's function.
   * @param {number} start - Growing point.
   * @param {number} peak - Peak point. The center of function.
   * @param {string} position - The position of region on axis line.
   * @returns {function}
   * @private
   */
  _funcionBuilder(start, peak, position = 'center') {
    return function (x) {
      let y = 0;
      const d = peak - start;
      if (x - peak < 0) {
        if (position == 'start') {
          return 1;
        }

        y = (x - start) / d;
        y = +y.toFixed(6);
      } else {
        if (position == 'end') {
          return 1;
        }

        y = (peak + d - x) / d;
        y = +y.toFixed(6);
      }

      if (y >= 0 && y <= 1) {
        return y;
      }
      return 0;
    };
  }
}
