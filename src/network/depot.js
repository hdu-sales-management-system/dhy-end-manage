import request from './base'

export function getDepots (params) {
  return request.get('/depot', {
    params
  })
}

export function itemUpshelf (item) {
  return request.post('/presents/', item)
}
