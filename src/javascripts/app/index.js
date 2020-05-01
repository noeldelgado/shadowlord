/**
 * @listens Header -> colorchange
 * @listens Header -> percentagechange
*/
import Values from 'values.js';
import NodeSupport from '/lib/widget/NodeSupport';
import Header from '/components/Header';
import ColorsCollection from '/components/ColorsCollection';
import { $, isValidColorModel } from '/utils';

export default class App extends NodeSupport {

  static defaults = {
    color: '#6200ee',
    percentage: 3
  }

  header = null
  colorsCollection = null
  _hash = location.hash
  _values = new Values()

  constructor(config = {}) {
    super();
    Object.assign(this, this.constructor.defaults, config);
  }

  /**
   * Boot the app
   * @property run <public> [Function]
   * @return {Object} this
  */
  run() {
    this.appendChild(new Header({
      name: 'header',
      el: $('header'),
      color: this.color,
      percentage: this.percentage
    }));

    this.appendChild(new ColorsCollection({
      name: 'colorsCollection'
    })).render($('main'));

    this._bindEvents()._updateUI(this.color);

    return this;
  }

  /**
   * Define listeners and handlers
   * @private
   * @return {App}
  */
  _bindEvents() {
    this.header.bind('colorchange', ({color}) => this._updateUI(color));
    this.header.bind('percentagechange', ::this._percentchangeHandler);
    self.addEventListener('hashchange', ::this._hashChangeHandler);

    return this;
  }

  /**
   * Updates UI if hash has changed from last registered color value and is valid
   * @private
  */
  _hashChangeHandler() {
    const color = location.hash;

    if (this._hash === color) return;
    if (!isValidColorModel(color)) return;

    this.header.update(color);
    this._updateUI(color);
  }

  /**
   * Sets tints/shades factor and updates the UI
   * @private
  */
  _percentchangeHandler({ percentage }) {
    this.percentage = percentage;
    this._updateUI(this._values.hexString());
  }

  /**
   * Updates the UI using the the passed param color
   * @private
   * @param {String} [color=this.color] - A valid CSS color string
  */
  _updateUI(color = this.color) {
    const values = this._values.setColor(color).all(this.percentage);
    this._hash = location.hash = `#${this._values.hex}`;
    this.colorsCollection.update(values);
  }
}
