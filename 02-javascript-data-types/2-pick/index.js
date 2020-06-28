/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let elements = Object.entries(obj).filter((item, index, array) => fields.includes(item[0])).map(([key, value]) => [key, value]);
  return Object.fromEntries(elements);
};
