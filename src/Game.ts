import Universals from "./Universals";
import Renderer from "./Render";
import Ball from "./Ball";
import Planet from "./Planet";
import {Body,seperation} from "./Body";
import Victor = require('victor')


export default class Game {

  public renderer: Renderer
  public planets: Array<Planet>
  public balls: Array<Ball>


  constructor(renderer: Renderer) {
    this.renderer = renderer

    this.balls= [new Ball(
      new Victor(0,0),
      new Victor(10,0),
      10,
      15,
      "red")]
    this.planets = this.genPlanets(1)
  }
  randomPoint(): Victor{
    return new Victor(Math.random()*Universals.width,
                      Math.random()*Universals.height)
  }
  genPlanets(n){
    let planets = []
    for(;n>0; n--){
      let radius = Math.random()*100 + 10
      let newPlanet = new Planet(
        this.randomPoint(),
        Math.PI*radius*radius,
        // Math.PI*(4/3)*radius*radius*radius,
        radius,
        "red")
      let distances = planets.map(p=>seperation(newPlanet,p))
      if(Math.min(...distances)<10){
        n++
      }else{
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
    let launched: Ball = new Ball(
      start,
      start.clone().subtract(end).multiplyScalar(0.65),
      10,
      15,
      "red"
    )
    this.balls.push(launched)
  }
}
