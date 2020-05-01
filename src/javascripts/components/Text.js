import Widget from '/lib/widget/index';

export default class Text extends Widget {

  template() {
    return '<p></p>';
  }

  setText(text) {
    this.el.textContent = text;

    return this;
  }
}
