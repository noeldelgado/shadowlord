/**
 * @see https://material.io/develop/web/components/input-controls/text-field/
*/
import { MDCTextField } from '@material/textfield';
import Widget from '/lib/widget/index';

export default class TextField extends Widget {

  static defaults = {
    useNativeValidation: true
  }

  input = null
  mdctextfield = null

  constructor(config) {
    super(config);

    this.input = this.el.querySelector('input');
    this.mdctextfield = new MDCTextField(this.el);
    this.mdctextfield.useNativeValidation = this.useNativeValidation;
  }

  get value()  {
    return this.mdctextfield.value;
  }

  set value(val) {
    this.mdctextfield.value = val;
  }

  setError(bool = true) {
    this.mdctextfield.valid = !bool;
    return this;
  }
}
