class MenuBuilder {
  constructor(countriesList, invalidDataLines, fuzzySystem) {
    this.fuzzySystem = fuzzySystem;
    this.countriesList = countriesList;
    this.invalidDataLines = invalidDataLines;

    this.countriesListEl = document.querySelector('.countries-list');
    this.invalidDataLinesEl = document.querySelector('.invalid-countries');
    this.unsortedRulesListEl = document.querySelector('.rules-list');
    this.sortedRulesListEl = document.querySelector('.rules-list-sorted');

    this._hideDiscription();
    this.displayCountries();
    this.buildChart('x1-chart', 'x1-wrapper', fuzzySystem.x1Axis, 'X1');
    this.buildChart('x2-chart', 'x2-wrapper', fuzzySystem.x2Axis, 'X2');
    this.buildChart('y1-chart', 'y-wrapper', fuzzySystem.yAxis, 'Y');

    this._fillUnsortedRulesList();
    this._fillSortedRulesList();
    this._buildRulesBase();
  }

  _hideDiscription() {
    document.querySelector('.discription').classList.add('hiden');
  }

  _buildRulesBase() {
    const rulesBaseEl = document.querySelector('.rules-base');
    rulesBaseEl.innerHTML = '';

    const rulesBaseHeaderEl = document.querySelector('.rules-base-header');
    rulesBaseHeaderEl.innerHTML = '';

    this._addRuleCell('Rules base:', '', rulesBaseHeaderEl, 'head-label');
    this._addRuleCell('', '', rulesBaseHeaderEl, 'head-legend');

    const legend = document.querySelector('.head-legend');
    this._addRuleCell('x1:', '', legend, '');
    this._addRuleCell('', '', legend, 'x1Color color');
    this._addRuleCell('x2:', '', legend, '');
    this._addRuleCell('', '', legend, 'x2Color color');

    this.fuzzySystem.rulesBase.forEach((line) => {
      this._addRuleCell('', '', rulesBaseEl, 'rules-base-line');
      const lineEl = document.querySelector(
        '.rules-base > .rules-base-line:last-child'
      );

      line.forEach((cell) => {
        const cellText = cell.label || '';
        let cellColor = '';
        if (cell.sp) cellColor = ColorLuminance('#95d5b2', 1 - cell.sp);

        this._addRuleCell(cellText, cellColor, lineEl);
      });
    });
  }

  _sortRules() {
    const conditionsX1 = {};
    const conditionsX2 = {};
    const conditionsY = {};

    const x1Axis = this.fuzzySystem.x1Axis.regions;
    const x2Axis = this.fuzzySystem.x2Axis.regions;
    const yAxis = this.fuzzySystem.yAxis.regions;

    for (let i = 0; i < x1Axis.length; i++) {
      conditionsX1[x1Axis[i].label] = 10000 * (i + 1);
      conditionsX2[x2Axis[i].label] = 100 * (i + 1);
      conditionsY[yAxis[i].label] = 1 * (i + 1);
    }

    return function (a, b) {
      return (
        conditionsX1[a.x1.label] +
        conditionsX2[a.x2.label] +
        conditionsY[a.y.label] -
        a.sp / 10 -
        conditionsX1[b.x1.label] -
        conditionsX2[b.x2.label] -
        conditionsY[b.y.label] +
        b.sp / 10
      );
    };
  }

  _fillUnsortedRulesList() {
    this.unsortedRulesListEl.innerHTML = '';
    this._addRulesTabelsHeader(
      'List of rules:',
      this._addUnsortedRuleCell.bind(this)
    );

    const unsortedRulesList = this.fuzzySystem.rulesList;

    for (let i = 0; i < unsortedRulesList.length; i++) {
      const color = ColorLuminance('#95d5b2', 1 - unsortedRulesList[i].sp);
      this._addUnsortedRuleCell(unsortedRulesList[i].number + 1);
      this._addUnsortedRuleCell(unsortedRulesList[i].x1.label, color);
      this._addUnsortedRuleCell(unsortedRulesList[i].x2.label, color);
      this._addUnsortedRuleCell(unsortedRulesList[i].y.label, color);
      this._addUnsortedRuleCell(+unsortedRulesList[i].sp.toFixed(3), color);
    }
  }

