module.exports = Object.freeze({
  PLAYER_RADIUS: 50,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 10,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_WIDTH: 4320,
  MAP_HEIGHT: 3240,

  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },

  MAP_OBJECTS: {
    BOX_1: {
      x: 300,
      y: 300,
      height: 300,
      width: 300,
    },
    BOX_2: {
      x: 500,
      y: 500,
      height: 300,
      width: 300,
    },
  },

  WATERLINE: {
    x1: 0,
    x2: 2160,
    y1: 882,
    y2: 882,
  },
});
