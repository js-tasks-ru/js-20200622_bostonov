/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let elements = Object.entries(obj).filter((item, index, array) => !fields.includes(item[0])).map(([key, value]) => [key, value]);
  return Object.fromEntries(elements);
  
};