  _fillSortedRulesList() {
    this.sortedRulesListEl.innerHTML = '';
    this._addRulesTabelsHeader(
      'Sorted list of rules:',
      this._addSortedRuleCell.bind(this)
    );

    const sortedRulesList = this.fuzzySystem.rulesList.sort(this._sortRules());

    let lastLine = { x1: '', x2: '' };

    for (let i = 0; i < sortedRulesList.length; i++) {
      if (
        lastLine.x1 != sortedRulesList[i].x1.label ||
        lastLine.x2 != sortedRulesList[i].x2.label
      ) {
        lastLine.x1 = sortedRulesList[i].x1.label;
        lastLine.x2 = sortedRulesList[i].x2.label;

        const color = ColorLuminance('#95d5b2', 1 - sortedRulesList[i].sp);
        this._addSortedRuleCell(sortedRulesList[i].number + 1);
        this._addSortedRuleCell(sortedRulesList[i].x1.label, color);
        this._addSortedRuleCell(sortedRulesList[i].x2.label, color);
        this._addSortedRuleCell(sortedRulesList[i].y.label, color);
        this._addSortedRuleCell(+sortedRulesList[i].sp.toFixed(3), color);
      }
    }
  }

  _addRulesTabelsHeader(label, addElem) {
    addElem(label, '', 'head-label');
    addElem('N', '', 'head-number');
    addElem('IF', '', 'head-if');
    addElem('THEN', '', 'head-then');
    addElem('SP', '', 'head-sp');
    addElem('x1 is', '', 'head-x1');
    addElem('x2 is', '', 'head-x2');
    addElem('y is', '', 'head-y');
  }

  _addUnsortedRuleCell(innerText, color, cssClass = false) {
    this._addRuleCell(innerText, color, this.unsortedRulesListEl, cssClass);
  }

  _addSortedRuleCell(innerText, color, cssClass = false) {
    this._addRuleCell(innerText, color, this.sortedRulesListEl, cssClass);
  }

  _addRuleCell(innerText, color, elem, cssClass = false) {
    const div = document.createElement('div');
    div.innerText = innerText;
    if (cssClass) div.className = cssClass;
    div.style = `background-color: ${color}`;
    elem.append(div);
  }

  displayCountries() {
    this.countriesListEl.innerHTML = '';

    this._addCountryLine('', 'Name', 'X1', 'X2', 'Y', true);

    let i = 0;
    this.countriesList.forEach((country) => {
      i++;
      this._addCountryLine(
        `${i}.`,
        country.name,
        country.x1,
        country.x2,
        country.y
      );
    });
    this.invalidDataLinesEl.innerText = `Invalid data lines: ${this.invalidDataLines}`;
  }

  _addCountryLine(i, name, x1, x2, y, bold = false) {
    try {
      x1 = +x1.toFixed(4);
      x2 = +x2.toFixed(4);
      y = +y.toFixed(4);
    } catch {}

    const counter = this._getCountryElRows(`${i}`, 'row1 bold');
    this.countriesListEl.append(counter);
    const countryName = this._getCountryElRows(
      name,
      bold ? 'row2 bold' : 'row2'
    );
    this.countriesListEl.append(countryName);
    const countryX1 = this._getCountryElRows(x1, bold ? 'row3 bold' : 'row3');
    this.countriesListEl.append(countryX1);
    const countryX2 = this._getCountryElRows(x2, bold ? 'row4 bold' : 'row4');
    this.countriesListEl.append(countryX2);
    const countryY = this._getCountryElRows(y, bold ? 'row5 bold' : 'row5');
    this.countriesListEl.append(countryY);
  }

  _getCountryElRows(innerText, className) {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = innerText;
    return div;
  }

  buildChart(canvasID, wrapperClass, axis, axisLabel) {
    let canvas = document.getElementById(canvasID);
    if (canvas) canvas.remove();

    canvas = document.createElement('canvas');
    canvas.id = canvasID;
    canvas.height = '300';

    document.querySelector('.' + wrapperClass).appendChild(canvas);

    const ctx = canvas.getContext('2d');
    this.chatBuilder = new ChartBuilder(axis, axisLabel, ctx);
  }
}
