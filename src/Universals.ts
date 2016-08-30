import tinycolor = require('tinycolor2');
import Victor = require('victor')


export default {
  delta : 0.1,
  bounds: new Victor(800,800),
  teamColors: {
    "boccino": 'white',
    "red":  tinycolor('red').toRgbString(),
    "green": tinycolor('green').toRgbString(),
  }
}
