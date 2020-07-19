export default class SortableTable {
  element = null;
  subElements = {};
  headersConfig = {};
  data = [];

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');
    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };
      return orders[order];
    }
    if(column) {
      const {id, order} = column.dataset;
      const sortedData = this.sortData(id, toggleOrder(order));
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = order === 'asc' ? 'desc' : 'asc';

      if(!arrow) {
        column.append(this.subElements.arrow)
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick)
  }

  constructor(header, {
    data = [],
    sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headersConfig = header;
    this.data = data;
    this.sorted = sorted;

    this.render();
    this.sort(this.sorted.id, this.sorted.order);
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
           ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}</div>`
  }

  getHeaderRow({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
      <spam>${title}</spam>
      ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist ? `
      <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
      </span>` : '';
  }

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
      ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => `
    <div class="sortable-table__row">
        ${this.getTableRow(item)}
    </div>
    `).join('');
  }

  getTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`
    }).join('');
  }

  getTable(data) {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(data)}
      </div>`;
  }

  render() {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = this.getTable(this.data);

    const element = tempElement.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);

    this.initEventListeners();
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll(`.sortable-table__cell[data-id]`);
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id == field);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }

}


