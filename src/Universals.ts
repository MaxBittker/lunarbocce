import tinycolor = require('tinycolor2');

export default {
  delta : 0.1,
  width: 800,
  height : 800,
  teamColors: {
    "boccino": 'white',
    "red":  tinycolor('red').toRgbString(),
    "green": tinycolor('green').toRgbString(),
  }
}
