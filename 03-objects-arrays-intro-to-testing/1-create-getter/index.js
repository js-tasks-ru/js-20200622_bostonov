/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

  const properties = path.split('.');

  let innerGetter = function(obj) {
    let currentProperty = properties.shift();

    if (!properties.length) {
      return obj[currentProperty];
    } else {
      const { [currentProperty]: subObject } = obj;
      return subObject === undefined ? subObject : innerGetter(subObject);
    }
  };

  return innerGetter;
}
