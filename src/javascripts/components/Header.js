/**
 * @dispatch {Object} colorchange
 */
import Pickr from '@simonwep/pickr';
import Widget from '/lib/widget/index';
import { Button, IconButton, TextField } from '/lib/mdc/index';
import DialogInfo from '/components/DialogInfo';
import { $, getRandomHexColor, isValidColorModel } from '/utils';

export default class Header extends Widget {

  static defaults = {
    color: '#000',
    percentage: 20
  }

  pickr = null
  colorInput = null
  infoBtn = null
  rangeInput = null
  randomColorBtn = null
  dialog = null

  constructor(config) {
    super(config);

    this.pickr = Pickr.create({
      el: $('[data-btn-color-picker]', this.el),
      default: this.color,
      theme: 'nano',
      useAsButton: true,
      comparison: false,
      position: 'bottom-end',
      components: { hue: true }
    });

    this.appendChild(new TextField({
      name: 'colorInput',
      el: $('[data-color-input]', this.el),
      useNativeValidation: false
    }));

    this.appendChild(new IconButton({
      name: 'infoBtn',
      el: $('button[data-btn-info]', this.el)
    }));

    this.appendChild(new Button({
      name: 'colorPickerBtn',
      el: $('button[data-btn-color-picker]', this.el)
    }));

    this.appendChild(new TextField({
      name: 'rangeInput',
      el: $('[data-percent-input]', this.el)
    }));

    this.appendChild(new IconButton({
      name: 'randomColorBtn',
      el: $('button[data-btn-random]', this.el)
    }));

    this.appendChild(new DialogInfo({
      name: 'dialog',
      title: 'About'
    })).render(document.body);

    this.colorInput.value = this.color;
    this.rangeInput.value = this.percentage;

    this._bindEvents();
  }

  update(color) {
    this.color = color;
    this.pickr.setColor(color, true);
    this.colorInput.value = color;

    return this;
  }

  /**
   * @private
  */
  _bindEvents() {
    this.infoBtn.el.addEventListener('click', ::this.dialog.open);
    this.colorInput.input.addEventListener('keyup', ::this._keyupHandler);
    this.rangeInput.input.addEventListener('change', ::this._changeHandler);
    this.randomColorBtn.el.addEventListener('click', ::this._handleClickRandom);
    this.pickr.on('show', (instance) => instance.getRoot().palette.palette.focus());
    this.pickr.on('hide', (instance) => instance.getRoot().button.focus());
    this.pickr.on('changestop', ::this._handlePickrChangeStop);

    return this;
  }

  /**
   * @private
  */
  _keyupHandler({ target, key }) {
    const color = target.value;

    if (key !== 'Enter') return;
    if (isValidColorModel(color) === false) return this.colorInput.setError(true);

    this.pickr.setColor(color, true);
    this.colorInput.setError(false);
    this.dispatch('colorchange', { color });
  }

  /**
   * @private
  */
  _changeHandler({ target }) {
    if (!target.validity.valid) return;

    this.rangeInput.setError(false);
    this.dispatch('percentagechange', { percentage: target.value |> Number });
  }

  /**
   * @private
  */
  _handleClickRandom() {
    const color = getRandomHexColor();

    this.pickr.setColor(color, true);
    this.colorInput.value = color;

    this.dispatch('colorchange', { color });
  }

  /**
   * @private
  */
  _handlePickrChangeStop(ev) {
    const color = ev.getColor().toHEXA().toString();

    this.colorInput.setError(false).value = color;
    this.dispatch('colorchange', { color });
  }
}
