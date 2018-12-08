import request from './base'

export function getDepots(params) {
  return request.get('/depot', {
    params
  })
}
