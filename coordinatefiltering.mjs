// 2020 0205 1525-0800 Anwar Hahj Jefferson-George

// get a filter function for filtering geometry elements of an array by whether their r-indexed coordinates are within the bound
export function coordinateFilterer(boundarr, r) {
  // console.log(boundarr)
  const isWithinAnyBounds = (c) => {
    let res = false
    for (var [b0, b1] of boundarr) {
      const thisres = (c >= b0 && c <= b1)
      // console.log(`checking if ${c} within bounds [${b0}, ${b1}]: ${thisres}`)
      res = res || thisres
    }
    return res
  }
    
  return ({geometry}, i, arr) => {
    const {coordinates} = geometry
    let ok = true
    loop1:
    for (var coordset of coordinates) { // there might be multiple coordinates in a set thanks to geojson's multipart geometries
      // console.log(coordset)
      for (var pair of coordset) {
        const num = pair[r]
        if (!isWithinAnyBounds(num)) {
          ok = false
          break loop1 
        }
      }
    }
    return ok
  }
}
function sortAscending(arr) {
  return arr.sort((a, b) => a - b)
}

// filter geometry elements of a features member by latitudes
export function filterFeaturesByLatitude(boundsarr, {features}){
  // const [y0, y1] = boundsarr
  return features.filter(coordinateFilterer([sortAscending(boundsarr)], 1))
}
// filter geometry elements of a features member by longitudes
export function filterFeaturesByLongitude(boundsarr, {features}){
  const {sign} = Math
  const [x0, x1] = boundsarr
  const maxlong = 180
  const xbounds = []
  if (sign(x0)===-1 && sign(x1)===1) {
    xbounds.push([-maxlong, x0])
    xbounds.push([x1, maxlong])
  } else if (sign(x0)===1 && sign(x1)===-1) {
    xbounds.push([x1, x0])
  } else if (sign(x0) === sign(x1)){
    xbounds.push(sortAscending([x0,x1]))
  }
  return features.filter(coordinateFilterer(xbounds, 0))
}
