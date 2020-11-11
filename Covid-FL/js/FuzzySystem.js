class FuzzySystem {
  constructor(countriesList, N) {
    this.countriesList = countriesList;
    this.N = N;
    this.x1Axis = this._getAxis('x1');
    this.x2Axis = this._getAxis('x2');
    this.yAxis = this._getAxis('y');
    this.rulesList = this._getRulesList();
    this.rulesBase = this._getRulesBase();
  }

  _getRulesBaseObject() {
    const rulesBase = {};

    this.rulesList.forEach((r) => {
      rulesBase[r.x1.label] = rulesBase[r.x1.label] || {};
      rulesBase[r.x1.label][r.x2.label] = rulesBase[r.x1.label][r.x2.label] || {
        label: '',
        sp: 0,
      };

      if (rulesBase[r.x1.label][r.x2.label].sp < r.sp) {
        rulesBase[r.x1.label][r.x2.label].label = r.y.label;
        rulesBase[r.x1.label][r.x2.label].sp = r.sp;
        rulesBase[r.x1.label][r.x2.label].rule = r;
      }
    });

    return rulesBase;
  }

  _getRulesBase() {
    const rulesBaseObj = this._getRulesBaseObject();
    let x1Set = new Set();
    let x2Set = new Set();

    Object.keys(rulesBaseObj).forEach((keyX1) => {
      x1Set.add(keyX1);
      Object.keys(rulesBaseObj[keyX1]).forEach((keyX2) => {
        x2Set.add(keyX2);
      });
    });

    x1Set = Array.from(x1Set);
    x2Set = Array.from(x2Set);

    let sortedX1Set = [];
    let sortedX2Set = [];

    this._sortSet(x1Set).forEach((label) => {
      sortedX1Set.push({ label: label });
    });

    this._sortSet(x2Set).forEach((label) => {
      sortedX2Set.push({ label: label });
    });

    const baseArray = [['', ...sortedX2Set]];

    for (let i = 0; i < sortedX1Set.length; i++) {
      baseArray[i + 1] = [sortedX1Set[i]];

      for (let j = 0; j < sortedX2Set.length; j++) {
        baseArray[i + 1][j + 1] = '';
        const rule = rulesBaseObj[sortedX1Set[i].label][sortedX2Set[j].label];

        if (rule) {
          baseArray[i + 1][j + 1] = rule;
        }
      }
    }

    return baseArray;
  }

  _sortSet(set) {
    const output = [];
    this.x1Axis.regions.forEach((region) => {
      if (set.includes(region.label)) output.push(region.label);
    });
    return output;
  }

  _getRulesList() {
    const rulesList = [];
    for (let i = 0; i < this.x1Axis.baseData.length; i++) {
      rulesList.push({
        number: i,
        x1: this.x1Axis.baseData[i],
        x2: this.x2Axis.baseData[i],
        y: this.yAxis.baseData[i],
        sp:
          this.x1Axis.baseData[i].yValue *
          this.x2Axis.baseData[i].yValue *
          this.yAxis.baseData[i].yValue,
      });
    }

    return rulesList;
  }

  /**
   * Get axis from an array of countries.
   * @param {string} param - Label of the input axis: ('x1' | 'x2' | 'y').
   * @returns {Axis}
   * @private
   */
  _getAxis(param) {
    const output = [];
    this.countriesList.forEach((country) => {
      output.push(+`${country[param]}`.replace(/,/g, '.'));
    });
    return new Axis(output, this.N);
  }
}
