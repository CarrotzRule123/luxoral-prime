const Constants = require('../shared/constants');

module.exports = {
  objectCollisions: function(me){
    const { x, y, height, width} = Constants.MAP_OBJECTS.BOX_1;
    if(me.x < x + width + me.width &&
      me.x + me.width > x &&
      me.y < y + height + me.height &&
      me.y + me.height > y){
        return true
      }else{
        return false
      }
  },

  isNear: function(me,obj){
    const{x1, x2, y1, y2} = obj
    const x= Math.min(x1,x2)
    const width= Math.max(x1,x2)
    const y= Math.min(y1,y2)
    // const height= Math.max(y1,y2)
    if(me.x>x-10 && me.x<width+10 && me.y>y-10 ){
      return true
    }else{
      return false
    }
  },

  // Returns an array of bullets to be destroyed.
  applyCollisions: function(players, bullets) {
    const destroyedBullets = [];
    for (let i = 0; i < bullets.length; i++) {
      // Look for a player (who didn't create the bullet) to collide each bullet with.
      // As soon as we find one, break out of the loop to prevent double counting a bullet.
      for (let j = 0; j < players.length; j++) {
        const bullet = bullets[i];
        const player = players[j];
        if (
          bullet.parentID !== player.id &&
          player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
        ) {
          destroyedBullets.push(bullet);
          player.takeBulletDamage();
          break;
        }
      }
    }
  return destroyedBullets;
  },

  mapCollisions: function(me,obj) {
    const{x1, x2, y1, y2} = obj
    const m = (y2-y1)/(x2-x1)
    if(m<1){
      const c1 = y1-m*x1
      const dy = me.x*m+c1
      return [me.x, dy]
    }
    if(m>1){
      const c2 = x1-y1/m
      const dx = me.y/m+c2
      return [dx, me.y]
    }
    return [me.x, me.y]
  }
}
