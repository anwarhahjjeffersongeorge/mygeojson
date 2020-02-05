// 2020 0205 1525-0800 Anwar Hahj Jefferson-George
// get a filter function for filtering geometry elements of an array by whether their i-indexed coordinates are beyond the range [bound0, bound1]
export function coordinateFilterer(bound0, bound1, index) {
  return ({geometry}, i, arr) => {
    const {coordinates} = geometry
    let ok = true
    loop1:
    for (var coordset of coordinates) { // there might be multiple coordinates in a set thanks to geojson's mltipart geometries
      for (var pairs of coordset) {
        // console.log(pairs)
        for (var pair of pairs) {
          const num = pair[index]
          if (num < bound0 || num > bound1) {
            ok = false
            break loop1 
          }
        }
      }
    }
    return ok
  }
}

// filter geometry elements of a features member by latitudes
export function filterFeaturesByLatitude(boundsarr, {features}){
  const [y0, y1] = boundsarr
  return features.filter(coordinateFilterer(y0, y1, 1))
}
// filter geometry elements of a features member by longitudes
export function filterFeaturesByLongitude(boundsarr, {features}){
  const [x0, x1] = boundsarr
  return features.filter(coordinateFilterer(x0, x1, 0))
}
function testcoordfilt() {
  const bound = 10
  const boundsarr = [-bound, +bound]
  const goodbounds = Array(5).fill(0).map(v => (bound / 2) * Math.random())
  const badbounds = Array(5).fill(0).map(v => (bound * 2) * Math.random())
  const goodlats = goodbounds.map(y => [null, y])
  const badlats = badbounds.map(y => [null, y])
  const goodlongs = goodbounds.map(x => [x, null])
  const badlongs = badbounds.map(x => [x, null])

  const testobj = {
    features: [
      {
        geometry: {
          name: 'geowithbadlats',
          coordinates: [
            [badlats]
          ]
        }
      },
      {
        geometry: {
          name: 'geowithbadlongs',
          coordinates: [
            [badlongs]
          ]
        }
      },
      {
        geometry: {
          name: 'geowithgoodlongs',
          coordinates: [
            [goodlongs]
          ]
        }
      },
      {
        geometry: {
          name: 'geowithgoodlats',
          coordinates: [
            [goodlats]
          ]
        }
      }
    ]
  }
  console.log('testobj features')
  console.log(testobj.features)
  console.log('latitude filtered features')
  console.log(filterFeaturesByLatitude(boundsarr, testobj))
  console.log('longitude filtered features')
  console.log(filterFeaturesByLongitude(boundsarr, testobj))
}
// testcoordfilt()
