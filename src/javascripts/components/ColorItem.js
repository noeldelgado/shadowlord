import Copy from 'copy-text-to-clipboard';
import Widget from '/lib/widget/index';
import { IconButton, Snackbar } from '/lib/mdc/index';
import { FiberManualRecord, FileCopy, RadioButtonUnchecked } from '/lib/mdc/icons/index';
import Text from '/components/Text';

export default class ColorItem extends Widget {

  static CLASSNAMES = {
    BASE: '-is-base-color',
    TINT: '-is-tint',
    SHADE: '-is-shade',
    LIGHT: '-is-light',
    DARK: '-is-dark'
  }

  template() {
    return `
    <div class='color-item'>
      <div>
        <div class='item_percent flex items-center'>
          ${this.h(FiberManualRecord, { className: 'icon-shade', width: 12, height: 12 })}
          ${this.h(RadioButtonUnchecked, { className: 'icon-tint', width: 12, height: 12 })}
          ${this.h(Text, { name: 'ariaLabelPercentage', className: 'sr-only', attr: { style: 'margin: 0' } })}
          ${this.h(Text, { name: 'percentageLabel', className: 'percentage--label' })}
        </div>
        ${this.h(Text, { name: 'hexLabel', className: 'hex--label' })}
      </div>
      <div class='color-item__copy-btn'>
        ${this.h(IconButton, { name: 'copyButton', icon: FileCopy, label: 'copy' })}
      </div>
    </div>
  `;
  }

  color = null

  constructor(config) {
    super(config);
    this.copyButton.el.addEventListener('click', ::this._copyClickHandler);
  }

  /**
   * @private
  */
  _copyClickHandler() {
    if (Copy(this.color) === false) return;

    this.appendChild(new Snackbar({
      labelText: `“${this.color}” copied to clipboard`
    })).render(document.body).open();
  }

  /**
   * @param {Value} value - values.js instance
  */
  update(value) {
    const { TINT, SHADE, BASE, LIGHT, DARK } = this.constructor.CLASSNAMES;
    const { isTint, isShade, isBaseColor } = value;

    this.color = value.hexString();

    this.ariaLabelPercentage.setText([
      isTint && 'tint',
      isShade && 'shade',
      isBaseColor && 'base color'
    ].filter(v => v));
    this.percentageLabel.setText(`${value.percentage?.toFixed(2) ?? 0 |> Number}%`);
    this.hexLabel.setText(this.color);
    this.element.style.backgroundColor = this.color;

    this.element.classList.remove(...Object.values(this.constructor.CLASSNAMES));
    this.element.classList.add(...[
      isTint && TINT,
      isShade && SHADE,
      isBaseColor && BASE,
      value.getBrightness() > 50 ? LIGHT : DARK
    ].filter(v => v));

    return this;
  }

  /**
   * @override
  */
  activate() {
    if (this.el.parentElement) return this;

    this.render(this.parent.el);
    return this;
  }

  /**
   * @override
  */
  deactivate() {
    if (!this.el.parentElement) return this;

    this.el.remove();
    return this;
  }
}
