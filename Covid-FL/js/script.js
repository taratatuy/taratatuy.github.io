function handleFile(e) {
  var files = e.target.files,
    f = files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });

    [main.countriesList, main.invalidDataLines] = new Worksheet(
      workbook
    ).getSuitCountries();

    main.init();
  };
  reader.readAsArrayBuffer(f);
}

function changeN(e) {
  if (e.target.value < 1) e.target.value = 1;

  if (main.N == e.target.value) return;

  main.N = e.target.value;
  if (main.countriesList) main.init();
}

function updateDif() {
  const x1DifInput = document.querySelector('.x1-dif-input');
  const x2DifInput = document.querySelector('.x2-dif-input');

  console.log(x1DifInput.value, x2DifInput.value);

  if (!x1DifInput.value || !x2DifInput.value) return;

  main.menuBuilder.buildDifuz(x1DifInput.value, x2DifInput.value);
}

const main = {
  N: 2,
  init() {
    const fuzzySystem = new FuzzySystem(this.countriesList, this.N);
    main.menuBuilder = new MenuBuilder(
      this.countriesList,
      this.invalidDataLines,
      fuzzySystem
    );

    document
      .querySelector('.x1-dif-input')
      .addEventListener('change', updateDif, false);
    document
      .querySelector('.x2-dif-input')
      .addEventListener('change', updateDif, false);
  },

  updateDifuz() {
    main.menuBuilder.buildDifuz();
  },
};

document
  .querySelector('.input_xls')
  .addEventListener('change', handleFile, false);

document.querySelector('.input_n').addEventListener('change', changeN, false);
