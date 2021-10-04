import { cardetail, socketConnection, newsFeed, user, dylink, addnotification, setnotification } from './actiontype';

const carD = (car) => ({
  type: cardetail,
  cars: car
})

const socketF = (s) => ({
  type: socketConnection,
  so: s
})

const newsFeedR = (r) => ({
  type: newsFeed,
  reload: r
})

const userP = (u) => ({
  type: user,
  user: u
})

const dylinkF = (l) => ({
  type: dylink,
  dylink: l
})
const AddNotification=(add)=>({
  type:addnotification,
  addnotification:add

})
const SetNotification=(set)=>({
  type:setnotification,
  setnotification:set
})

export { carD, socketF, newsFeedR, userP, dylinkF, AddNotification, SetNotification }