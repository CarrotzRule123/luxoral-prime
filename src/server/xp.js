const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');
const MapConstants = require('../shared/map-constants');
const Collisions = require('./collisions');
const mapCollisions = Collisions.mapCollisions;
const isNear = Collisions.isNear;

const {MAP_WIDTH, MAP_HEIGHT} = Constants
const WATERLINE = Constants.WATERLINE.y1

class Xp extends ObjectClass{
  constructor() {
    super(shortid(), MAP_WIDTH * Math.random(), ((MAP_HEIGHT - WATERLINE) * Math.random()) + WATERLINE, null, null);
  }

  verify(){
    MapConstants.MAP_LINES.forEach(line =>{
      if(isNear(this,line)){
        const pos = mapCollisions(this,line)
        this.x = Math.max(this.x, pos[0])
        this.y = Math.min(this.y, pos[1])
      }
    })
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Xp;
