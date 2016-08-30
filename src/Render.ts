// a special import statement to require node modules...
import assign = require("object-assign");
import Ball from "./Ball";
import Universals from "./Universals";
import Control from "./Control";
import {Body} from "./Body";
import tinycolor = require('tinycolor2');
import Victor = require('victor')

enum team {"boccino", "red", "green"};

export default class Renderer {

  private ctx: CanvasRenderingContext2D;
  public controls: Control

  constructor(ctx:CanvasRenderingContext2D) {
    this.ctx = ctx
  }
  render(bodys: Array<Body>, shots:number) {
    this.ctx.fillStyle = `hsla(180, 0% ,10%,0.5)`

    this.ctx.fillRect(0,0,Universals.bounds.x,Universals.bounds.y)
    let allBalls = [...bodys, ...this.hudBalls(9-shots)]

    for (let i in allBalls){
      let ball = allBalls[i]
      this.renderBall(ball)
    }
    this.renderShot()
  }
  renderBall(body: Body){
    let lgrd: CanvasGradient = this.ctx.createLinearGradient(
      body.position.x-body.radius,
      body.position.y-body.radius,
      body.position.x+body.radius,
      body.position.y+body.radius);
    let rgrd: CanvasGradient = this.ctx.createRadialGradient(
      body.position.x,
      body.position.y,
      0,
      body.position.x,
      body.position.y,
      body.radius);

    rgrd.addColorStop(0.1, tinycolor(body.color).toRgbString());
    rgrd.addColorStop(1, tinycolor(body.color).spin(50).darken(20).toRgbString());
    lgrd.addColorStop(0,tinycolor(body.color).darken(100).setAlpha(0.7).toRgbString());
    lgrd.addColorStop(1,tinycolor(body.color).lighten(100).setAlpha(0.7).toRgbString());

    this.ctx.fillStyle=rgrd;
    this.ctx.beginPath()
    this.ctx.arc(body.position.x,body.position.y,body.radius,0,180)
    this.ctx.fill()

    this.ctx.fillStyle=lgrd;
    this.ctx.beginPath()
    this.ctx.arc(body.position.x,body.position.y,body.radius,0,180)
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
  hudBalls(nleft){
    let left = [team.boccino]
    var i =0
    while(i<4){
      i++
      left.push(team.red)
      left.push(team.green)
    }
    let balls: Array<Ball> = left.slice(9-nleft).map((team,i)=>{
    return new Ball(
      new Victor(10+(i*20),12),
      new Victor(0,0),
      team)
    })
    return balls
  }
}
