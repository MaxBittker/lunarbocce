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

    canvas.ontouchstart = (e)=>{
      this.startDrag = this.getXY(e)
      console.log(this.startDrag)
      e.preventDefault()
    }

    canvas.onmousedown = (e)=>{
      this.startDrag = this.getXY(e)
    }
    //move
    document.ontouchmove = (e)=>{
      this.mousePos = this.getXY(e)//new Victor(e.touches[0].clientX-this.canvas.offsetLeft,e.touches[0].clientY-this.canvas.offsetTop)
      e.preventDefault()
    }
    document.body.onmousemove = (e)=>{
      this.mousePos = this.getXY(e)
    }
    //end
    document.body.ontouchend = (e)=>{
      this.game.launch(this.startDrag,this.mousePos)
      this.startDrag = undefined
      e.preventDefault()
    }
    document.body.onmouseup = (e)=>{
      this.game.launch(this.startDrag,this.mousePos)
      this.startDrag = undefined
    }
  }
  getXY(e){
    let clientP: Victor
    if(e.touches){
      clientP = new Victor(e.touches[0].clientX, e.touches[1].clientY)
    }else{
      clientP = new Victor(e.clientX, e.clientY)
    }
    let rect = this.canvas.getBoundingClientRect() /// get absolute rect. of canvas
    let offset = new Victor(rect.left,rect.top)
    let scale = new Victor((Universals.bounds.x/this.canvas.scrollWidth), (Universals.bounds.y/this.canvas.scrollHeight))
    clientP.subtract(offset)
    clientP.multiply(scale)
    return clientP                         /// return object
  }


}
