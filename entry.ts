import Renderer from "./src/Render";
import Ball from "./src/Ball";
import Game from "./src/Game";
import Universals from "./src/Universals";
import Control from "./src/Control";
import Victor = require('victor')
import tinycolor = require('tinycolor2');
declare var team: {"boccino":string, "red":string, "green":string};

const initCanvas = ()=> {
  let canvas = document.createElement("canvas");
  canvas.width = Universals.bounds.x;
  canvas.height = Universals.bounds.y;
  let ctx: CanvasRenderingContext2D = canvas.getContext("2d");


  document.body.appendChild(canvas);

  let renderer = new Renderer(ctx);
  let game = new Game(renderer)
  let controls = new Control(canvas,game)
  renderer.controls = controls

  return game
}
let game = initCanvas()

const frame = (timestamp) => {
  game.tick()
  window.requestAnimationFrame(frame);
}


window.requestAnimationFrame(frame);
