import { BaseEvent, OtherEventEnum } from ".";

export const distorsion = new BaseEvent({
  turn: 4,
  type: OtherEventEnum.DISTORSION,
}, {

})

export const gravity = new BaseEvent({
  turn: 4,
  type: OtherEventEnum.GRAVITY,
}, {
  
})

export const wonderRomm = new BaseEvent({
  turn: 5,
  type: OtherEventEnum.WONDER_ROMM,
}, {
  
})

export const magicRoom = new BaseEvent({
  turn: 5,
  type: OtherEventEnum.MAGIC_ROMM,
}, {
  
})

export const safeguard = new BaseEvent({
  turn: 4,
  type: OtherEventEnum.SAFEGUARD,
}, {
  
})

export const mist = new BaseEvent({
  turn: 5,
  type: OtherEventEnum.MIST,
}, {
  
})
