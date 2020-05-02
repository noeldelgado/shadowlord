import { MDCRipple } from '@material/ripple';
import Widget from '/lib/widget/index';

export default class IconButton extends Widget {

  static defaults = {
    icon: null,
    label: '',
    ripple: true
  };

  template() {
    return `
    <button class='mdc-icon-button' type="button" aria-label='${this.label}'>
      ${this.h(this.icon, { className: 'mdc-icon-button__icon', attr: { 'aria-hidden': true } })}
    </button>
    `;
    }

  mdcripple = null

  constructor(config) {
    super(config);

    if (this.ripple) {
      this.mdcripple = new MDCRipple(this.el).unbounded = true;
    }
  }
}
