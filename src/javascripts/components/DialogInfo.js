import { Dialog } from '/lib/mdc/index';

const internals = {
  link(href, content) {
    return `
    <a href=${href} target="_blank" rel="noopener noreferrer">${content}</a>`;
  }
};

export default class DialogInfo extends Dialog {

  get html() {
    return `
    <p>Color tints and shades generator tool.</p>
    <ul>
      <li>Color input accepts <b>hex</b>, <b>rgb/a</b> and <b>hsl/a</b> CSS color strings.</li>
      <li>The accepted percent factor range goes from 1 to 100. The math is <code>round(100 / &lt;percent&gt;)</code>, so:
        <ul>
          <li>1 will produce 100 tints and 100 shades</li>
          <li>2 will produce 50 tints and 50 shades</li>
          <li>and so on...</li>
        </ul>
      </li>
    </ul>
    <p>${internals.link('https://github.com/noeldelgado/shadowlord', '<span>View source on GitHub</span>')}</p>
    <h3>Credits</h3>
    <ul>
      <li>${internals.link('https://github.com/noeldelgado/values.js', 'values.js')} — JS library to get the tints and shades.</li>
      <li>Material Design Components & Icons by ${internals.link('https://twitter.com/Google', '@Google')}.</li>
      <li>“Percent” icon by Austin Andrews ${internals.link('https://twitter.com/templarian', '@templarian')}</a>
    </li>
  </ul>
  <p>MIT © ${internals.link('https://github.com/noeldelgado', 'Noel Delgado')}</p>
    `;
  }

  constructor(config) {
    super(config);
    this.insertHTML(this.html);
  }
}
