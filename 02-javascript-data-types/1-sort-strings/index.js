/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  console.log(arr);
  console.log(param);

  let sorter1 = function (a, b) {
      let x = a.toLowerCase();
      let y = b.toLowerCase();
      x = x.replace('ё', 'е');
      y = y.replace('ё', 'е');

      if (x > y) {
          return 1;
      }
      if (y > x) {
          return -1;
      }

      a.codePointAt(0) > b.codePointAt(0)
      {
        return -1
      }

      return 0;
    };

  switch (param) {
    case 'asc':
      arr.sort(sorter1);
      break;
    case 'desc':
        arr.sort(sorter1);
        arr.reverse();
        break;
    default:
  }

  return arr.slice();
}
