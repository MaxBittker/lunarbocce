let sound = new Audio('sounds/b2b1.wav')

const playSound = (volume:number)=>{
  if(volume>0.2 && (sound.currentTime>0.01||sound.currentTime===0)){
  sound.pause(); // Perhaps optional
  sound.currentTime = 0;
  sound.volume = Math.min(1,volume)
  sound.play()
  }
}

export default playSound
