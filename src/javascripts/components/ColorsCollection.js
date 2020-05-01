import Widget from '/lib/widget/index';
import ColorItem from '/components/ColorItem';

export default class ColorsCollection extends Widget {

  static totalElements = 201

  template() {
    return `
    <div class='colors-collection'>
      ${Array(this.constructor.totalElements).fill('').map(() => this.h(ColorItem)).join('')}
    </div>
    `;
  }

  /**
   * @param values {Array[Values]}
  */
  update(values) {
    let i = 0, value, child;

    for (; i < this.constructor.totalElements; i++) {
      value = values[i];
      child = this.children[i];

      if (value) child.activate().update(value);
      else child.deactivate();
    }

    return this;
  }

}
