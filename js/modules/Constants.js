export const
  AMBITS = {
    LAND: 'LAND',
    SKY: 'SKY',
    SPACE: 'SPACE',
    WATER: 'WATER',
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
    ACTION_ATTACK_PRIMARY: 'ACTION_ATTACK_PRIMARY',
    ACTION_ATTACK_SECONDARY: 'ACTION_ATTACK_SECONDARY',
    ACTION_DEFEND: 'ACTION_DEFEND',
    ACTION_MOVE: 'ACTION_MOVE',
    ACTION_STEALTH_MODE: 'ACTION_STEALTH_MODE',
    COMBAT_ATTACKED: 'COMBAT_ATTACKED',
    COMBAT_COUNTER_ATTACKED: 'COMBAT_COUNTER_ATTACKED',
    COMBAT_COUNTER_ATTACKED_ON_DEATH: 'COMBAT_COUNTER_ATTACKED_ON_DEATH',
    COMBAT_DAMAGE_TAKEN: 'COMBAT_DAMAGE_TAKEN',
    COMBAT_DEFENDER_BLOCKED: 'COMBAT_DEFENDER_BLOCKED',
    COMBAT_DEFENDER_COUNTERED: 'COMBAT_DEFENDER_COUNTERED'
  },

  FLEET_STRUCT_DEFAULTS = {
    ARMOUR: 1,
    ATTACK_DAMAGE: 2,
    COUNTER_ATTACK_DAMAGE: 1,
    MAX_HEALTH: 3,
  },

  IMG = {
    ICONS: 'img/icons/',
    STRUCTS: 'img/'
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
    MAX_ACTIVE_FLEET_STRUCTS: 16
  },

  STRUCT_DEFAULTS = {
    ID_PREFIX: 'struct-'
  },

  UNIT_TYPES = {
    ARTILLERY: 'ARTILLERY',
    COMMAND_SHIP: 'COMMAND SHIP',
    CRUISER: 'CRUISER',
    DESTROYER: 'DESTROYER',
    FIGHTER_JET: 'FIGHTER JET',
    GALACTIC_BATTLESHIP: 'GALACTIC BATTLESHIP',
    HIGH_ALTITUDE_INTERCEPTOR: 'HIGH ALTITUDE INTERCEPTOR',
    SAM_LAUNCHER: 'SAM LAUNCHER',
    SPACE_FRIGATE: 'SPACE FRIGATE',
    STAR_FIGHTER: 'STAR FIGHTER',
    STEALTH_BOMBER: 'STEALTH BOMBER',
    SUB: 'SUB',
    TANK: 'TANK'
  }
;
