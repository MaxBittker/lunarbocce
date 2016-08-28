// a special import statement to require node modules...
import Universals from "./Universals";
import Game from "./Game";
import Victor = require('victor')

export default class Control {

  private canvas: HTMLCanvasElement;
  private game: Game;
  public startDrag: Victor;
  public mousePos: Victor;

  constructor(canvas: HTMLCanvasElement,game:Game) {
    this.canvas = canvas
    this.game = game
    canvas.onmousedown = (e)=>{
      this.startDrag = new Victor(e.offsetX,e.offsetY)
    }
    canvas.onmousemove = (e)=>{
      this.mousePos = new Victor(e.offsetX,e.offsetY)
    }
    canvas.onmouseup = (e)=>{
      this.game.launch(this.startDrag,this.mousePos)
      this.startDrag = undefined
    }
  }


}
