class Tooltip {
  element = null;
  static _instance = null;

  // constructor() {
  //   if (Tooltip._instance) {
  //     return Tooltip._instance;
  //   }
  //
  //   Tooltip._instance = this;
  //   this.render();
  //   //Tooltip.updateToolTip = Tooltip.updateToolTip.bind(this);
  // }

  render() {
    if(this.element) {
      this.element.remove();
    }

    const element = document.createElement('div');
    element.innerHTML = `<div class="tooltip">This is tooltip</div>`;
    this.element = element.firstElementChild;
    document.body.append(this.element);
  }

  pointerOverHandler(event) {
    if (event.target.dataset.tooltip != undefined) {
      this.render();
      let elem = document.body.querySelector('.tooltip');
      if (elem !== null) {
        elem.textContent = event.target.dataset.tooltip;
      }
    }
  }

  pointerOutHandler(event) {
    if (event.target.dataset.tooltip != undefined) {
      let elem = document.body.querySelector('.tooltip');
      if (elem !== null) {
        if(this.element) {
          this.element.remove();
          this.element = null;
        }
      }
    }
  }

  initialize() {
    if (!Tooltip._instance) {
      Tooltip._instance = this;
      this.pointerOverHandler = this.pointerOverHandler.bind(this);
      this.pointerOutHandler = this.pointerOutHandler.bind(this);
    }
    this.render();

    document.removeEventListener('pointerover', this.pointerOverHandler);
    document.addEventListener('pointerover', this.pointerOverHandler);

    document.removeEventListener('pointerout', this.pointerOutHandler);
    document.addEventListener('pointerout', this.pointerOutHandler);
  }

  remove() {
    if(this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}

const tooltip = new Tooltip();

export default tooltip;
