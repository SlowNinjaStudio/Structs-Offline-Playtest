export class IdGenerator {
  /**
   * @param {string} prefix
   * @return {string}
   */
  generate(prefix = '') {
    return `${prefix}${Date.now().toString(36) + Math.random().toString(36).substring(2)}`;
  }
}
