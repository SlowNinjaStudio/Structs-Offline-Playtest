export class StructsGlobalDataStore {
  constructor() {
    window.structsStore = window.structsStore || {};
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  #set(key, value) {
    window.structsStore[key] = value;
  }

  /**
   * @param {string} key
   * @return {*}
   */
  #get(key) {
    return window.structsStore[key];
  }

  /**
   * @param {UIGame} game
   */
  setGame(game) {
    this.#set('game', game);
  }

  /**
   * @return {UIGame}
   */
  getGame() {
    return this.#get('game');
  }

  /**
   * @param {StructAction} action
   */
  setStructAction(action) {
    this.#set('structAction', action);
  }

  /**
   * @return {StructAction}
   */
  getStructAction() {
    return this.#get('structAction');
  }

  clearStructAction() {
    this.#set('structAction', null);
  }
}
