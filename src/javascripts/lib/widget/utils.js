export const placeholderString = (uuid) => `__${uuid}__`;

export function createElementFromString(htmlString) {
  const el = document.createElement('div');
  el.insertAdjacentHTML('beforeend', htmlString);
  return el.firstElementChild;
}

export function replaceTemplateWidgets(child) {
  if (this.el.id === placeholderString(child.uuid)) {
    this.el = child.el;
    return;
  }

  this.element
    ?.querySelector(`#${placeholderString(child.uuid)}`)
    ?.replaceWith(child.element);
}

