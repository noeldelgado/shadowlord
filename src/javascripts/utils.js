const { random } = Math;
import Values from 'values.js';

/**
 * Checks if the String is a valid hex or rgb color model using
 * the helper methods provided by Values.js
 * @property isValidColorModel <private> [Function]
 * @argument color <required> [String]
 * @return true|false [Boolean]
 */
export const isValidColorModel = (color) => {
  try {
    new Values(color);
    return true;
  }
  catch(e) {
    return false;
  }
};

/**
 * Return a valid random hexadecimal color code.
 * @property getRandomHexColor <public> [Function]
 * @return #000000 [String]
 */
export const getRandomHexColor = () => `#${random().toString(16).slice(2, 8)}`;

export const $ = (selector, el) => (el || document).querySelector(selector);
export const $$ = (selector, el) => (el || document).querySelectorAll(selector);
