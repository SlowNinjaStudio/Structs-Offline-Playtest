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
}
