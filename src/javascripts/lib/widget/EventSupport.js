export default class EventSupport {

  listeners = {}

  bind(type, handler) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    if (this.listeners[type].indexOf(handler) === -1) {
      this.listeners[type].push(handler);
    }
  }

  unbind(type, handler) {
    const index = this.listeners[type].indexOf(handler);
    if (index === -1) return;
    this.listeners[type].splice(index, 1);
  }

  dispatch(type, event = {}) {
    const listenerArray = this.listeners[type];
    if (listenerArray === undefined) return;
    for (let i = 0, l = listenerArray.length; i < l; i++) {
      listenerArray[i].call(this, { type, ...event });
    }
  }
}
