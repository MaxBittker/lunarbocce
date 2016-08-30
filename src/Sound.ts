let sound = new Audio('sounds/b2b1.wav')
let click = new Audio('sounds/click.wav')
let adign = new Audio('sounds/ading.wav')
let dings = [
  new Audio('sounds/ading.wav'),
  new Audio('sounds/ding0.wav'),
  new Audio('sounds/ding1.wav'),
  new Audio('sounds/ding2.wav'),
  new Audio('sounds/ding3.wav'),
]
const playSound = (volume:number)=>{
  volume-= 0.2
  if(volume>0.2 && (sound.currentTime>0.01||sound.currentTime===0)){
    // sound.pause(); // Perhaps optional
    sound.currentTime = 0;
    sound.volume = Math.min(1,volume)
    sound.play()
  }
}
const playClick = (speed:number)=>{
  // volume-= 0.2
  // if(volume>0.2 && (sound.currentTime>0.01||sound.currentTime===0)){
    // sound.pause(); // Perhaps optional
    click.playbackRate = 1.1
    click.volume = Math.min(1,0.7)
    click.play()
  // }
}
const playDing = (n:number)=>{
    dings[n].play()
}


export {playSound,playClick,playDing}
