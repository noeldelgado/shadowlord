/**
 * @see https://github.com/azendal/neon/blob/master/stdlib/widget.js
 */
import NodeSupport from './NodeSupport';
import { createElementFromString, placeholderString, replaceTemplateWidgets } from './utils';

export default class Widget extends NodeSupport {

  static ELEMENT_CLASS = 'widget'

  static defaults = {
    el: null,
    className: null,
    attr: {}
  }

  active = false
  __destroyed = false

  constructor(config = {}) {
    super();

    Object.assign(this, this.constructor.defaults, config);

    if (!this.el) {
      this.el = this.template() |> createElementFromString;
      this.children.forEach(this::replaceTemplateWidgets);
      this.element.classList.add(...this.constructor.ELEMENT_CLASS.split(' '));
    }

    for (let prop in this.attr) {
      this.el.setAttribute(prop, this.attr[prop]);
    }

    this.element.classList.add(...this.className?.split(' ') ?? '');
  }

  get element() {
    return this.el;
  }

  template() {
    return '<div></div>';
  }

  activate() {
    this.active = true;
    this.element.classList.add('active');

    return this;
  }

  deactivate() {
    this.active = false;
    this.element.classList.remove('active');

    return this;
  }

  destroy() {
    let childrenLength = this.children.length;

    while (childrenLength > 0) {
      this.children[0].destroy();
      if (this.children.length === childrenLength) this.children.shift();
      childrenLength--;
    }

    this.parent?.removeChild(this);
    this.element?.remove();

    this.el = this.children = this.listeners = null;
    this.__destroyed = true;

    return null;
  }

  /**
   * Renders this.el node at a given position relative to the targetElement
   * @param {NodeElement} targetElement - reference element node to insert this.el
   * @param {stirng} [position=beforeend] oneOf[beforebegin, afterbegin, beforeend, afterend]
  */
  render(targetElement, position = 'beforeend') {
    targetElement.insertAdjacentElement(position, this.el);
    return this;
  }

  /**
   * @experimental
   * @return {String}
  */
  h(moduleName, options) {
    const uuid = Date.now();
    this.appendChild(new moduleName({ uuid, ...options }));
    return `<div id='${placeholderString(uuid)}'></div>`;
  }
}
