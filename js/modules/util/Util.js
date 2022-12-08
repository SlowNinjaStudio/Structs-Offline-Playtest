export class Util {
  /**
   * @param {string} text
   * @return {string}
   */
  titleCase(text) {
    let i = -1;
    let titleCaseText = '';
    for(let j = 0; j < text.length; j++) {
      if (i === -1 || text.charAt(i) === ' ') {
        titleCaseText += text.charAt(j).toUpperCase();
      } else {
        titleCaseText += text.charAt(j).toLowerCase();
      }
      i++;
    }
    return titleCaseText;
  }

  /**
   * @param {string[]} original
   * @return {string[]}
   */
  toLowerCaseArray(original) {
    return [...original].map(element => element.toLowerCase());
  }

  /**
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
