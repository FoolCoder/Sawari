import { cardetail, socketConnection, newsFeed, user, dylink } from './actiontype';

const initialState = {
  cardetails: [],
  socket: undefined,
  reload: false,
  user: { userDetails: { image: '' } },
  dyL: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case cardetail:
      return {
        ...state,
        cardetails: state.cardetails.concat(action.cars)
      }
    case socketConnection:
      return {
        ...state,
        socket: action.so
      }
    case newsFeed:
      return {
        ...state,
        reload: action.reload
      }
    case user:
      return {
        ...state,
        user: action.user
      }
    case dylink:
      return {
        ...state,
        dyL: action.dylink
      }
    default:
      return state
  }
}