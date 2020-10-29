class Menu {
  constructor() {
    this.functionInput = document.querySelector('#functionInput');
    this.startPointInput = document.querySelector('#startPointInput');
    this.endPointInput = document.querySelector('#endPointInput');
    this.stepInput = document.querySelector('#stepInput');

    this.func = '2*x**5 - 10*x**3 + 13*x**2 - 7*x + 11';
    this.startPoint = 0;
    this.endPoint = 1.5;
    this.step = 0.25;

    this.functionInput.addEventListener(
      'blur',
      this._onFunctionInputBlur.bind(this)
    );

    this.startPointInput.addEventListener(
      'blur',
      this._onStartPointInputBlur.bind(this)
    );

    this.endPointInput.addEventListener(
      'blur',
      this._onEndPointInputBlur.bind(this)
    );

    this.stepInput.addEventListener('blur', this._onStepInputBlur.bind(this));

    this._build();
  }

  _onFunctionInputBlur() {
    console.log(this.functionInput.value);

    if (this.functionInput.value == '') {
      console.log('this.functionInput.value == undefined');
      return;
    }

    this.func = this.functionInput.value;
    this.functionInput.placeholder = '';
    this._update();
  }

  _onStartPointInputBlur() {
    if (this.startPointInput.value == '') {
      console.log('this.startPointInput.value == undefined');
      return;
    }

    this.startPoint = this.startPointInput.value;
    this.startPointInput.placeholder = '';

    if (this.startPoint <= +this.endPoint - this.step) {
      this._update();
    }
  }

  _onEndPointInputBlur() {
    if (this.endPointInput.value == '') {
      console.log('this.endPointInput.value == undefined');
      return;
    }

    if (this.endPointInput.value <= +this.startPoint + this.step) {
      console.log(
        `${this.endPointInput.value} <= ${+this.startPoint + this.step}`
      );
      return;
    }

    this.endPoint = this.endPointInput.value;
    this.endPointInput.placeholder = '';
    this._update();
  }

  _onStepInputBlur() {
    console.log(this.stepInput.value);

    if (this.stepInput.value == '') {
      console.log('this.stepInput.value == undefined');
      return;
    }

    if (this.stepInput.value <= 0) {
      console.log('this.stepInput.value <= 0');
      return;
    }

    if (this.stepInput.value >= +this.endPoint - this.startPoint) {
      console.log('this.stepInput.value >= +this.endPoint - this.startPoint');
      return;
    }

    this.step = this.stepInput.value;
    this.stepInput.placeholder = '';
    this._update();
  }

  _update() {
    const f = new SplineInterpolation(
      +this.startPoint,
      +this.endPoint,
      +this.step,
      this.func
    );

    this.builder.update(f);
  }

  _build() {
    const ctx = document.getElementById('myChart').getContext('2d');

    const f1 = new SplineInterpolation(
      +this.startPoint,
      +this.endPoint,
      +this.step,
      this.func
    );

    this.builder = new Builder(f1, ctx);
  }

  // constructor(elem) {
  //   this.elem = elem;
  //   // this.elem.onblur = this.onChange.bind(this);
  //   this.elem.addEventListener('input', this.onChange.bind(this));

  //   this.functionInput = '2*x^5 - 10*x^3 + 13*x^2 - 7*x + 11';
  //   this.startPoint = 0;
  //   this.endPoint = 1.5;
  //   this.step = 0.25;

  //   this.updateFunc();
  // }

  // updateFunc() {
  //   const ctx = document.getElementById('myChart').getContext('2d');

  //   // const func = '2*x**5 - 10*x**3 + 13*x**2 - 7*x + 11';
  //   // const a = 0;
  //   // const b = 1.5;
  //   // const h = 0.25;

  //   const f1 = new SplineInterpolation(
  //     this.startPoint,
  //     this.endPoint,
  //     this.step,
  //     this.functionInput
  //   );
  //   // const f2 = new SplineInterpolation(a, b, h, 'x^2');
  //   const b1 = new Builder(f1, ctx);
  //   //   b1.draw();
  // }

  // onChange(event) {
  //   // console.log(event.target.value);
  //   let inputType = event.target.dataset.inputType;
  //   if (event.target.value != undefined) {
  //     this[inputType] = event.target.value;

  //     if (inputType == 'step' && step <= 0) {
  //       this[inputType] = 0.1;
  //     }

  //     this.updateFunc();
  //   }
  // }
}
