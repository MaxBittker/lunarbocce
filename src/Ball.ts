import Victor = require('victor')
import Universals from "./Universals";
import {Body,seperation} from "./Body";
import {playSound} from "./Sound";
enum team {"boccino", "red", "green"};

export default class Ball {

  public position: Victor;
  public velocity: Victor;
  public mass: number;
  public radius: number;
  public color: string;
  public teamon: team


  constructor(position: Victor,
              velocity: Victor,
              teamon: team) {
    let isBoccino = teamon == team.boccino
    let radius = isBoccino ? 8 : 12
    let color:string
    switch(teamon){
     case(team.boccino):
      color = Universals.teamColors.boccino
     break;
     case(team.red):
      color = Universals.teamColors.red
     break;
     case(team.green):
      color = Universals.teamColors.green
     break;
    }

    this.position = position
    this.velocity = velocity
    this.mass = radius*radius*Math.PI
    this.radius = radius
    this.color = color
    this.teamon = teamon

  }
  getClosestWall(){

   let wallpoints: Array<Victor> = [(new Victor(this.position.x,0)),
                                   (new Victor(this.position.x,Universals.bounds.y)),
                                   (new Victor(0,this.position.y)),
                                   (new Victor(Universals.bounds.x,this.position.y))]

   let closestwall = wallpoints.reduce((min,wp)=>{
     if(this.position.distance(wp)<this.position.distance(min)){
       return wp
     }
     return min
   })
   return closestwall
  }
  simpleBounce(point, radius){
    let n: Victor = point.clone()
                        .subtract(this.position)
                        .normalize()
    this.velocity.subtract(
      n.clone().multiplyScalar(this.velocity.dot(n) * 2)
    )

    let delta: Victor  = (this.position.clone().subtract(point));
    let d:number = delta.length();
    let mtd:Victor = delta.clone().multiplyScalar(((this.radius + radius) - d )/ d );

    this.position.add(mtd);
    this.velocity.multiplyScalar(0.6)
    playSound(this.velocity.length()/50)
  }
  update(planets: Array<Body>, balls: Array<Body>):boolean {
    let forceAcc = new Victor(0,0)
    let friction = false
    for(let p in planets){
      let planet = planets[p]
      let force = 3.674 * Math.pow(10,1) *
                  planet.mass * this.mass /
                   Math.pow(this.position.distance(planet.position),2)
      forceAcc.add(planet.position.clone()
                    .subtract(this.position)
                    .normalize()
                    .multiplyScalar(force)
                  )
    if(seperation(this, planet) < 2){
        friction = true
    }
  }
    if(this.velocity.length()<12 && friction){
      forceAcc.multiplyScalar(0.1)
    }
    this.velocity.add(
      forceAcc.multiplyScalar(Universals.delta / this.mass)
    )

    //apply update
    if(this.velocity.length()>200){
      this.velocity.limit(Infinity,200/this.velocity.length())
      console.log(this.velocity.length())
    }
    if(this.velocity.length()>175){
      this.velocity.multiplyScalar(0.9)
    }
    if(this.velocity.length()<2 && friction){
      this.velocity.multiplyScalar(0)
    }
    if(this.position.distance(this.getClosestWall())<this.radius){
      this.simpleBounce(this.getClosestWall(), 0.1)
    }
    let center = Universals.bounds.clone().multiplyScalar(0.5)
    if(this.position.distance(center)>this.getClosestWall().distance(center)){
      this.position.subtract(
        this.position.clone().subtract(this.getClosestWall())
      )
    }

    this.position.add(
      this.velocity.clone().multiplyScalar(Universals.delta)
    )

    for(let p in planets){
      let planet = planets[p]
      if(seperation(this, planet) < 0){
        this.simpleBounce(planet.position,planet.radius )
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
          continue;
        }
          let i:number = (-(0.6) * vn) / (im1 + im2);
          let impulse:Victor = mtd.clone().multiplyScalar(i);
          this.velocity.add(impulse.clone().multiplyScalar(im1));
          ball.velocity.subtract(impulse.clone().multiplyScalar(im2))
          playSound(impulse.length()/5000)

      }
    }
    return (this.velocity.length()<1)
  }
}
