import { Dialog } from '/lib/mdc/index';
import { Launch } from '/lib/mdc/icons/index';

export default class DialogInfo extends Dialog {

  static ELEMENT_CLASS = 'dialog_info'

  content() {
    return `
    <p>Color tints and shades generator tool.</p>
    <ul>
      <li>Accepted Color input:
        <ul>
          <li>#RGB, #RRGGBB, #RGBA #RRGGBBAA</li>
          <li>RGB/A, HSL/A</li>
          <li>Pre-defined ${this._link('https://www.w3.org/wiki/CSS/Properties/color/keywords', 'color keywords')}</p>
        </ul>
      </li>
      <li>The accepted percent balance point goes from 1 to 100. The math is <code>round(100 / &lt;percent&gt;)</code>, so:
        <ul>
          <li>1 will produce 100 tints and 100 shades</li>
          <li>2 will produce 50 tints and 50 shades</li>
          <li>and so on...</li>
        </ul>
      </li>
    </ul>
    <p>${this._link('https://github.com/noeldelgado/shadowlord', '<span>View source on GitHub</span>')}</p>
    <h3>Credits</h3>
    <ul>
      <li>${this._link('https://github.com/noeldelgado/values.js', 'values.js')} — JS library to get the tints and shades.</li>
      <li>Material Design Components & Icons by ${this._link('https://twitter.com/Google', '@Google')}.</li>
      <li>“Percent” icon by Austin Andrews ${this._link('https://twitter.com/templarian', '@templarian')}</li>
    </ul>
    <p>MIT © ${this._link('https://pixelia.me', 'Noel Delgado')}</p>
    `;
  }

  _link(href, content) {
    return `
    <a href=${href} target="_blank" rel="noopener noreferrer" aria-label='(will open in a new window)'><!--
      -->${content}<!--
      -->${this.h(Launch, { width: 16, height: 16 })}<!--
   --></a>`;
  }
}
