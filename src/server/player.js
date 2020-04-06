const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const AnimalConstants = require('../shared/animal-constants');
const MapConstants = require('../shared/map-constants');
const Collisions = require('./collisions');
const mapCollisions = Collisions.mapCollisions;
const isNear = Collisions.isNear;

class Player extends ObjectClass {
  constructor(id, username, x, y, animal) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.tier = 1;
    this.animal = animal;
    this.hp = animal.hp;
    this.dmg = this.animal.dmg;
    this.fireCooldown = 0;
    this.score = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
    // this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_WIDTH, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_HEIGHT, this.y));

    // Check for collisions with the map
    MapConstants.MAP_LINES.forEach(line =>{
      if(isNear(this,line)){
        const pos = mapCollisions(this,line)
        this.x = Math.max(this.x, pos[0])
        this.y = Math.min(this.y, pos[1])
      }
    })
    
    // Check if player is out of water
    const dist = Constants.WATERLINE.y1 - this.y
    if(dist>0){
      if(this.thrust>0){
        this.y += (dist/20) * (dist/20)
        this.thrust -= 1
      }else{
        this.y+=10
      }
    }else{
      this.thrust = 20
    }

    //Evolve
    if(this.score>this.animal.upgrade){
      this.evolve()
    }

    // Fire a bullet, if needed
    // this.fireCooldown -= dt;
    // if (this.fireCooldown <= 0) {
    //   this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
    //   return new Bullet(this.id, this.x, this.y, this.direction);
    // }

    // return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  evolve() {
    this.tier += 1;
    const animal = AnimalConstants[this.tier-1][0]
    this.animal = animal
    this.hp = animal.hp;
    this.inithp = animal.hp;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      animal: 0,
      tier: this.tier,
      score: this.score,
    };
  }
}

module.exports = Player;
