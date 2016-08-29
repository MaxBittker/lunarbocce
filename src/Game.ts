import Universals from "./Universals";
import Renderer from "./Render";
import Ball from "./Ball";
import Planet from "./Planet";
import {Body,seperation} from "./Body";
import Victor = require('victor')
// import tinycolor from 'tinycolor2';
import tinycolor = require('tinycolor2');
// let t = tinycolor
export default class Game {

  public renderer: Renderer
  public planets: Array<Planet>
  public balls: Array<Ball>


  constructor(renderer: Renderer) {
    this.renderer = renderer
    this.balls= []
    this.planets = this.genPlanets(60000)
  }
  newGame(){
    this.balls= []
    this.planets = this.genPlanets(60000)
  }
  randomPoint(): Victor{
    let e:number = 190
    let p:Victor = new Victor(0,0)
    p.randomize(new Victor(e,e), new Victor(Universals.width-e,Universals.height-e))
    // return new Victor(Math.random()*Universals.width,
                      // Math.random()*Universals.height)
    return p
  }
  genPlanets(n){
    // console.log(tinycolor)
    // debugger
    let planets = []
    while(n>0){
      let radius = Math.random()*140*(n/60000) + 40
      let newPlanet = new Planet(
        this.randomPoint(),
        Math.PI*radius*radius,
        // Math.PI*(4/3)*radius*radius*radius,
        radius,
        tinycolor.random().darken(0.9).toRgbString()
      )
      let distances = planets.map(p=>seperation(newPlanet,p))
      if(Math.min(...distances)<100){
        // n+=(radius*radius*Math.PI)
      }else{
        n-=(radius*radius*Math.PI)
        planets.push(newPlanet)
      }
    }
    return planets
  }
  tick(){
    let bodys: Array<Body> = [...this.balls,...this.planets]//this.balls.concat(this.planets)
    this.renderer.render(bodys)

    this.balls.forEach(
      b=>b.update(this.planets, this.balls)
    )
  }
  launch(start:Victor,end:Victor){
    let isBoccino = this.balls.length ==0
    let radius = isBoccino ? 9 : 15
    let color:string = isBoccino ? tinycolor('white').toRgbString()
                          : tinycolor('red').toRgbString()
    if(!isBoccino){
      color = this.balls.length%2 ? tinycolor('red').toRgbString()
                                         : tinycolor('green').toRgbString()

    }
    let launched: Ball = new Ball(
      start,
      start.clone().subtract(end).multiplyScalar(0.65),
      radius*radius*Math.PI,
      radius,
      color
    )
    this.balls.push(launched)
    if(this.balls.length===10){
      this.newGame()
    }
  }
}
