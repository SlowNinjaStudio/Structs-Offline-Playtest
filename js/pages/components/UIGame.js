import {UIFleet} from "./UIFleet.js";
import {EVENTS, MANUAL_WEAPON_SLOTS} from "../../modules/Constants.js";
import {UIStructDetails} from "./UIStructDetails.js";
import {StructRef} from "../../modules/StructRef.js";
import {SlotRef} from "../../modules/SlotRef.js";
import {ActionActor} from "../../modules/ActionActor.js";
import {UIGameOverModal} from "./UIGameOverModal.js";
import {UICombatEventViewer} from "./UICombatEventViewer.js";
import {UIPrepareDefenses} from "./UIPrepareDefenses.js";
import {UIGameStartModal} from "./UIGameStartModal.js";
import {Analytics} from "../../modules/Analytics.js";

export class UIGame {

  /**
   * @param {GameState} state
   */
  constructor(state) {
    this.state = state;
    this.gameStartModal = new UIGameStartModal(this.state);
    this.gameOverModal = new UIGameOverModal(this.state);
    this.combatEventViewer = new UICombatEventViewer(this.state);
    this.playerFleetUI = new UIFleet(this.state, this.state.player);
    this.enemyFleetUI = new UIFleet(this.state, this.state.enemy);
    this.prepareDefensesUI = new UIPrepareDefenses(this.state);
    this.analytics = new Analytics(this.state);
  }

  initEmptyCommandSlotListeners() {
    document.querySelectorAll('.empty-slot.command').forEach(commandSlot => {
      commandSlot.addEventListener('click', function() {
        const playerId = commandSlot.getAttribute('data-player-id');
        const ambit = commandSlot.getAttribute('data-ambit');
        const ambitSlot = parseInt(commandSlot.getAttribute('data-ambit-slot'));
        const isCommandSlot = !!parseInt(commandSlot.getAttribute('data-is-command-slot'));
        const action = this.state.action;

        if (action && EVENTS.ACTIONS.ACTION_MOVE === action.getType()) {
          action.data = new SlotRef(playerId, ambit, ambitSlot, isCommandSlot);
          action.dispatchEvent();
          this.state.action = null;
        }
      }.bind(this))
    })
  }

