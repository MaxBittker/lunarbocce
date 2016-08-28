import Universals from "./Universals";
import Victor = require('victor')


export default class Planet {

  public position: Victor;
  public velocity: Victor;
  public mass: number;
  public radius: number;
  public color: string;

  constructor(position,mass,radius,color) {
    this.position = position
    this.velocity = new Victor(0,0)
    this.mass = mass
    this.radius = radius
    this.color = color
  }
}
