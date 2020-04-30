import EventSupport from './EventSupport';

export default class NodeSupport extends EventSupport {

  parent = null
  children = []

  appendChild(child) {
    child.parent?.removeChild(child);
    this.children.push(child);
    child.name && (this[child.name] = child);
    child.parent = this;

    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index === -1) return;
    this.children.splice(index, 1);
    delete this[child.name];
    child.parent = null;

    return child;
  }
}
