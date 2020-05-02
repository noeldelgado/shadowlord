import Widget from '/lib/widget/index';

export default class SVGIcon extends Widget {

  static defaults = {
    viewBox: '0 0 24 24',
    content: '',
    width: '100%',
    height: '100%'
  }

  template() {
    return `
    <svg viewBox='${this.viewBox}' width=${this.width} height=${this.height} aria-hidden='true'>
      ${this.content}
    </svg>
    `;
  }
}
