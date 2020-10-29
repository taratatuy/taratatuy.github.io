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

    this.func = '';
    this.startPoint = '';
    this.endPoint = '';
    this.step = '';
  }

  _conditionFunc() {
    if (this.functionInput.value == '') {
      this.functionInput.classList.add('is-invalid');
      // TODO: Feedback here.
      return false;
    }

    return true;
  }

  _conditionA() {
    if (this.startPointInput.value == '') {
      this.startPointInput.classList.add('is-invalid');
      document.querySelector('#inputA-feedback').textContent =
        'Please enter a value.';
      return false;
    }

    if (this.startPoint > +this.endPoint - +this.step) {
      this.startPointInput.classList.add('is-invalid');
      document.querySelector('#inputA-feedback').textContent =
        'Section is less than step.';
      return false;
    }

    return true;
  }

  _conditionB() {
    if (this.endPointInput.value == '') {
      this.endPointInput.classList.add('is-invalid');
      document.querySelector('#inputB-feedback').textContent =
        'Please enter a value.';
      return false;
    }

    if (this.endPointInput.value < +this.startPoint + +this.step) {
      this.endPointInput.classList.add('is-invalid');
      document.querySelector('#inputB-feedback').textContent =
        'Section is less than step.';
      return false;
    }

    return true;
  }

  _conditionStep() {
    if (this.stepInput.value == '') {
      this.stepInput.classList.add('is-invalid');
      document.querySelector('#step-feedback').textContent =
        'Please enter a value.';
      return false;
    }

    if (this.stepInput.value <= 0) {
      this.stepInput.classList.add('is-invalid');
      document.querySelector('#step-feedback').textContent =
        'Step less or equal 0.';
      return false;
    }

    if (this.stepInput.value > +this.endPoint - +this.startPoint) {
      this.stepInput.classList.add('is-invalid');
      document.querySelector('#step-feedback').textContent =
        'Section is less than step.';
      return false;
    }

    return true;
  }

  _onFunctionInputBlur() {
    if (this.functionInput.value == this.func) {
      return;
    }
    this._updateAndClear();
  }

  _onStartPointInputBlur() {
    if (this.startPointInput.value == this.startPoint) {
      return;
    }
    this._updateAndClear();
  }

  _onEndPointInputBlur() {
    if (this.endPointInput.value == this.endPoint) {
      return;
    }
    this._updateAndClear();
  }

  _onStepInputBlur() {
    if (this.stepInput.value == this.step) {
      return;
    }
    this._updateAndClear();
  }

  _updateAndClear() {
    let flag = 0;

    this.func = this.functionInput.value;
    this.functionInput.placeholder = '';
    this.startPoint = this.startPointInput.value;
    this.startPointInput.placeholder = '';
    this.endPoint = this.endPointInput.value;
    this.endPointInput.placeholder = '';
    this.step = this.stepInput.value;
    this.stepInput.placeholder = '';

    if (this._conditionFunc()) {
      this.functionInput.classList.remove('is-invalid');
      flag++;
    }
    if (this._conditionA()) {
      this.startPointInput.classList.remove('is-invalid');
      flag++;
    }
    if (this._conditionB()) {
      this.endPointInput.classList.remove('is-invalid');
      flag++;
    }
    if (this._conditionStep()) {
      this.stepInput.classList.remove('is-invalid');
      flag++;
    }

    if (flag != 4) return;

    try {
      this._update();
    } catch {}
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
}
