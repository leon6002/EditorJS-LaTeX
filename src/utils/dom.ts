/**
 * Helper for making Elements with attributes
 * @param tagName           - new Element tag name
 * @param classNames  - list or name of CSS class
 * @param attributes        - any attributes
 * @returns
 */
export function make(
  tagName: string,
  classNames: string[] | string | null = null,
  attributes: { [key: string]: string | boolean } = {}
): HTMLElement {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames !== null) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      (el as unknown as { [key: string]: string | boolean })[attrName] =
        attributes[attrName];
    }
  }

  return el;
}

/**
 * Helper for making input Elements with attributes
 * @param classNames  - list or name of CSS class
 * @param attributes        - any attributes
 * @returns
 */
export function makeInputEl(
  classNames: string[] | string | null = null,
  attributes: { [key: string]: string | boolean } = {}
): HTMLInputElement {
  const el = document.createElement('input') as HTMLInputElement;

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames !== null) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    if (attributes.hasOwnProperty(attrName)) {
      if (attrName === 'disabled') {
        if (attributes[attrName]) {
          el.setAttribute(attrName, 'true');
        }
      } else {
        el.setAttribute(attrName, String(attributes[attrName]));
      }
    }
  }

  return el;
}
