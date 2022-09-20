import {UIFleet} from "./UIFleet.js";
import {EVENTS, MANUAL_WEAPON_SLOTS} from "../../modules/Constants.js";
import {UIStructDetails} from "./UIStructDetails.js";
import {StructsGlobalDataStore} from "../../modules/util/StructsGlobalDataStore.js";
import {StructRef} from "../../modules/StructRef.js";
import {SlotRef} from "../../modules/SlotRef.js";
import {ActionActor} from "../../modules/ActionActor.js";
import {UIGameOverModal} from "./UIGameOverModal.js";
import {UICombatEventViewer} from "./UICombatEventViewer.js";

export class UIGame {

  /**
   * @param {string} elementId
   * @param {Player} player
   * @param {Player} enemy
   * @param {string} modalContainerId
   * @param {string} offcanvasId
   * @param {StructsGlobalDataStore} globalDataStore
   */
  constructor(
    player,
    enemy,
    elementId,
    modalContainerId,
    offcanvasId,
    globalDataStore = new StructsGlobalDataStore()
  ) {
    this.elementId = elementId
    this.player = player;
    this.enemy = enemy;
    this.players = [this.player, this.enemy];
    this.modalContainerId = modalContainerId;
    this.offcanvasId = offcanvasId;

    this.gameOverModal = new UIGameOverModal(this.modalContainerId, this.player, this.enemy);
    this.combatEventViewer = new UICombatEventViewer(this.offcanvasId, player, enemy);
    this.playerFleetUI = new UIFleet(this.player);
    this.enemyFleetUI = new UIFleet(this.enemy);
    globalDataStore.setGame(this);
  }

  initEmptyCommandSlotListeners() {
    document.querySelectorAll('.empty-slot.command').forEach(commandSlot => {
      commandSlot.addEventListener('click', function() {
        const playerId = commandSlot.getAttribute('data-player-id');
        const ambit = commandSlot.getAttribute('data-ambit');
        const ambitSlot = parseInt(commandSlot.getAttribute('data-ambit-slot'));
        const isCommandSlot = !!parseInt(commandSlot.getAttribute('data-is-command-slot'));
        const structsStore = new StructsGlobalDataStore();
        const action = structsStore.getStructAction();

        if (action && EVENTS.ACTIONS.ACTION_MOVE === action.getType()) {
          action.data = new SlotRef(playerId, ambit, ambitSlot, isCommandSlot);
          action.dispatchEvent();
          structsStore.clearStructAction();
        }
      })
    })
  }

