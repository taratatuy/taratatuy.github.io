/**
 * Class for reading incoming page from excel sheets.
 */
class Worksheet {
  /**
   * Creating class for first worksheet
   * @param {Object} workbook - The workbok object from xlsx lib.
   */
  constructor(workbook) {
    this.workbook = workbook;
    this.worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
    this.sheetRows = this._parse();
  }

  /**
   * Parsing sheet for data. Returns Object{<line_number>: {<letter>: cell_data}}.
   * @private
   */
  _parse() {
    let data = {};
    for (let cell in this.worksheet) {
      const num = cell.match(/\d+/g);
      const chars = cell.match(/\D/g);
      if (chars.length != 1) continue;

      data[`${num}`] = data[`${num}`] || {};
      data[`${num}`][`${chars}`] = this.worksheet[`${chars}${num}`].v;
    }
    return data;
  }

  /**
   * Returns an array of countries with name, x1, x2 and y valid data.
   */
  getSuitCountries() {
    const rowsArray = Object.keys(this.sheetRows).map(
      (key) => this.sheetRows[key]
    );

    const countriesList = [];

    let invalidDataLines = 0;

    for (let i = 2; i < rowsArray.length; i++) {
      let continueFlag = false;
      for (let char in rowsArray[i])
        if (/н\/д/.test(rowsArray[i][char])) {
          continueFlag = true;
          break;
        }

      if (continueFlag) {
        invalidDataLines++;
        continue;
      }
      countriesList.push({
        name: rowsArray[i].A,
        x1: rowsArray[i].B,
        x2: rowsArray[i].C,
        y: rowsArray[i].D,
      });
    }

    return [countriesList, invalidDataLines];
  }
}
