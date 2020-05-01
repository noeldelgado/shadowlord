import SVGIcon from '../SVGIcon';

export default class FiberManualRecord extends SVGIcon {
  static defaults = {
    ...SVGIcon.defaults,
    content: `<path d='M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2Z' />`
  }
}
