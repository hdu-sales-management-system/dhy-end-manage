import request from './base'

export function getPresents(params) {
  return request.get('/presents',{params})
}

export function delPresent(id) {
  return request.delete('/presents/' + id)
}

export function updPresent(present) {
  const {
      id,
      title,
      status,
      off,
      offcost,
      hot,
      count,
      description,
      originl_price,
      price,
      cover,
      categorystr,
      saleCount,
  } = present
  return request.put('/presents/' + id, {
    id,
    title,
    status,
    off,
    offcost,
    hot,
    count,
    description,
    originl_price,
    price,
    cover,
    categorystr,
    saleCount,
  })
}