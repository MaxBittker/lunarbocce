// a special import statement to require node modules...
import assign = require("object-assign");
import Ball from "./Ball";
import Universals from "./Universals";
import Control from "./Control";
import {Body} from "./Body";
import tinycolor = require('tinycolor2');

export default class Renderer {

  private ctx: CanvasRenderingContext2D;
  public controls: Control

  constructor(ctx:CanvasRenderingContext2D) {
    this.ctx = ctx
  }
  render(balls: Array<Body>) {
    this.ctx.fillStyle = `hsla(180, 0% ,10%,0.5)`

    this.ctx.fillRect(0,0,Universals.width,Universals.height)
    for (let i in balls){
      let ball = balls[i]
      this.renderBall(ball)
    }
    this.renderShot()
  }
  renderBall(ball){

    let lgrd: CanvasGradient = this.ctx.createLinearGradient(
      ball.position.x-ball.radius,
      ball.position.y-ball.radius,
      ball.position.x+ball.radius,
      ball.position.y+ball.radius);
    let rgrd: CanvasGradient = this.ctx.createRadialGradient(
      ball.position.x,
      ball.position.y,
      0,
      ball.position.x,
      ball.position.y,
      ball.radius);

    rgrd.addColorStop(0.1, tinycolor(ball.color).toRgbString());
    rgrd.addColorStop(1, tinycolor(ball.color).spin(50).darken(20).toRgbString());
    lgrd.addColorStop(0,tinycolor(ball.color).darken(100).setAlpha(0.7).toRgbString());
    lgrd.addColorStop(1,tinycolor(ball.color).lighten(100).setAlpha(0.7).toRgbString());

    this.ctx.fillStyle=rgrd;
    this.ctx.beginPath()
    this.ctx.arc(ball.position.x,ball.position.y,ball.radius,0,180)
    this.ctx.fill()

    this.ctx.fillStyle=lgrd;
    this.ctx.beginPath()
    this.ctx.arc(ball.position.x,ball.position.y,ball.radius,0,180)
    this.ctx.fill()

  }
  renderShot(){
    if(this.controls.startDrag &&this.controls.mousePos){
    this.ctx.fillStyle="rgba(255, 255, 255, 0.09)";
    this.ctx.strokeStyle="rgba(200, 200, 200, 0.2)";
    this.ctx.lineWidth = 5;
    this.ctx.beginPath()
    this.ctx.moveTo(this.controls.startDrag.x,this.controls.startDrag.y);
    this.ctx.lineTo(this.controls.mousePos.x,this.controls.mousePos.y)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(this.controls.startDrag.x,
      this.controls.startDrag.y,
      this.controls.startDrag.distance(this.controls.mousePos)/5,
      0,180)
    this.ctx.fill()}
  }
}
