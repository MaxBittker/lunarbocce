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
    //start
    // canvas.addEventListener('ontouchstart',(e)=>{
      // console.log("startdrag")
      // this.startDrag = new Victor(e.touches[0].clientX-this.canvas.offsetLeft,e.touches[0].clientY-this.canvas.offsetTop)
      // console.log(this.startDrag)
      // e.preventDefault()
    // })
    canvas.ontouchstart = (e)=>{
      console.log("startdrag")
      this.startDrag = new Victor(e.touches[0].clientX-this.canvas.offsetLeft,e.touches[0].clientY-this.canvas.offsetTop)
      console.log(this.startDrag)
      e.preventDefault()
    }


    canvas.onmousedown = (e)=>{
      this.startDrag = new Victor(e.offsetX,e.offsetY)
    }
    //move
    document.ontouchmove = (e)=>{
      this.mousePos = new Victor(e.touches[0].clientX-this.canvas.offsetLeft,e.touches[0].clientY-this.canvas.offsetTop)
      e.preventDefault()
    }
    document.body.onmousemove = (e)=>{
      this.mousePos = new Victor(e.clientX-this.canvas.offsetLeft,e.clientY-this.canvas.offsetTop)
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


}
