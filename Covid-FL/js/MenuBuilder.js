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
    this._buildDIfuzHeader();
  }

  buildDifuz(x1, x2) {
    const wrapper = document.querySelector('.difuz-wrapper');

    const [result, difRules] = this.fuzzySystem.defuzzification(x1, x2);

    this._buildDifResult(wrapper, result);
    this._buildDifuzTableWrapper(wrapper, difRules);
  }

  _buildDifuzTableWrapper(wrapper, difRules) {
    let tableWrapper =
      document.querySelector('.table-wrapper') ||
      this._addCell('', wrapper, 'table-wrapper');

    tableWrapper.innerHTML = '';

    difRules.forEach((rule) => {
      this._buildDifuzTable(tableWrapper, rule);
    });
  }

  _buildDifuzTable(tableWrapper, difuzRule) {
    const difuzTable = this._addCell('', tableWrapper, 'difuz-table');

    const color = ColorLuminance('#95d5b2', 1 - difuzRule.sp);

    this._addCell('Rule:', difuzTable, 'head');
    const rule = this._addCell('', difuzTable, 'rule');
    const x1RuleCell = this._addCell(difuzRule.x1RuleLabel, rule, 'rule-x1');
    x1RuleCell.style = `background-color: ${color}`;
    rule.innerHTML += 'and';
    const x2RuleCell = this._addCell(difuzRule.x2RuleLabel, rule, 'rule-x2');
    x2RuleCell.style = `background-color: ${color}`;
    rule.innerHTML += 'then';
    const yRuleCell = this._addCell(difuzRule.yRuleLabel, rule, 'rule-y');
    yRuleCell.style = `background-color: ${color}`;

    const mu = this._addCell('', difuzTable, 'mu');
    const muX1 = this._addCell('', mu, 'mu-x1');
    this._addCell('μ(x1):', muX1, 'mu-x1');
    this._addCell(difuzRule.x1Mu, muX1, 'mu-x1');
    const muX2 = this._addCell('', mu, 'mu-x2');
    this._addCell('μ(x2):', muX2, 'mu-x2');
    this._addCell(difuzRule.x2Mu, muX2, 'mu-x2');

    const min = this._addCell('', difuzTable, 'min');
    this._addCell('min', min, 'label');
    this._addCell(difuzRule.min, min, 'value');

    const tau = this._addCell('', difuzTable, 'min');
    this._addCell('τ', tau, 'label');
    this._addCell(difuzRule.tau, tau, 'value');

    const avgY = this._addCell('', difuzTable, 'avg-y');
    this._addCell('Avg Y:', avgY, 'label');
    this._addCell(difuzRule.avgY, avgY, 'value');
  }

  _buildDifResult(wrapper, value) {
    let difuzResult =
      document.querySelector('.difuz-result') ||
      this._addCell('', wrapper, 'difuz-result');

    if (difuzResult.innerHTML) difuzResult.innerHTML = '';

    this._addCell('Result:', difuzResult, 'head');
    this._addCell(value, difuzResult, 'value');
  }

  _buildDIfuzHeader() {
    const wrapper = document.querySelector('.difuz-wrapper');
    wrapper.innerHTML = `
      <div class="difuz-head">Difuzzification:</div>
      <div class="difuz-inputs">
        <div class="input-group">
          <span class="input-group-text">x1:</span>
          <input type="number" class="x1-dif-input">
        </div>
        <div class="input-group">
          <span class="input-group-text">x2:</span>
          <input type="number" class="x2-dif-input">
        </div>
      </div>`;
  }

  _addCell(innerText, elem, cssClass = false) {
    const div = document.createElement('div');
    div.innerText = innerText;
    if (cssClass) div.className = cssClass;
    elem.append(div);
    return div;
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

    const x1Axis = this.fuzzySystem.x1Axis.regions;
    const x2Axis = this.fuzzySystem.x2Axis.regions;

    for (let i = 0; i < x1Axis.length; i++) {
      conditionsX1[x1Axis[i].label] = 1000 * (i + 1);
      conditionsX2[x2Axis[i].label] = 10 * (i + 1);
    }

    return function (a, b) {
      return (
        conditionsX1[a.x1.label] +
        conditionsX2[a.x2.label] -
        a.sp -
        conditionsX1[b.x1.label] -
        conditionsX2[b.x2.label] +
        b.sp
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
