export default class ColumnChart {
  element = null;
  chartHeight = 50;

  constructor({data = [], label = '', value = '%', link = ''} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ``;
  }

  update({bodyData} = {}) {
    this.data = bodyData;
    this.render();
  }

  render() {
    const element = document.createElement('div');

    const recalculatedValues = this.getColumnProps(this.data);
    const dataBlock = recalculatedValues.map(item => `<div style="--value:${item.value}" data-tooltip="${item.percent}"></div>`).join('');
    const template = `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
            ${this.label} ${this.getLink()}
            </div>
            <div class="column-chart__container">
              <div class="column-chart__header">${this.value}</div>
              <div class="column-chart__chart">
                ${dataBlock}
              </div>
            </div>
        </div>
          `;

    element.innerHTML = template;
    this.element = element.firstElementChild;

    if (this.data.length)
    {
      this.element.classList.remove('column-chart_loading');
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
