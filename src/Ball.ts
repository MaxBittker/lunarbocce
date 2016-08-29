import Victor = require('victor')
import Universals from "./Universals";
import {Body,seperation} from "./Body";
import playSound from "./Sound";
import tinycolor from 'tinycolor2';
enum bodyType {Ball, Planet};



export default class Ball {

  public position: Victor;
  public velocity: Victor;
  public mass: number;
  public radius: number;
  public color: string;


  constructor(position: Victor,
              velocity: Victor,
              mass: number,
              radius: number,
              color: string) {
    this.position = position
    this.velocity = velocity
    this.mass = mass
    this.radius = radius
    this.color = color
  }
  update(planets: Array<Body>, balls: Array<Body>) {
    let forceAcc = new Victor(0,0)
    for(let p in planets){
      let planet = planets[p]
      let force = 6.674 * Math.pow(10,0) *
                  planet.mass * this.mass /
                   Math.pow(this.position.distance(planet.position),2)
      forceAcc.add(planet.position.clone()
                    .subtract(this.position)
                    .normalize()
                    .multiplyScalar(force)
                  )
    }

    this.velocity.add(
      forceAcc.multiplyScalar(Universals.delta / this.mass)
    )
    //apply update
    this.position.add(
      this.velocity.clone().multiplyScalar(Universals.delta)
    )

    for(let p in planets){
      let planet = planets[p]
      if(seperation(this, planet) < 0){
        let n: Victor = planet.position.clone()
                            .subtract(this.position)
                            .normalize()
        this.velocity.subtract(
          n.clone().multiplyScalar(this.velocity.dot(n) * 2)
        )

        let delta: Victor  = (this.position.clone().subtract(planet.position));
        let d:number = delta.length();
        let mtd:Victor = delta.clone().multiplyScalar(((this.radius + planet.radius) - d )/ d );

        this.position.add(mtd);
        playSound(this.velocity.length()/50)
        this.velocity.multiplyScalar(0.7)
      }
    }
    for( let b in balls){
      let ball = balls[b]
      if((ball !== this) && (seperation(this, ball) < 0)){

        let delta: Victor  = (this.position.clone().subtract(ball.position));
        let d:number = delta.length();

        let mtd:Victor = delta.clone().multiplyScalar(((this.radius + ball.radius) - d )/ d );
        // resolve intersection --
        // inverse mass quantities
        let im1:number = 1 / this.mass;
        let im2:number = 1 / ball.mass;
        // push-pull them apart based off their mass
        this.position.add(mtd.clone().multiplyScalar(im1 / (im1 + im2)));
        ball.position.subtract(mtd.clone().multiplyScalar(im2 / (im1 + im2)));
        // impact speed
        let v:Victor = this.velocity.clone().subtract(ball.velocity);
        let vn:number = v.dot(mtd.clone().normalize());
        // sphere intersecting but moving away from each other already
        if (vn > 0){
          console.log("contunue")
          continue;
        }
          console.log("APPLY")
          let i:number = (-(0.9) * vn) / (im1 + im2);
          let impulse:Victor = mtd.clone().multiplyScalar(i);
          this.velocity.add(impulse.clone().multiplyScalar(im1));
          ball.velocity.subtract(impulse.clone().multiplyScalar(im2))
          playSound(impulse.length()/50)

      }
    }
  }
}
