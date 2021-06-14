import { cardetail, socketConnection, newsFeed, user, dylink } from './actiontype';

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

export { carD, socketF, newsFeedR, userP, dylinkF }