  initStructListeners() {
    document.querySelectorAll('.struct-map-view-btn').forEach(structButton => {
      structButton.addEventListener('click', function() {
        const playerId = structButton.getAttribute('data-player-id');
        const structId = structButton.getAttribute('data-struct-id');
        const isCommandStruct = !!parseInt(structButton.getAttribute('data-is-command-struct'));
        const action = this.state.action;

        if (action && [
          EVENTS.ACTIONS.ACTION_ATTACK_PRIMARY,
          EVENTS.ACTIONS.ACTION_ATTACK_SECONDARY,
          EVENTS.ACTIONS.ACTION_DEFEND
        ].includes(action.getType())) {
          this.state.action = null;
          action.data = new StructRef(playerId, structId, isCommandStruct);
          action.dispatchEvent();
        } else {
          const player = (this.state.getPlayers()).find(player => player.id === playerId);
          const struct = isCommandStruct ? player.commandStruct : player.fleet.findStructById(structId);
          const domOffcanvas = document.getElementById('offcanvasBottom');
          const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(domOffcanvas);
          const offcanvasClass = (this.state.player.id === playerId) ? 'player' : 'enemy';

          domOffcanvas.classList.remove('player');
          domOffcanvas.classList.remove('enemy');
          domOffcanvas.classList.add(offcanvasClass);

          const uiStructDetails = new UIStructDetails(this.state, struct, player, this.state.offcanvasId);
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
      }.bind(this));
    });
  }

  initListenersPerRender() {
    this.initEmptyCommandSlotListeners();
    this.initStructListeners();
    this.prepareDefensesUI.initEndTurnListener();
  }

  initActionAttackPrimaryListener() {
    window.addEventListener(EVENTS.ACTIONS.ACTION_ATTACK_PRIMARY, function (e) {
      const player = new ActionActor(e.detail.source, this.state.getPlayers());
      const enemy = new ActionActor(e.detail.data, this.state.getPlayers());

      this.state.action = null;

      this.state.metrics[player.player.name.toLowerCase()].incrementPrimaryAttacks();

      player.struct.attack(MANUAL_WEAPON_SLOTS.PRIMARY, enemy.struct);

      this.render();
    }.bind(this));
  }

  initActionAttackSecondaryListener() {
    window.addEventListener(EVENTS.ACTIONS.ACTION_ATTACK_SECONDARY, function (e) {
      const player = new ActionActor(e.detail.source, this.state.getPlayers());
      const enemy = new ActionActor(e.detail.data, this.state.getPlayers());

      this.state.action = null;

      this.state.metrics[player.player.name.toLowerCase()].incrementSecondaryAttacks();

      player.struct.attack(MANUAL_WEAPON_SLOTS.SECONDARY, enemy.struct);

      this.render();
    }.bind(this));
  }

  initActionDefendListener() {
    window.addEventListener(EVENTS.ACTIONS.ACTION_DEFEND, function (e) {
      const player = new ActionActor(e.detail.source, this.state.getPlayers());
      const target = new ActionActor(e.detail.data, this.state.getPlayers());

      this.state.action = null;

      this.state.metrics[player.player.name.toLowerCase()].incrementDefends();

      player.struct.defend(target.struct);

      this.render();
    }.bind(this));
  }

  initActionStealthModeListener() {
    window.addEventListener(EVENTS.ACTIONS.ACTION_STEALTH_MODE, function (e) {
      const player = new ActionActor(e.detail.source, this.state.getPlayers());

      this.state.metrics[player.player.name.toLowerCase()].incrementStealthUses();

      player.struct.defenseComponent.isActive = !player.struct.defenseComponent.isActive;

      this.render();
    }.bind(this));
  }

  initActionMoveListener() {
    window.addEventListener(EVENTS.ACTIONS.ACTION_MOVE, function(e) {
      const player = new ActionActor(e.detail.source, this.state.getPlayers());

      this.state.action = null;

      this.state.metrics[player.player.name.toLowerCase()].incrementStructsMoved();

      const slotRef = e.detail.data;
      if (player.struct.defenseComponent.canChangeAmbit(player.struct.operatingAmbit, slotRef.ambit)) {
        player.struct.operatingAmbit = slotRef.ambit;
      }

      this.render();
    }.bind(this));
  }

  initGameRenderListener() {
    window.addEventListener(EVENTS.RENDER.RENDER_GAME, function() {
      this.render();
    }.bind(this));
  }

  initFirstTurnListener() {
    window.addEventListener(EVENTS.TURNS.FIRST_TURN, function() {
      this.analytics.trackGameStart();
      this.state.numTurns = 1;
      this.render();
    }.bind(this));
  }

  initEndTurnListener() {
    window.addEventListener(EVENTS.TURNS.END_TURN, function() {
      this.state.turn = this.state.turn.id === this.state.player.id ? this.state.enemy : this.state.player;
      this.state.numTurns++;
      if (this.state.numTurns === 3) {
        this.analytics.trackDefensePhaseEnd();
      }
      this.render();
    }.bind(this));
  }

  /**
   * @param {CombatEvent} e
   */
  trackDamage(e) {
    const sourcePlayer = this.state.findPlayerById(e.sourceStruct.playerId);
    const targetPlayer = this.state.findPlayerById(e.targetStruct.playerId);
    const sourceMetric = sourcePlayer.name.toLowerCase();
    const targetMetric = targetPlayer.name.toLowerCase();

    this.state.metrics[sourceMetric].incrementDamageGiven(e.damageAmount);
    this.state.metrics[targetMetric].incrementDamageTaken(e.damageAmount);

    if (e.targetStructNewHealth <= 0) {
      this.state.metrics[sourceMetric].incrementKills(e.damageAmount);
      this.state.metrics[targetMetric].incrementStructsLost(e.damageAmount);
    }
  }

  initCombatAttackedListener() {
    window.addEventListener(EVENTS.COMBAT.COMBAT_ATTACKED, this.trackDamage.bind(this));
  }

  initCombatCounterAttackedListener() {
    window.addEventListener(EVENTS.COMBAT.COMBAT_COUNTER_ATTACKED, this.trackDamage.bind(this));
  }

  initCombatCounterAttackedOnDeathListener() {
    window.addEventListener(EVENTS.COMBAT.COMBAT_COUNTER_ATTACKED_ON_DEATH, this.trackDamage.bind(this));
  }

  initCombatDefenderBlockedListener() {
    window.addEventListener(EVENTS.COMBAT.COMBAT_DEFENDER_BLOCKED, function(e) {
      const defender = this.state.findPlayerById(e.sourceStruct.playerId);
      const attacker = this.state.findPlayerById(e.targetStruct.playerId);
      const defenderMetric = defender.name.toLowerCase();
      const attackerMetric = attacker.name.toLowerCase();

      this.state.metrics[defenderMetric].incrementDamageTaken(e.damageAmount);
      this.state.metrics[attackerMetric].incrementDamageGiven(e.damageAmount);

      if (e.targetStructNewHealth <= 0) {
        this.state.metrics[defenderMetric].incrementStructsLost(e.damageAmount);
        this.state.metrics[attackerMetric].incrementKills(e.damageAmount);
      }
    })
  }

  initCombatDefenderCounteredListener() {
    window.addEventListener(EVENTS.COMBAT.COMBAT_DEFENDER_COUNTERED, this.trackDamage.bind(this));
  }

  initGameOverListener() {
    window.addEventListener(EVENTS.GAME_OVER, function() {
      const winner = (this.state.player.isDefeated()) ? this.state.enemy : this.state.player;
      this.analytics.trackGameOver(winner);
    }.bind(this));
  }

  initOneTimeListeners() {
    this.initGameRenderListener();
    this.initFirstTurnListener();
    this.initEndTurnListener();

    this.initActionAttackPrimaryListener();
    this.initActionAttackSecondaryListener();
    this.initActionDefendListener();
    this.initActionStealthModeListener();
    this.initActionMoveListener();

    this.initCombatAttackedListener();
    this.initCombatCounterAttackedListener();
    this.initCombatCounterAttackedOnDeathListener();
    this.initCombatDefenderBlockedListener();
    this.initCombatDefenderCounteredListener();

    this.initGameOverListener();

    this.combatEventViewer.initOneTimeListeners();
  }

  render() {
    console.log(this.state);
    document.getElementById(this.state.gameContainerId).innerHTML = `
      <div class="container-fluid play-area">
        <div class="row">
          <div class="col align-content-center">${this.prepareDefensesUI.render()}</div>
        </div>
        <div class="row">

          <div id="playerFleet" class="col">${this.playerFleetUI.render(this.state.player)}</div>

          <div class="col-lg-2">
            <div class="vs">VS</div><div class="vertical-align-helper"></div>
          </div>

          <div id="enemyFleet" class="col">${this.enemyFleetUI.render(this.state.player)}</div>

        </div>
      </div>
    `;

    this.initListenersPerRender();

    this.gameStartModal.init();
    this.gameOverModal.init();
  }
}
