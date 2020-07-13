export default class NotificationMessage {
  static activeNotification;


  constructor(message, {duration = 0, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    NotificationMessage.activeNotification = this.element;
  }

  get template() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration}ms">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>
    `;
  }

  show(parent = document.body) {
    parent.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.duration);

    return this.element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.activeNotification = null;
  }

}
