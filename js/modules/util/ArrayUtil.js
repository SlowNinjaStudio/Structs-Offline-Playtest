export class ArrayUtil {

  /**
   * @param {number[]} numericArray
   * @return {number}
   */
  sum(numericArray) {
    return numericArray.reduce((sum, value) => sum + value, 0);
  }

  /**
   * @param {number[]} numericArray
   * @return {number}
   */
  max(numericArray) {
    return numericArray.reduce((max, value) => Math.max(max, value), -Infinity);
  }

  /**
   * @param {number[]} numericArray
   * @return {number}
   */
  min(numericArray) {
    return numericArray.reduce((min, value) => Math.min(min, value), Infinity);
  }
}
