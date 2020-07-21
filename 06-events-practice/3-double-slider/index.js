export default class DoubleSlider {
  element;
  innerElement;
  progress;
  leftThumb;
  rightThumb;
  activeThumb = '';
  formatter;

  position = {
    shiftX: 0,
    sliderLeft: 0
  }

  onMouseMove = event => {
    const {clientX} = event;
    const {shiftX, sliderLeft} = this.position;

    let newLeft = clientX - shiftX - sliderLeft;

    if (newLeft < 0) {
      newLeft = 0;
    }

    const rightEdge = this.innerElement.offsetWidth - this.rightThumb.offsetWidth;

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    let newRight = this.innerElement.offsetWidth - newLeft;

    if (this.activeThumb === 'left') {
      this.leftThumb.style.left = `${newLeft}px`;
      this.progress.style.left = `${newLeft}px`;
      this.leftBoundary.innerHTML = this.formatter(this.min + newLeft);
    }

    if (this.activeThumb === 'right') {
      this.rightThumb.style.right = `${newRight}px`;
      this.progress.style.right = `${newRight}px`;
      this.rightBoundary.innerHTML = this.formatter(this.max - newRight);
    }

    // if(this.activeThumb === 'left' && newLeft === rightEdge) {
    //   this.leftBoundary.innerHTML = this.formatter(this.max);
    //   this.rightBoundary.innerHTML = this.formatter(this.max);
    // }
  }

  onMouseUp = event => {
    const customEvent = new CustomEvent('range-select', {
      bubbles: true,
      detail: {from: this.min + this.calculatedFrom, to: this.max - this.calculatedTo}
    })

    this.element.dispatchEvent(customEvent);
    this.removeListeners();
  }

  constructor({
                min = 400, max = 600, selected = {
      from: 400,
      to: 600
    }, formatValue = value => '$' + value
              } = {}) {
    this.min = min;
    this.max = max;

    this.formatter = formatValue;

    this.calculatedFrom = selected.from - min;
    if (this.calculatedFrom < 0) {
      this.calculatedFrom = 0;
    }

    this.calculatedTo = max - selected.to;
    if (this.calculatedTo < 0) {
      this.calculatedTo = 0;
    }

    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    const leftThumb = this.element.querySelector('.range-slider__thumb-left');

    leftThumb.addEventListener('pointerdown', event => {
      event.preventDefault();

      this.activeThumb = 'left';

      this.getInitialPosition(event, leftThumb);

      document.addEventListener('pointermove', this.onMouseMove);
      document.addEventListener('pointerup', this.onMouseUp);
    });

    const rightThumb = this.element.querySelector('.range-slider__thumb-right');

    rightThumb.addEventListener('pointerdown', event => {
      event.preventDefault();

      this.activeThumb = 'right';

      this.getInitialPosition(event, rightThumb);

      document.addEventListener('pointermove', this.onMouseMove);
      document.addEventListener('pointerup', this.onMouseUp);
    });
  }

  getInitialPosition(event, thumb) {
    this.position.shiftX = event.clientX - thumb.getBoundingClientRect().left;
    this.position.sliderLeft = this.innerElement.getBoundingClientRect().left;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="range-slider">
        <span data-element="from">$30</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.calculatedFrom}%; right: ${this.calculatedTo}%"></span>
          <span class="range-slider__thumb-left" style="left: ${this.calculatedFrom}%"></span>
          <span class="range-slider__thumb-right" style="right: ${this.calculatedTo}%"></span>
        </div>
        <span data-element="to">$70</span>
      </div>
    `;

    this.element = element.firstElementChild;
    this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
    this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
    this.innerElement = this.element.querySelector('.range-slider__inner');
    this.progress = this.element.querySelector('.range-slider__progress');

    this.leftBoundary = element.querySelector('span[data-element="from"]');
    this.leftBoundary.innerHTML = this.formatter(this.min + this.calculatedFrom);
    this.rightBoundary = element.querySelector('span[data-element="to"]');
    this.rightBoundary.innerHTML = this.formatter(this.max - this.calculatedTo);
  }

  remove() {
    this.element.remove();
  }

  removeListeners() {
    document.removeEventListener('pointerup', this.onMouseUp);
    document.removeEventListener('pointermove', this.onMouseMove);
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }
}
