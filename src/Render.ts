// a special import statement to require node modules...
import assign = require("object-assign");
import Ball from "./Ball";
import Universals from "./Universals";
import Control from "./Control";
import {Body} from "./Body";
import tinycolor = require('tinycolor2');
import Victor = require('victor')
import {playClick,playDing} from "./Sound";

enum team {"boccino", "red", "green"};

export default class Renderer {

  private ctx: CanvasRenderingContext2D;
  public controls: Control

  constructor(ctx:CanvasRenderingContext2D) {
    this.ctx = ctx
  }
  render(bodys: Array<Body>, shots:number, whoStart:team) {
    this.ctx.fillStyle = `hsla(180, 0% ,10%,0.5)`

    this.ctx.fillRect(0,0,Universals.bounds.x,Universals.bounds.y)
    let allBalls = [...bodys, ...this.hudBalls(9-shots, whoStart)]

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
    this.ctx.strokeStyle="rgba(200, 200, 200, 0.2)";
    this.ctx.lineCap="round";

    this.ctx.beginPath()
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([6, 15]);
    this.ctx.arc(
      Universals.launchPos.x,
      Universals.launchPos.y,
      50,
      45,45+180)
    this.ctx.stroke()

    if(this.controls.startDrag &&this.controls.mousePos){

    let v:Victor = this.controls.startDrag.clone().subtract(this.controls.mousePos)
              .multiplyScalar(0.3)
    let mag = Math.min(50, v.length())
    // this.ctx.fillStyle=tinycolor({ h: 230-(v.length()*3), l: 0.5, s: 0.5 }).setAlpha(0.2).toRgbString()
    this.ctx.fillStyle="rgba(200, 200, 200, 0.2)";
    if((mag/0.3)<35){
      this.ctx.fillStyle="rgba(200, 100, 100, 0.2)";

    }
    this.ctx.strokeStyle="rgba(200, 200, 200, 0.2)";
    this.ctx.lineWidth = mag/5;
    this.ctx.setLineDash([1]);

    let endP:Victor = Universals.launchPos.clone().subtract(v.clone().normalize().multiplyScalar(mag*1.5))


    this.ctx.beginPath()
    this.ctx.moveTo(Universals.launchPos.x,Universals.launchPos.y);
    this.ctx.lineTo(endP.x,endP.y)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.arc(
      Universals.launchPos.x,
      Universals.launchPos.y,
      mag,
      0,180)
    this.ctx.fill()
    }
  }
  hudBalls(nleft:number, whoStart:number): Array<Ball>{
    let left = [team.boccino]
    var i =0
    while(i<4){
      i++
      if(whoStart === team.red){
        left.push(team.red)
        left.push(team.green)
      }else {
        left.push(team.green)
        left.push(team.red)
      }
    }
    let balls: Array<Ball> = left.slice(9-nleft).map((team,i)=>{
    let offset:number = Universals.bounds.y - (100+(i*20))
    return new Ball(
      new Victor(12,offset),
      new Victor(0,0),
      team)
    })
    return balls
  }
  renderHUD(points:Object){
    this.ctx.strokeStyle="rgba(255, 255, 255, 1)";
    this.ctx.font = "30px 'Helvetica'";
    this.ctx.textBaseline = 'alphabetic';

    this.ctx.fillStyle = tinycolor(Universals.teamColors.red).darken(20).toRgbString();
    this.ctx.fillText (points[team.red].toString(), 10, 30);

    this.ctx.fillStyle = tinycolor(Universals.teamColors.green).darken(10).toRgbString();
    this.ctx.fillText (points[team.green].toString(), 40, 30);

    // this.ctx.strokeText /(mark, ball.position.x, ball.position.y);

  }
  renderScore(boccino:Ball,scoreBalls:Array<{d:number,ball:Ball}>,animTick:number):boolean{
    this.ctx.strokeStyle="rgba(255, 255, 255, 1)";


    this.ctx.font = "30px 'Helvetica'";
    this.ctx.textBaseline = 'alphabetic';
    // this.ctx.scale(1,1);

    animTick/=2
    let done = true
    let rate = 1;
    for(var i=0; i<scoreBalls.length;i++){
      let ball:Ball=scoreBalls[i].ball
      let d:number=scoreBalls[i].d
      let r = Math.min(animTick,d)
      if(animTick <= d){
        done = false
      }
      if((d|0) === (r|0) && (d|0) === (animTick|0)){
        playDing(scoreBalls.length - (i+1))
      }
      if(d === r){
        let mark = (i+1).toString()
        this.ctx.fillStyle = tinycolor(ball.color).darken(20).toRgbString();
        if(i  == scoreBalls.length-1){
          mark = '✖'
        }

        this.ctx.lineCap="round";
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);
        this.ctx.fillText (mark, ball.position.x, ball.position.y);
        this.ctx.strokeText (mark, ball.position.x, ball.position.y);
      }
      // animTick -= r

      this.ctx.lineCap="round";
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([2, 10]);

      this.ctx.beginPath()
      let offset = r/(Math.PI*16)
      this.ctx.arc(
        boccino.position.x,
        boccino.position.y,
        r,
        0+offset,180+offset)
      this.ctx.stroke()
    }
    if(!done){
      playClick(rate)
    }
    return done

  }
}
