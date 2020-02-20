class InsertionSort {
  constructor(length, minValue, maxValue) {
    this.arrayDiv = document.getElementById('array');
    this.length = length;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.array = [];

    // this.getRandomArray();
    this.getOrderedArray();
    this.drawArray();
  }

  getRandomArray() {
    for (let i = 0; i < this.length; i++) {
      let dispersion = this.maxValue - this.minValue;
      this.array.push(this.minValue + Math.round(Math.random() * dispersion));
    }
  }

  getOrderedArray() {
    for (let i = this.minValue; i < this.length; i++) this.array.push(i);
    this.array.sort(() => {
      return Math.random() - 0.5;
    });
  }

  drawArray() {
    this.arrayDiv.innerHTML = '';
    let oldStyle = document.getElementsByTagName('style') || null;
    // console.log(oldStyle);
    if (oldStyle[0]) oldStyle[0].remove();

    let style = document.createElement('style');
    style.type = 'text/css';
    let styleInnerHtml = '';

    for (let i = 0; i < this.array.length; i++) {
      let div = document.createElement('div');
      div.className = `value number${i}`;
      this.arrayDiv.append(div);

      styleInnerHtml += `.number${i} {  width: ${100 /
        this.array.length}%; height: ${(this.array[i] * 100) /
        this.maxValue}%; } \n`;
    }
    style.innerHTML = styleInnerHtml;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  *insertionSortGen() {
    for (let i = 1; i < this.array.length; i++) {
      let num = this.array[i];
      let j = i - 1;

      this.drawArray();
      document.getElementsByClassName(`number${i}`)[0].style.backgroundColor =
        'red';
      yield i;

      while (j > -1 && this.array[j] > num) {
        this.array[j + 1] = this.array[j];

        document.getElementsByClassName(`number${j}`)[0].style.backgroundColor =
          'green';
        j--;
        yield j;
      }
      this.array[j + 1] = num;

      this.drawArray();
      yield i;
    }

    this.drawArray();
  }

  start() {
    let isGen = this.insertionSortGen();

    setInterval(() => {
      isGen.next();
    }, 300);
  }
}

let myInsertionSort = new InsertionSort(15, 1, 20);

function startSort() {
  myInsertionSort.start();
}
