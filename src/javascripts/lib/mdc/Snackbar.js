/**
 * @see https://material.io/develop/web/components/snackbars/
*/
import { MDCSnackbar } from '@material/snackbar';
import Widget from '/lib/widget/index';
import IconButton from './IconButton';
import { Close } from './icons/index';

export default class Snackbar extends Widget {

  static defaults = {
    timeoutMs: 5000,
    labelText: '',
    leading: false
  }

  template() {
    return `
    <div class="mdc-snackbar">
      <div class="mdc-snackbar__surface">
        <div class="mdc-snackbar__label" role="status" aria-live="polite">${this.labelText}</div>
        <div class="mdc-snackbar__actions">
          ${this.h(IconButton, { icon: Close, className: 'mdc-snackbar__dismiss', attr: { title: 'Dismiss'}, ripple: false })}
        </div>
      </div>
    </div>`;
  }

  mdcsnackbar = null

  constructor(config) {
    super(config);

    this.mdcsnackbar = new MDCSnackbar(this.el);
    this.mdcsnackbar.timeoutMs = this.timeoutMs;

    if (this.leading) this.el.classList.add('mdc-snackbar--leading');

    this.mdcsnackbar.listen('MDCSnackbar:closed', ::this.destroy);
  }

  open() {
    this.mdcsnackbar.open();
    return this;
  }

  close() {
    this.mdcsnackbar.close();
    return this;
  }

  destroy() {
    super.destroy();
    this.mdcsnackbar.unlisten('MDCSnackbar:closed', ::this.destroy);
    this.mdcsnackbar = null;
  }
}
