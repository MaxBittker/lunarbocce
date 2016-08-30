import Universals from "./Universals";
import Renderer from "./Render";
import Ball from "./Ball";
import Planet from "./Planet";
import {Body,seperation} from "./Body";
import Victor = require('victor')
import tinycolor = require('tinycolor2');

enum team {"boccino", "red", "green"};

export default class Game {

  public renderer: Renderer
  public planets: Array<Planet>
  public balls: Array<Ball>


  constructor(renderer: Renderer) {
    this.renderer = renderer
    this.balls= []
    this.planets = this.genPlanets()
  }
  newGame(){
    this.balls= []
    this.planets = this.genPlanets()
  }
  randomPoint(): Victor{
    let e:number = 190
    let p:Victor = new Victor(0,0)
    p.randomize(new Victor(e,e), new Victor(Universals.bounds.x-e,Universals.bounds.y-e))
    return p
  }
  genPlanets(){
    let n = Universals.bounds.x*Universals.bounds.y*.3
    let on = n
    let planets = []
    let fuse = 10000
    while(n>0){
      let radius = Math.random()*100*(n/on) + 30
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

    this.balls.forEach(
      b=>b.update(this.planets, this.balls)
    )
  }
  launch(start:Victor,end:Victor){
    let isBoccino = this.balls.length ==0
    let type:team = team.boccino
    if(!isBoccino){
      type = this.balls.length%2? team.red: team.green
    }

    let launched: Ball = new Ball(
      start,
      start.clone().subtract(end).multiplyScalar(0.65),
      type
    )
    this.balls.push(launched)
    if(this.balls.length===10){
      this.newGame()
    }
  }
  score(){
    let boccino = this.balls[0]
    let balls = this.balls.slice(1)
    balls.map(ball=>{
      return ball.position.distance(boccino.position)
    })

  }
}
