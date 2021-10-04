import io from 'socket.io-client/dist/socket.io'

import { link } from '../links/links'

export const socket = (id, token) => {
  // console.log(id, token, link)
  return io(link, {
    query: { userId: id, token: token },
    transports: ['websocket']
  });
}