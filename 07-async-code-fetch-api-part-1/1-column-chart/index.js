import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element = null;
  subElements = {};
  chartHeight = 50;

  constructor({
                label = '',
                link = '',
                formatHeading = data => data,
                url = '',
                range = {
                  from: new Date(),
                  to: new Date(),
                }
              } = {}) {
    this.url = new URL(url, BACKEND_URL)
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

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

  // update({bodyData} = {}) {
  //   this.data = bodyData;
  //   this.render();
  // }

  render() {
    const {from, to} = this.range;

    const element = document.createElement('div');

    //const recalculatedValues = this.getColumnProps(this.data);
    //const dataBlock = recalculatedValues.map(item => `<div style="--value:${item.value}" data-tooltip="${item.percent}"></div>`).join('');
    const template = `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
            ${this.label} ${this.getLink()}
            </div>
            <div class="column-chart__container">
              <div data-element="header" class="column-chart__header"></div>
              <div data-element="body" class="column-chart__chart">
              </div>
            </div>
        </div>
          `;

    element.innerHTML = template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.loadData(from, to);

    // if (this.data.length) {
    //   this.element.classList.remove('column-chart_loading');
    // }
  }

  async loadData(from, to) {
    this.element.classList.add('column-chart_loading');
    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';

    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    const data = await fetchJson(this.url);

    this.setNewRange(from, to);

    if (data && Object.values(data).length) {
      this.subElements.header.textContent = this.getHeaderValue(data);
      this.subElements.body.innerHTML = this.getColumnBody(data);

      this.element.classList.remove('column-chart_loading');
      ;
    }
  }

  setNewRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));
  }

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));

    return Object.entries(data).map(([key, value]) => {
      const scale = this.chartHeight / maxValue;
      const percent = (value / maxValue * 100).toFixed(0);
      const tooltip = `<span>
                <small>${key.toLocaleString('default', {dateStyle: 'medium'})}</small>
                <br>
                <strong>${percent}%</strong>>
                </span>`;
      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${tooltip}"/>`

    }).join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async update(from, to) {
    return await this.loadData(from, to);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
