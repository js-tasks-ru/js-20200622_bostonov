export default class NotificationMessage {
  static isRunning = false;
  static timerId = null;
  element = null;

  constructor(message, {duration = 0, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  get template() {
    return `
    <div class="notification ${this.type}" style="--value:20s">
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

  show(parent) {
    if (NotificationMessage.isRunning) {
      if (NotificationMessage.timerId != null) {
        clearTimeout(NotificationMessage.timerId);
      }
    }

    this.remove();

    if (parent !== undefined) {
      parent.append(this.element)
    } else {
      document.body.append(this.element);
    }

    NotificationMessage.isRunning = true;

    NotificationMessage.timerId = setTimeout(() => {
      this.remove();
      NotificationMessage.isRunning = false;
    }, this.duration - 1000);
  }

  remove() {
    const element = document.getElementsByClassName('notification')[0];
    if (element !== undefined) {
      element.remove();
    }
  }

  destroy() {
    this.remove();
  }

}