  initStructListeners() {
    document.querySelectorAll('.struct-map-view-btn').forEach(structButton => {
      structButton.addEventListener('click', function() {
        const playerId = structButton.getAttribute('data-player-id');
        const structId = structButton.getAttribute('data-struct-id');
        const isCommandStruct = !!parseInt(structButton.getAttribute('data-is-command-struct'));
        const structsStore = new StructsGlobalDataStore();
        const action = structsStore.getStructAction();

        if (action && [
          EVENTS.ACTIONS.ACTION_ATTACK_PRIMARY,
          EVENTS.ACTIONS.ACTION_ATTACK_SECONDARY,
          EVENTS.ACTIONS.ACTION_DEFEND
        ].includes(action.getType())) {
          structsStore.clearStructAction();
          action.data = new StructRef(playerId, structId, isCommandStruct);
          action.dispatchEvent();
        } else {
          const game = structsStore.getGame();
          const player = game.players.find(player => player.id === playerId);
          const struct = isCommandStruct ? player.commandStruct : player.fleet.findStructById(structId);
          const domOffcanvas = document.getElementById('offcanvasBottom');
          const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('offcanvasBottom'));
          const offcanvasClass = (game.player.id === playerId) ? 'player' : 'enemy';

          domOffcanvas.classList.remove('player');
          domOffcanvas.classList.remove('enemy');
          domOffcanvas.classList.add(offcanvasClass);

          const uiStructDetails = new UIStructDetails(struct, player, 'offcanvasBottom');
          domOffcanvas.innerHTML = uiStructDetails.render();
          uiStructDetails.initListeners();

          const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
          popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl, {
              container: 'body',
              trigger: 'focus'
            });
          });

          bsOffcanvas.show();
        }
      });
    });
  }

  initListenersPerRender() {
    this.initEmptyCommandSlotListeners();
    this.initStructListeners();
  }

  initActionAttackPrimaryListener() {
    const game = this;
    window.addEventListener(EVENTS.ACTIONS.ACTION_ATTACK_PRIMARY, function (e) {
      const player = new ActionActor(e.detail.source, game.players);
      const enemy = new ActionActor(e.detail.data, game.players);
      const dataStore = new StructsGlobalDataStore();
      dataStore.clearStructAction();

      player.struct.attack(MANUAL_WEAPON_SLOTS.PRIMARY, enemy.struct);

      game.render();
    });
  }

  initActionAttackSecondaryListener() {
    const game = this;
    window.addEventListener(EVENTS.ACTIONS.ACTION_ATTACK_SECONDARY, function (e) {
      const player = new ActionActor(e.detail.source, game.players);
      const enemy = new ActionActor(e.detail.data, game.players);
      const dataStore = new StructsGlobalDataStore();
      dataStore.clearStructAction();

      player.struct.attack(MANUAL_WEAPON_SLOTS.SECONDARY, enemy.struct);

      game.render();
    });
  }

  initActionDefendListener() {
    const game = this;
    window.addEventListener(EVENTS.ACTIONS.ACTION_DEFEND, function (e) {
      const player = new ActionActor(e.detail.source, game.players);
      const target = new ActionActor(e.detail.data, game.players);
      const dataStore = new StructsGlobalDataStore();
      dataStore.clearStructAction();

      player.struct.defend(target.struct);

      game.render();
    });
  }

  initActionStealthModeListener() {
    const game = this;
    window.addEventListener(EVENTS.ACTIONS.ACTION_STEALTH_MODE, function (e) {
      const player = new ActionActor(e.detail.source, game.players);

      player.struct.defenseComponent.isActive = !player.struct.defenseComponent.isActive;

      game.render();
    });
  }

  initActionMoveListener() {
    const game = this;
    window.addEventListener(EVENTS.ACTIONS.ACTION_MOVE, function(e) {
      const player = new ActionActor(e.detail.source, game.players);
      const dataStore = new StructsGlobalDataStore();
      dataStore.clearStructAction();

      const slotRef = e.detail.data;
      if (player.struct.defenseComponent.canChangeAmbit(player.struct.operatingAmbit, slotRef.ambit)) {
        player.struct.operatingAmbit = slotRef.ambit;
      }

      game.render();
    });
  }

  initGameRenderListener() {
    const game = this;
    window.addEventListener(EVENTS.RENDER.RENDER_GAME, function() {
      game.render();
    });
  }

  initOneTimeListeners() {
    this.initGameRenderListener();

    this.initActionAttackPrimaryListener();
    this.initActionAttackSecondaryListener();
    this.initActionDefendListener();
    this.initActionStealthModeListener();
    this.initActionMoveListener();

    this.combatEventViewer.initOneTimeListeners();
  }

  render() {
    document.getElementById(this.elementId).innerHTML = `
      <div class="container-fluid play-area">
        <div class="row">

          <div id="playerFleet" class="col">${this.playerFleetUI.render(this.player)}</div>

          <div class="col-lg-2">
            <div class="vs">VS</div><div class="vertical-align-helper"></div>
          </div>

          <div id="enemyFleet" class="col">${this.enemyFleetUI.render(this.player)}</div>

        </div>
      </div>
    `;

    this.initListenersPerRender();

    this.gameOverModal.init();
  }
}
