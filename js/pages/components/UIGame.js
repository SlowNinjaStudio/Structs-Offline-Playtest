import {UIFleet} from "./UIFleet.js";
import {
  EVENTS,
  GAME_MODES,
  GAME_PHASES,
  IMG,
  MANUAL_WEAPON_SLOTS,
  QUALITATIVE_BUDGETS
} from "../../modules/Constants.js";
import {UIStructDetails} from "./UIStructDetails.js";
import {StructRefDTO} from "../../modules/dtos/StructRefDTO.js";
import {SlotRefDTO} from "../../modules/dtos/SlotRefDTO.js";
import {ActionActor} from "../../modules/ActionActor.js";
import {UIGameOverModal} from "./UIGameOverModal.js";
import {UICombatEventViewer} from "./UICombatEventViewer.js";
import {UIPrepareDefenses} from "./UIPrepareDefenses.js";
import {UIGameStartModal} from "./UIGameStartModal.js";
import {Analytics} from "../../modules/Analytics.js";
import {AI} from "../../modules/AI.js";
import {UICancelAction} from "./UICancelAction.js";
import {CombatEventLogItem} from "../../modules/CombatEventLogItem.js";
import {FleetGenerator} from "../../modules/FleetGenerator.js";
import {UIStructSelection} from "./UIStructSelection.js";
import {PowerManager} from "../../modules/PowerManager.js";
import {StructGarbageCollector} from "../../modules/StructGarbageCollector.js";

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
    this.ai = new AI(this.state);
    this.cancelActionButton = new UICancelAction(this.state);
    this.fleetGenerator = new FleetGenerator();
    this.fleetGenerateButtonId = 'fleetGenerateButtonId';
    this.fleetResetButtonId = 'fleetResetButtonId';
    this.fleetSetupCompleteButtonId = 'fleetSetupCompleteButtonId';
    this.powerManager = new PowerManager(this.state);
    this.structGarbageCollector = new StructGarbageCollector(this.state);
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
          action.data = new SlotRefDTO(playerId, ambit, ambitSlot, isCommandSlot);
          action.dispatchEvent();
          this.state.action = null;
        }
      }.bind(this))
    })
  }

  initStructListeners() {
    if (this.state.gamePhase !== GAME_PHASES.COMBAT) {
      return;
    }
    document.querySelectorAll('.struct-map-view-btn').forEach(structButton => {
      structButton.addEventListener('click', function() {
        const playerId = structButton.getAttribute('data-player-id');
        const structId = structButton.getAttribute('data-struct-id');
        const isCommandStruct = !!parseInt(structButton.getAttribute('data-is-command-struct'));
        const isPlanetarySlot = !!parseInt(structButton.getAttribute('data-is-planetary-slot'));
        const action = this.state.action;

        if (action && [
          EVENTS.ACTIONS.ACTION_ATTACK_PRIMARY,
          EVENTS.ACTIONS.ACTION_ATTACK_SECONDARY,
          EVENTS.ACTIONS.ACTION_DEFEND
        ].includes(action.getType())) {
          this.state.action = null;
          action.data = new StructRefDTO(playerId, structId, isCommandStruct, isPlanetarySlot);
          action.dispatchEvent();
        } else {
          const player = (this.state.getPlayers()).find(player => player.id === playerId);
          const struct = player.getStruct(structId, isCommandStruct, isPlanetarySlot);
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

  /**
   * @param {Element} slotButton
   * @return {function}
   */
  fleetSelectionListener(slotButton) {
    return function() {
      const playerId = slotButton.getAttribute('data-player-id');
      const ambit = slotButton.getAttribute('data-ambit');
      const ambitSlot = parseInt(slotButton.getAttribute('data-ambit-slot'));
      const structId = slotButton.getAttribute('data-struct-id');
      const isCommandStruct = !!parseInt(slotButton.getAttribute('data-is-command-struct'));
      const isPlanetarySlot = !!parseInt(slotButton.getAttribute('data-is-planetary-slot'));

      const player = (this.state.getPlayers()).find(player => player.id === playerId);
      let struct = player.getStruct(structId, isCommandStruct, isPlanetarySlot);

      const domOffcanvas = document.getElementById(this.state.offcanvasId);
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(domOffcanvas);
      const offcanvasClass = (this.state.player.id === playerId) ? 'player' : 'enemy';

      domOffcanvas.classList.remove('player');
      domOffcanvas.classList.remove('enemy');
      domOffcanvas.classList.add(offcanvasClass);

      const uiStructSelection = new UIStructSelection(
        this.state,
        player,
        ambit,
        ambitSlot,
        struct,
        isPlanetarySlot
      );
      uiStructSelection.render();

      bsOffcanvas.show();
    }
  }

  initFleetSelectionListeners() {
    if ([GAME_PHASES.FLEET_SELECT_P1, GAME_PHASES.FLEET_SELECT_P2].includes(this.state.gamePhase)) {
      document.querySelectorAll('.map-slot-btn').forEach(slotButton => {
        slotButton.addEventListener('click', this.fleetSelectionListener(slotButton).bind(this));
      });
    } else if (this.state.gamePhase === GAME_PHASES.COMBAT) {
      const fleetElmId = this.state.turn.id === this.state.player.id ? '#playerFleet' : '#enemyFleet';
      document.querySelectorAll(`${fleetElmId} .map-slot-btn.empty-slot.fleet`).forEach(slotButton => {
        slotButton.addEventListener('click', this.fleetSelectionListener(slotButton).bind(this));
      });
    }
  }

  initFleetGenerateListener() {
    const button = document.getElementById(this.fleetGenerateButtonId);
    if (button) {
      button.addEventListener('click', function () {
        if (this.state.turn.creditManager.qualitativeBudget === 'RANDOM') {
          this.state.turn.creditManager.initFromQualitativeBudget();
          const turnPlayer = this.state.turn.id === this.state.player.id ? 'player' : 'enemy'
          this.state.metrics[turnPlayer].initialWatt = this.state.player.creditManager.credits;
        }
        if (this.state.turn.creditManager.qualitativeBudget === 'CURATED') {
          this.fleetGenerator.generateCuratedFleet(this.state.turn.fleet);
          this.state.turn.creditManager.pay(QUALITATIVE_BUDGETS.CURATED.MAX);
        } else {
          this.state.turn.fleet.reset();
          this.state.turn.creditManager.credits = this.state.turn.creditManager.budget - this.fleetGenerator.generateFleet(
            this.state.turn.fleet,
            this.state.turn.creditManager.budget
          );
        }

        this.render();
      }.bind(this))
    }
  }

  initFleetResetListener() {
    const button = document.getElementById(this.fleetResetButtonId);
    if (button) {
      button.addEventListener('click', function () {
        this.state.turn.fleet.reset();
        this.state.turn.creditManager.credits = this.state.turn.creditManager.budget;
        this.render();
      }.bind(this))
    }
  }

  initFleetSetupCompleteListener() {
    const button = document.getElementById(this.fleetSetupCompleteButtonId);
    if (button) {
      button.addEventListener('click', function () {
        if (this.state.gamePhase === GAME_PHASES.FLEET_SELECT_P1 && this.state.gameMode === GAME_MODES.ONE_PLAYER) {
          this.state.enemy.fleet.reset();
          this.state.enemy.creditManager.credits = this.state.enemy.creditManager.budget - this.fleetGenerator.generateFleet(
            this.state.enemy.fleet,
            this.state.enemy.creditManager.budget
          );
          this.state.gamePhase = GAME_PHASES.COMBAT;
          this.state.metrics.unitsBuilt.logAllPlayerStructs(this.state.player, this.state.numTurns);
          this.state.metrics.unitsBuilt.logAllPlayerStructs(this.state.enemy, this.state.numTurns);
          this.state.metrics.player.setInitialStructCount(this.state.player.getStructCount());
          this.state.metrics.enemy.setInitialStructCount(this.state.enemy.getStructCount());
          window.dispatchEvent(new CustomEvent(EVENTS.TURNS.FIRST_TURN));
        } else if (this.state.gamePhase === GAME_PHASES.FLEET_SELECT_P1 && this.state.gameMode === GAME_MODES.TWO_PLAYER) {
          this.state.gamePhase = GAME_PHASES.FLEET_SELECT_P2;
          this.state.turn = this.state.enemy;
          this.state.metrics.unitsBuilt.logAllPlayerStructs(this.state.player, this.state.numTurns);
          this.state.metrics.player.setInitialStructCount(this.state.player.getStructCount());
          this.render();
        } else if (this.state.gamePhase === GAME_PHASES.FLEET_SELECT_P2) {
          this.state.gamePhase = GAME_PHASES.COMBAT;
          this.state.turn = this.state.player;
          this.state.metrics.unitsBuilt.logAllPlayerStructs(this.state.enemy, this.state.numTurns);
          this.state.metrics.enemy.setInitialStructCount(this.state.enemy.getStructCount());
          window.dispatchEvent(new CustomEvent(EVENTS.TURNS.FIRST_TURN));
        }
      }.bind(this))
    }
  }

  initListenersPerRender() {
    this.initEmptyCommandSlotListeners();
    this.initStructListeners();
    this.initFleetSelectionListeners();
    this.initFleetGenerateListener();
    this.initFleetResetListener();
    this.initFleetSetupCompleteListener();
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
      this.powerManager.managePowerPerRound();
      this.structGarbageCollector.cleanUp();
      this.render();

      if (this.state.gameMode === GAME_MODES.ONE_PLAYER && this.state.turn.id === this.state.enemy.id) {
        this.ai.executeTurn();
      }
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
    }.bind(this));
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

  initBeforeUnloadListener() {
    window.addEventListener('beforeunload', function() {
      this.analytics.trackEarlyExit();
    }.bind(this));
  }

  initCombatEventLogListener() {
    Object.keys(EVENTS.COMBAT).forEach(key => {
      window.addEventListener(EVENTS.COMBAT[key], function(combatEvent) {
        this.state.combatEventLog.logItem(new CombatEventLogItem(combatEvent, this.state.player, this.state.enemy));
      }.bind(this));
    });
  }

  initAICombatEventListener() {
    window.addEventListener(EVENTS.COMBAT.COMBAT_ATTACKED, function(combatEvent) {
      if (this.state.player.id === combatEvent.sourceStruct.playerId) {
        this.state.aiThreatTracker.trackAttack(combatEvent.sourceStruct, combatEvent.damageAmount);
      }
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
    this.initBeforeUnloadListener();

    this.combatEventViewer.initOneTimeListeners();
    this.initCombatEventLogListener();
    this.initAICombatEventListener();
  }

  /**
   * @return {string}
   */
  renderCombatMap() {
    return `
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
  }

  /**
   * @return {string}
   */
  renderFleetSelectActions() {
    return `
      <div class="mb-4">
        <div class="fleetSelectActionsContainer mt-3">
          <div class="row justify-content-between mb-3">
            <div class="col">
              <div class="d-grid">
                <a
                  href="javascript: void(0)"
                  id="${this.fleetGenerateButtonId}"
                  class="btn btn-warning"
                >Auto Deploy</a>
              </div>
            </div>
            <div class="col">
              <div class="d-grid">
                <a
                  href="javascript: void(0)"
                  id="${this.fleetResetButtonId}"
                  class="btn btn-warning"
                >Reset</a>
              </div>
            </div>
          </div>
          <div class="row justify-content-between">
            <div class="col">
              <div class="d-grid">
                <button
                  id="${this.fleetSetupCompleteButtonId}"
                  class="btn btn-primary"
                  ${!this.state.arePlanetsEnabled || this.state.turn.planet.numberOfStructs() > 0 ? '' : 'disabled'}
                >Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * @return {string}
   */
  renderGeneratorHelp() {
    return `
      <div class="row mb-3">
        <div class="col">

          <div class="card side container-fluid p-3 text-start">
            <div class="row g-0">
              <div class="col-auto text-void-grey">
                <img src="${IMG.ICONS}icon-power-bolt.png" alt="Lightning Bolt" class="section-icon">
              </div>
              <div class="col">
                <div class="fw-bold">Deploy Your Power Generator</div>
                <div>Click a space with the <img src="${IMG.ICONS}icon-power-bolt.png" alt="Lightning Bolt"> icon to deploy your Power Generator there. This Struct generates 1 Watt per turn, which you can use to deploy new units during the game.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `
  }
  /**
   * @return {string}
   */
  renderFleetSelectHelp() {
    const sideClass = (this.state.player.id === this.state.turn.id) ? 'text-lg-start' : 'text-lg-end';
    const generatorHelp = (this.state.arePlanetsEnabled) ? this.renderGeneratorHelp() : '';
    return `
      <div class="fleetSelectHelp col ${sideClass} mb-4">
        <div class="row mb-3">
          <div class="col">

            <div class="card side container-fluid p-3 text-start">
              <div class="row g-0">
                <div class="col-auto text-void-grey">
                  <div class="watt-icon section-icon"></div>
                </div>
                <div class="col">
                  <div class="fw-bold">Build Your Army</div>
                  <div>Click on a space to deploy or replace Struct. More advanced Structs cost more Watt. Your fleet must defend your Command Ship; if your Command Ship is destroyed, you lose.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
        ${generatorHelp}
        <div class="row">
          <div class="col">

            <div class="card side container-fluid p-3 text-start">
              <div class="row g-0">
                <div class="col-auto">
                  <img src="${IMG.ICONS}icon-accuracy.png" alt="Cross Hair" class="section-icon">
                </div>
                <div class="col">
                  <div class="fw-bold">Understanding Struct Abilities</div>
                  <div class="mb-2">Each Struct has unique systems that allow it to attack and defend against other
                    Structs. Look for the following to understand a Struct’s capabilities.</div>

                  <div class="fw-bold"><img src="${IMG.ICONS}icon-attack-melee.png" alt="Sword"> Offensive Systems</div>
                  <div class="card p-2 mb-2 bg-space-dust-grey">
                    <div class="container-fluid">
                      <div class="row mb-2">
                        <div class="col font-smaller">Weapon Type</div>
                        <div class="col font-smaller">Weapon Range</div>
                      </div>
                      <div class="row mb-2">
                        <div class="col">
                          <img src="${IMG.ICONS}icon-accuracy.png" alt="Cross Hair">
                          Guided Weapon
                        </div>
                        <div class="col">
                          <img src="${IMG.ICONS}icon-ambit-land.png" alt="land">
                          Targets Land
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col">
                          <img src="${IMG.ICONS}icon-unguided.png" alt="Cross Hair with X">
                          Unguided Weapon
                        </div>
                        <div class="col">
                          <img src="${IMG.ICONS}icon-ambit-water.png" alt="water">
                          Targets Water
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col">
                          <img src="${IMG.ICONS}icon-counter-attack.png" alt="Arrow forward above arrow back">
                          Counter Attack
                        </div>
                        <div class="col">
                          <img src="${IMG.ICONS}icon-ambit-sky.png" alt="sky">
                          Targets Sky
                        </div>
                      </div>
                      <div class="row mb-2">
                        <div class="col"></div>
                        <div class="col">
                          <img src="${IMG.ICONS}icon-ambit-space.png" alt="space">
                          Targets Space
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="fw-bold"><img src="${IMG.ICONS}icon-def-melee.png" alt="Sheild"> Defensive Systems</div>
                  <div class="card p-2 mb-2 bg-space-dust-grey">
                    <div class="fw-bold">Stealth Mode</div>
                    <div class="mb-2">When active, prevents any attack from outside a Struct’s ambit.</div>
                    <div class="fw-bold">Signal Jamming</div>
                    <div class="mb-2">2/3 Chance to avoid Guided attacks.</div>
                    <div class="fw-bold">Evasive Maneuver</div>
                    <div class="mb-2">2/3 Chance to avoid Unguided attacks.</div>
                    <div class="fw-bold">Indirect Combat</div>
                    <div class="mb-2">Cannot Counter-Attack or be Counter-Attacked.</div>
                  </div>

                  <div class="font-smaller fst-italic">Example</div>
                  <ul class="list-group list-group-horizontal mb-1">
                    <li class="list-group-item bg-space-dust-grey"><img src="${IMG.ICONS}icon-accuracy.png" alt="cross hair"></li>
                    <li class="list-group-item">2 <img src="${IMG.ICONS}icon-fire.png" alt="fire"></li>
                    <li class="list-group-item"><img src="${IMG.ICONS}icon-ambit-space.png" alt="space"></li>
                    <li class="list-group-item"><img src="${IMG.ICONS}icon-ambit-sky.png" alt="space"></li>
                  </ul>
                  <div class="font-smaller">A <span class="fw-bold">Guided Weapon</span> that deals <span class="fw-bold">2 Damage</span> against <span class="fw-bold">Space</span> and <span class="fw-bold">Air</span> units.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  renderFleetSelectMap() {
    let firstColumn = `
      <div id="playerFleet" class="col text-lg-end">
        ${this.playerFleetUI.render(this.state.player)}
        ${this.renderFleetSelectActions()}
      </div>
    `;
    let secondColumn = this.renderFleetSelectHelp();

    if (this.state.turn.id === this.state.enemy.id) {
      firstColumn = this.renderFleetSelectHelp();
      secondColumn = `
        <div id="enemyFleet" class="col text-lg-start order-md-last order-sm-first">
          ${this.enemyFleetUI.render(this.state.player)}
          ${this.renderFleetSelectActions()}
        </div>
      `;
    }

    return `
      <div class="container-fluid play-area fleet-select-map">
        <div class="row">
          ${firstColumn}
          ${secondColumn}
        </div>
      </div>
    `;
  }

  render() {
    let offcanvasClass = (this.state.player.id === this.state.turn.id) ? 'player' : 'enemy';
    let content = '';

    switch(this.state.gamePhase) {
      case GAME_PHASES.FLEET_SELECT_P1:
        content = this.renderFleetSelectMap();
        offcanvasClass = 'player';
        break;
      case GAME_PHASES.FLEET_SELECT_P2:
        content = this.renderFleetSelectMap();
        offcanvasClass = 'enemy';
        break;
      case GAME_PHASES.COMBAT:
        content = this.renderCombatMap();
        break;
    }

    document.getElementById(this.state.gameContainerId).innerHTML = content;

    this.initListenersPerRender();

    this.gameStartModal.init();
    this.gameOverModal.init();

    const domOffcanvas = document.getElementById('offcanvasBottom');
    domOffcanvas.classList.remove('player');
    domOffcanvas.classList.remove('enemy');
    domOffcanvas.classList.add(offcanvasClass);

    this.cancelActionButton.render();
  }
}
