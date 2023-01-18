export const
  AMBITS = {
    LAND: 'LAND',
    SKY: 'SKY',
    SPACE: 'SPACE',
    WATER: 'WATER',
  },

  COMBAT_EVENT_LABELS = {
    COMBAT_ATTACKED: 'Attacked',
    COMBAT_COUNTER_ATTACKED: 'Counter Attacked',
    COMBAT_COUNTER_ATTACKED_ON_DEATH: 'Counter Attacked on Death',
    COMBAT_DEFENDER_BLOCKED: 'Blocked',
    COMBAT_DEFENDER_COUNTERED: 'Counter Attacked',
    COMBAT_TARGETED: 'Targeted'
  },

  COMMAND_STRUCT_DEFAULTS = {
    COUNTER_ATTACK_DAMAGE: 2,
    MAX_HEALTH: 6
  },

  DEFENSE_COMPONENT_CUSTOM_ACTION_LABELS = {
    OMNI_ENGINE: 'Move',
  },

  DEFENSE_COMPONENT_TYPES = {
    AFTERMARKET_ENGINE: 'AFTERMARKET_ENGINE',
    AMBIT_DEFENSE: 'AMBIT_DEFENSE',
    ARMOUR: 'ARMOUR',
    COUNTER_MEASURE: 'COUNTER_MEASURE',
    DEFAULT: 'DEFAULT',
    EVADE_COUNTER_ATTACK: 'EVADE_COUNTER_ATTACK',
  },

  DEFENSE_COMPONENTS = {
    ARMOUR: 'ARMOUR',
    DEFENSIVE_MANEUVER: 'DEFENSIVE MANEUVER',
    INDIRECT_COMBAT_MODULE: 'INDIRECT COMBAT MODULE',
    OMNI_ENGINE: 'OMNI ENGINE',
    SIGNAL_JAMMING: 'SIGNAL JAMMING',
    STEALTH_MODE: 'STEALTH MODE',
  },

  EVENTS = {
    ACTIONS: {
      ACTION_ATTACK_PRIMARY: 'ACTION_ATTACK_PRIMARY',
      ACTION_ATTACK_SECONDARY: 'ACTION_ATTACK_SECONDARY',
      ACTION_DEFEND: 'ACTION_DEFEND',
      ACTION_MOVE: 'ACTION_MOVE',
      ACTION_STEALTH_MODE: 'ACTION_STEALTH_MODE'
    },
    COMBAT: {
      COMBAT_ATTACKED: 'COMBAT_ATTACKED',
      COMBAT_COUNTER_ATTACKED: 'COMBAT_COUNTER_ATTACKED',
      COMBAT_COUNTER_ATTACKED_ON_DEATH: 'COMBAT_COUNTER_ATTACKED_ON_DEATH',
      COMBAT_DEFENDER_BLOCKED: 'COMBAT_DEFENDER_BLOCKED',
      COMBAT_DEFENDER_COUNTERED: 'COMBAT_DEFENDER_COUNTERED',
      COMBAT_ENDED: 'COMBAT_ENDED',
      COMBAT_TARGETED: 'COMBAT_TARGETED'
    },
    GAME_OVER: 'GAME_OVER',
    RENDER: {
      RENDER_GAME: 'RENDER_GAME'
    },
    TURNS: {
      END_TURN: 'END_TURN',
      FIRST_TURN: 'FIRST_TURN'
    }
  },

  FLEET_STRUCT_DEFAULTS = {
    ARMOUR: 1,
    ATTACK_DAMAGE: 2,
    COUNTER_ATTACK_DAMAGE: 1,
    MAX_HEALTH: 3,
  },

  GAME_PHASES = {
    BUDGET_SELECT: 'BUDGET_SELECT',
    FLEET_SELECT_P1: 'FLEET_SELECT_P1',
    FLEET_SELECT_P2: 'FLEET_SELECT_P2',
    COMBAT: 'COMBAT',
  },

  GAME_MODES = {
    ONE_PLAYER: '1_PLAYER',
    TWO_PLAYER: '2_PLAYER',
  },

  IMG = {
    ICONS: 'img/icons/',
    LARGE_ICONS: 'img/icons/large/',
    RASTER_ICONS: 'img/icons/raster/',
    STRUCTS: 'img/'
  },

  ICONS = {
    GUIDED: `<img src="${IMG.ICONS}icon-accuracy.png" alt="Guided Icon" class="icon-pixel-art icon-guided">`,
    UNGUIDED: `<img src="${IMG.ICONS}icon-unguided.png" alt="Unguided Icon" class="icon-pixel-art icon-unguided">`,
    SPACE: `<img src="${IMG.ICONS}icon-ambit-space.png" alt="Space Icon" class="icon-pixel-art icon-space">`,
    SKY: `<img src="${IMG.ICONS}icon-ambit-sky.png" alt="Sky Icon" class="icon-pixel-art icon-sky">`,
    LAND: `<img src="${IMG.ICONS}icon-ambit-land.png" alt="Land Icon" class="icon-pixel-art icon-land">`,
    WATER: `<img src="${IMG.ICONS}icon-ambit-water.png" alt="Water Icon" class="icon-pixel-art icon-water">`,
    DAMAGE: `<img src="${IMG.ICONS}icon-fire.png" alt="Damage Icon" class="icon-pixel-art icon-damage">`,
    COUNTER_ATTACK: `<img src="${IMG.ICONS}icon-counter-attack.png" alt="Counter Attack Icon" class="icon-pixel-art icon-counter-attack">`,
    DEFENSE: `<img src="${IMG.ICONS}icon-def-melee.png" alt="Defense Icon" class="icon-pixel-art icon-defense">`,
  },

  MANUAL_WEAPON_CUSTOM_ACTION_LABELS = {
    GUIDED_WEAPONRY: 'Guided Attack',
    UNGUIDED_WEAPONRY: 'Unguided Attack',
  },

  MANUAL_WEAPON_SLOTS = {
    PRIMARY: 'PRIMARY',
    SECONDARY: 'SECONDARY'
  },

  MANUAL_WEAPONS = {
    ATTACK_RUN: 'ATTACK RUN',
    GUIDED_WEAPONRY: 'GUIDED WEAPONRY',
    SELF_DESTRUCT: 'SELF DESTRUCT',
    UNGUIDED_WEAPONRY: 'UNGUIDED WEAPONRY',
  },

  MAX_FLEET_STRUCTS_PER_AMBIT = {
    SPACE: 4,
    SKY: 4,
    LAND: 4,
    WATER: 4
  },

  MAX_HEART_ICONS = 3,

  MAX_PLANETARY_STRUCTS_PER_AMBIT = {
    SPACE: 1,
    SKY: 1,
    LAND: 1,
    WATER: 1
  },

  ORDER_OF_AMBITS = [
    AMBITS.WATER,
    AMBITS.LAND,
    AMBITS.SKY,
    AMBITS.SPACE
  ],

  PASSIVE_WEAPONS = {
    ADVANCED_COUNTER_ATTACK: 'ADVANCED COUNTER ATTACK',
    COUNTER_ATTACK: 'COUNTER ATTACK',
    LAST_RESORT: 'LAST RESORT',
    STRONG_COUNTER_ATTACK: 'STRONG COUNTER ATTACK'
  },

  PLAYER_DEFAULTS = {
    ID_PREFIX: 'player-',
    MAX_ACTIVE_FLEET_STRUCTS: 16,
    MAX_ACTIVE_PLANETARY_STRUCTS: 4,
  },

  POWER_GENERATORS = {
    GENERIC: {
      NAME: 'GENERIC',
      POWER_OUTPUT: 1
    }
  },

  QUALITATIVE_BUDGETS = {
    LOW: {
      MIN: 16,
      MAX: 24
    },
    MEDIUM: {
      MIN: 24,
      MAX: 40
    },
    HIGH: {
      MIN: 40,
      MAX: 80
    },
    RANDOM: {
      MIN: 24,
      MAX: 64
    },
    CURATED: {
      MIN: 43,
      MAX: 43
    }
  },

  STRUCT_DEFAULTS = {
    ID_PREFIX: 'struct-'
  },

  THREAT = {
    DAMAGE_THRESHOLD: 4
  },

  UNIT_TYPES = {
    ARTILLERY: 'ARTILLERY',
    COMMAND_SHIP: 'COMMAND SHIP',
    CRUISER: 'CRUISER',
    DESTROYER: 'DESTROYER',
    FIGHTER_JET: 'FIGHTER JET',
    GALACTIC_BATTLESHIP: 'GALACTIC BATTLESHIP',
    GENERATOR: 'GENERATOR',
    HIGH_ALTITUDE_INTERCEPTOR: 'HIGH ALTITUDE INTERCEPTOR',
    SAM_LAUNCHER: 'SAM LAUNCHER',
    SPACE_FRIGATE: 'SPACE FRIGATE',
    STAR_FIGHTER: 'STAR FIGHTER',
    STEALTH_BOMBER: 'STEALTH BOMBER',
    SUB: 'SUB',
    TANK: 'TANK'
  },

  UNITS_BY_AMBIT = {
    SPACE: [
      UNIT_TYPES.STAR_FIGHTER,
      UNIT_TYPES.SPACE_FRIGATE,
      UNIT_TYPES.GALACTIC_BATTLESHIP
    ],
    SKY: [
      UNIT_TYPES.FIGHTER_JET,
      UNIT_TYPES.HIGH_ALTITUDE_INTERCEPTOR,
      UNIT_TYPES.STEALTH_BOMBER
    ],
    LAND: [
      UNIT_TYPES.TANK,
      UNIT_TYPES.SAM_LAUNCHER,
      UNIT_TYPES.ARTILLERY
    ],
    WATER: [
      UNIT_TYPES.SUB,
      UNIT_TYPES.DESTROYER,
      UNIT_TYPES.CRUISER
    ]
  },

  ANALYTICS_DEFAULTS = {
    IDENTITY_PREFIX: 'cmd-',
    IDENTITY_COOKIE: 'identity',
    SERVER: 'https://analytics.structs.so',
    ENDPOINT: 'game'
  }

;
