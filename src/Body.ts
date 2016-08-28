interface Body {
  position: Victor;
  velocity: Victor;
  mass: number;
  radius: number;
  color: string;
}

const seperation:(a: Body, b:Body)=>number =
  (a:Body, b:Body):number=>{
      return (a.position.distance(b.position)) - (a.radius+b.radius)
  }

export default Body

export {Body,seperation}
