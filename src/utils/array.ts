
export function randomChoose<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function chunks<T>(array: T[], criteria: (item: T) => number): T[][] {
  const chunksArr: T[][] = [];

  if (array.length === 0) {
    return [];
  }
  if (array.length === 1) {
    return [array];
  }

  let currentChunk: T[] = [array[0]];
  let currentGroup = criteria(array[0]);

  for (let i=1; i<array.length; i++) {
    const item = array[i];
    const group = criteria(item);
    if (currentGroup === group) {
      currentChunk.push(item);
      currentGroup = group;
    } else {
      chunksArr.push(currentChunk);
      currentChunk = [item];
      currentGroup = group;
    }
  }

  chunksArr.push(currentChunk);

  return chunksArr;
}

/**
 * 
 * @param arr: [[1,2,3],[4,5,6],[7,8,9]];
 * @param separator: 'a'
 * @returns [1, 2, 3, "a", 4, 5, 6, "a", 7, 8, 9]
 */
export function interlace<T,S>(arr: T[][], separator: S): Array<T|S> {
  const result: Array<T|S> = [];
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      result.push(arr[i][j]);
    }
    if (i !== arr.length - 1) {
      result.push(separator);
    }
  }
  
  return result;
}
