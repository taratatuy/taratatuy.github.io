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
        if (funcMaxVal < region.Mu(values[i])) {
          funcMaxVal = region.Mu(values[i]);
          maxRegion = region;
        }
      });
      output.push({
        region: maxRegion,
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
  _getRegionLabels(amount) {
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

    for (let i = 0; i < amount; i++) {
      labels.push(namingRules[letterFlag](i, this.N));
    }

    return labels;
  }

  _getRegions(peaks) {
    const regions = [];
    const labels = this._getRegionLabels(peaks.length);

    regions.push(new StartRegion(peaks[0], peaks[1], labels[0]));

    for (let i = 0; i < peaks.length - 2; i++) {
      regions.push(
        new CenterRegion(peaks[i], peaks[i + 1], peaks[i + 2], labels[i + 1])
      );
    }

    regions.push(
      new EndRegion(
        peaks[peaks.length - 2],
        peaks[peaks.length - 1],
        labels[labels.length - 1]
      )
    );

    return regions;
  }
}
