
export function createElementFromString(htmlString) {
  const el = document.createElement('div');
  el.insertAdjacentHTML('beforeend', htmlString);
  return el.firstElementChild;
}

export const placeholderString = (uuid) => `__${uuid}__`;

export function replaceTemplateWidgets(child) {
  this.element
    ?.querySelector(`#${placeholderString(child.uuid)}`)
    ?.replaceWith(child.element);
}

