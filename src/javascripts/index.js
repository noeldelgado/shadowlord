import App from '/app/index';
import { isValidColorModel, getRandomHexColor } from '/utils';

const hash = location.hash;
const color = isValidColorModel(hash) ? hash : getRandomHexColor();

self.Shadowlord = new App({
  color,
  percentage: 10
}).run();
