/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let arr = string.split('');
  let map = new Map();

  let prevItem = '';
  let groupId = -1;
  arr.forEach(function(item) {
    if (item !== prevItem) {
      groupId++;
      map.set(groupId, {key: item, value: 1});
      prevItem = item;
    } else {
      let currentIndex = map.get(groupId).value + 1;
      map.set(groupId, {key: item, value: currentIndex});
    }
  });

  let resultArr = [];
  for (let record of map.values()) {
    if (record.value > size)
    {
      record.value = size;
    }
    for (let i = 0; i <= record.value - 1; i++) {
      resultArr.push(record.key);
    }
  }

  return resultArr.join('');
}
