export class AIStructAttackScoreDTO {
  /**
   * @param {Struct} struct
   * @param {number} score
   */
  constructor(struct, score) {
    this.struct = struct;
    this.score = score;
  }
}
