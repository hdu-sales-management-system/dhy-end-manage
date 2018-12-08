import request from './base'

export function getPresents(params) {
  return request.get('/presents',{params})
}