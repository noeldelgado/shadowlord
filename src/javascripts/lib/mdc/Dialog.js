/**
 * @see https://material.io/develop/web/components/dialogs/
 */
import { MDCDialog } from '@material/dialog';
import Widget from '/lib/widget/index';

export default class Dialog extends Widget {

  static defaults = {
    title: ''
  }

  template() {
    return `
    <div class="mdc-dialog">
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content">
          <h2 class="mdc-dialog__title" id="my-dialog-title">${this.title}</h2>
          <div class="mdc-dialog__content" id="my-dialog-content"></div>
        </div>
      </div>
      <div class="mdc-dialog__scrim"></div>
    </div>`;
  }

  mdcdialog = null
  content = null

  constructor(config) {
    super(config);
    this.mdcdialog = new MDCDialog(this.el);
    this.content = this.el.querySelector('.mdc-dialog__content');
  }

  open() {
    this.mdcdialog.open();
    return this;
  }

  close() {
    this.mdcdialog.close();
    return this;
  }

  insertHTML(htmlString) {
    this.content.insertAdjacentHTML('beforeend', htmlString);
    return this;
  }
}
