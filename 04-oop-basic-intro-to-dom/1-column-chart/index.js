export default class ColumnChart {
  element = null;
  chartHeight = 50;

  constructor({data=[], label = '', value = '%'} = {}) {
    this.noInputObject = arguments.length === 0;
    this.data = data;
    this.label = label;
    this.value = value;

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

  update({bodyData} = {}) {
    this.data = bodyData;
    this.render();
  }

  render() {
    let template = '';
    const element = document.createElement('div');

    if (!this.noInputObject)
    {
      const recalculatedValues = this.getColumnProps(this.data);
      const dataBlock = recalculatedValues.map(item => `<div style="--value:${item.value}" data-tooltip="${item.percent}"></div>`).join('');
      template = `
            <div class="column-chart__title">
            ${this.label}
              <a href="/sales" class="column-chart__link">View all</a>
            </div>
            <div class="column-chart__container">
              <div class="column-chart__header">${this.value}</div>
              <div class="column-chart__chart">
                ${dataBlock}
              </div>
            </div>
          `;
    }
    else
    {
      template = `
                  <div class="column-chart__title">
                    Total orders
                    <a class="column-chart__link" href="#">View all</a>
                  </div>
                  <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">
                      344
                    </div>
                    <div data-element="body" class="column-chart__chart">

                    </div>
                  </div>
          `;
      element.classList.add('column-chart');
      element.classList.add('column-chart_loading');
      element.style.innerHTML = `--chart-height: 50`;
    }

    element.innerHTML = template;
    this.element = element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
