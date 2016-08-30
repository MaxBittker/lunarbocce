import tinycolor = require('tinycolor2');
import Victor = require('victor')

let bounds = new Victor(800,800)

export default {
  delta : 0.1,
  bounds,
  teamColors: {
    "boccino": 'white',
    "red":  tinycolor('red').toRgbString(),
    "green": tinycolor('green').toRgbString(),
  },
  launchPos: new Victor(60,bounds.y-60)
}
