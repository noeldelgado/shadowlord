import { MDCRipple } from '@material/ripple';
import Widget from '/lib/widget/index';

export default class Button extends Widget {

  mdcripple = null

  constructor(config) {
    super(config);
    this.mdcripple = new MDCRipple(this.el);
  }
}
