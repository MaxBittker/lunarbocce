import Victor = require('victor')
import Universals from "./Universals";
import {Body,seperation} from "./Body";
import playSound from "./Sound";
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
          n.multiplyScalar(this.velocity.dot(n) * 2)
        )

        let delta: Victor  = (this.position.clone().subtract(planet.position));
        let d:number = delta.length();
        let mtd:Victor = delta.multiplyScalar(((this.radius + planet.radius) - d )/ d );

        this.position.add(mtd);
        // this.position.add(
          // this.velocity.clone().multiplyScalar(Universals.delta)
        // )
        playSound(this.velocity.length()/50)
        this.velocity.multiplyScalar(0.7)
      }
    }
    for( let b in balls){
      let ball = balls[b]
      if(ball !== this && seperation(this, ball) < 0){
        let delta: Victor  = (this.position.clone().subtract(ball.position));
        let d:number = delta.length();

        let mtd:Victor = delta.multiplyScalar(((this.radius + ball.radius) - d )/ d );
        // resolve intersection --
        // inverse mass quantities
        let im1:number = 1 / this.mass;
        let im2:number = 1 / ball.mass;
        // push-pull them apart based off their mass
        this.position.add(mtd.multiplyScalar(im1 / (im1 + im2)));
        ball.position.subtract(mtd.multiplyScalar(im2 / (im1 + im2)));
        // impact speed
        let v:Victor = this.velocity.clone().subtract(ball.velocity);
        let vn:number = v.dot(mtd.clone().normalize());
        // sphere intersecting but moving away from each other already
        if (vn > 0) return;
        // collision impulse
        let i:number = (-(1.0 + 1.0) * vn) / (im1 + im2);
        let impulse:Victor = mtd.multiplyScalar(i);
        // change in momentum
        // debugger
        this.velocity.add(impulse.multiplyScalar(im1));
        ball.velocity.subtract(impulse.multiplyScalar(im2))
        // if(parseInt(b) == balls.length-1){
          // console.log("boom")
          // this.velocity.add(impulse.multiplyScalar(im1*100));
        // }
        // debugger
      }
    }
  }
}
