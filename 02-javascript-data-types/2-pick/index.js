/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let elements = Object.entries(obj);
  elements = elements.filter(([key]) => fields.includes(key));

  let resultObject = Object.fromEntries(elements);
  return resultObject;
};
