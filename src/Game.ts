import Universals from "./Universals";
import Renderer from "./Render";
import Ball from "./Ball";
import Planet from "./Planet";
import {Body,seperation} from "./Body";
import Victor = require('victor')
import tinycolor = require('tinycolor2');

enum team {"boccino", "red", "green"};
enum stage {"play", "score","waiting"};

export default class Game {

  public renderer: Renderer
  public planets: Array<Planet>
  public balls: Array<Ball>
  public stage: stage
  public animTick: number
  public points: Object

  constructor(renderer: Renderer) {
    this.newGame()
    this.renderer = renderer
    this.animTick = 0;
    this.points = {}
    this.points[team.red] = 0
    this.points[team.green] = 0
  }
  newGame(){
    this.stage = stage.play
    this.balls= []
    this.planets = this.genPlanets()
  }
  randomPoint(): Victor{
    let e:number = 190
    let p:Victor = new Victor(0,0)
    p.randomize(new Victor(e,(e/2)), new Victor(Universals.bounds.x-(e/2),Universals.bounds.y-e))
    return p
  }
  genPlanets(){
    let n = Universals.bounds.x*Universals.bounds.y*.15
    let on = n
    let planets = []
    let fuse = 10000
    while(n>0){
      let radius = Math.random()*140*(n/on) + 40
      let newPlanet = new Planet(
        this.randomPoint(),
        Math.PI*radius*radius,
        radius,
        tinycolor.random().darken(0.9).toRgbString()
      )
      let distances = planets.map(p=>seperation(newPlanet,p))
      if(Math.min(...distances)>100){
        n-=(radius*radius*Math.PI)
        planets.push(newPlanet)
      }
      fuse--
      if(fuse<0)
        break
    }
    return planets
  }
  tick(){
      let bodys: Array<Body> = [...this.balls,...this.planets]
      this.renderer.render(bodys,this.balls.length)
      this.renderer.renderHUD(this.points)
      if(this.stage===stage.play){
        let settle = this.balls.map(b=>b.update(this.planets, this.balls))
        if(this.stage===stage.play && this.balls.length===9 && settle.every(i=>i)){
          this.stage= stage.score
          this.animTick = 0
        }
      }
      if(this.stage === stage.score || this.stage === stage.waiting){
        let done = this.renderer.renderScore(this.balls[0],this.score(),this.animTick)
        this.animTick++
        if(done){
          if(this.stage==stage.score)
            this.points[this.score()[0].ball.teamon]+=(this.score().length-1)
          this.stage = stage.waiting
        }
      }

  }
  launch(start:Victor,end:Victor){
    let isBoccino = this.balls.length ==0
    let type:team = team.boccino
    if(!isBoccino){
      type = this.balls.length%2? team.red: team.green
    }

    let launched: Ball = new Ball(
      Universals.launchPos.clone(),
      start.clone().subtract(end).multiplyScalar(0.65),
      type
    )

    if(this.balls.length < 9 && (start.clone().subtract(end).multiplyScalar(0.65).length()>15)){
      this.balls.push(launched)
    }else if(this.stage===stage.waiting){
      this.newGame()
    }
  }
  score():Array<{d:number,ball:Ball}>{
    let boccino = this.balls[0]
    let balls = this.balls.slice(1)
    let distances:Array<{d:number,ball:Ball}>= balls.map(ball=>{
      return {d:ball.position.distance(boccino.position), ball}
    }).sort((a,b)=>a.d-b.d)
    let winnerTeam:team = distances[0].ball.teamon
    for(var i =0; i<distances.length;i++){
      if(distances[i].ball.teamon!=winnerTeam)
        return(distances.slice(0,i+1))
    }
    throw("?")
  }
}
