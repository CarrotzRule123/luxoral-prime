// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';
const AnimalConstants = require('../shared/animal-constants');

var p = document.getElementById('p');
var count = document.getElementById('count');

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, BULLET_RADIUS, MAP_WIDTH, MAP_HEIGHT } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others, bullets, xp, info} = getCurrentState();
  me.stats = AnimalConstants[me.tier-1][me.animal]
  others.forEach(o => {o.stats = AnimalConstants[o.tier-1][o.animal]});
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);
  xp.forEach(index => renderXp(me,index))
  renderXpBar(me)
  renderText(me)

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_WIDTH, MAP_HEIGHT);

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function renderText(me){
  p.innerHTML = "You are a "+me.stats.name
  const score = Math.round(me.score)
  const stats = me.stats.upgrade 
  count.innerHTML = score +' out of '+ stats +' xp('+ (stats-score) + 'xp remaining to upgrade)'
}

function renderBackground(x, y) {
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const mapX = 0 - x + canvas.width / 2;
  const mapY = 0 - y + canvas.height / 2;
  context.drawImage(
    getAsset('map.png'),
    mapX, mapY,
  );
  context.restore();
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction} = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset(player.stats.img),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / player.stats.hp,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / player.stats.hp),
    2,
  );
}

function renderXpBar(me) {
  context.fillStyle = 'grey';
  context.fillRect(
    100, canvas.height-75, canvas.width-200, 20
  );
  context.fillStyle = 'yellow';
  context.fillRect(
    100, canvas.height-75, (canvas.width-200)* (me.score / me.stats.upgrade), 20
  );
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderXp(me,xp) {
  const {x, y} = xp;
  const xpX = x - me.x + canvas.width / 2;
  const xpY = y - me.y + canvas.height / 2;
  context.fillStyle = "lime";
  context.beginPath()
  context.arc(xpX, xpY, 10, 0, 2 * Math.PI);
  context.fill()
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_WIDTH / 2 + 800 * Math.cos(t);
  const y = MAP_HEIGHT / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
