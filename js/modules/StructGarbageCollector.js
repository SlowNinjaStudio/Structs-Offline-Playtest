export class StructGarbageCollector {
  constructor(state) {
    this.state = state;
    this.garbageStructs = new Map();
  }

  cleanUpByPlayer(player) {
    player.fleet.forEachStruct(function(struct) {
      if (!struct.isDestroyed) {
        return;
      }
      if (this.garbageStructs.has(struct.id)) {
        const garbage = this.garbageStructs.get(struct.id);
        if (this.state.numTurns - garbage.destroyedAtTurn >= 2) {
          player.fleet.clearSlot(garbage.struct.operatingAmbit, garbage.struct.ambitSlot);
          this.garbageStructs.delete(struct.id);
        }
      } else {
        this.garbageStructs.set(struct.id, {struct: struct, destroyedAtTurn: this.state.numTurns});
      }
    }.bind(this));
  }

  cleanUp() {
    this.cleanUpByPlayer(this.state.player);
    this.cleanUpByPlayer(this.state.enemy);
  }
}
