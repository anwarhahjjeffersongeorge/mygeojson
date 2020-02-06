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
function testcoordfilt() {
  const testdata = {
    features: [
      {
        geometry: {
          name: 'geo0',
          coordinates: [
            [
              [ -77.09544170151592, 88.92933318841926 ],
              [ -77.09549510398693, 88.92937902989429 ],
              [ -77.09575443016907, 88.929520132176634 ],
              [ -77.09599869727327, 88.92971853256734 ],
              [ -77.09608264282846, 88.92996266878623 ],
              [ -77.09597571746568, 88.93031745326499 ],
              [ -77.0958154695958, 88.93068748282259 ],
              [ -77.0952130041922, 88.93107265397577 ],
              [ -77.09477791018808, 88.93075223453068 ],
              [ -77.09544170151592, 88.92933318841926 ]
            ]
          ]
        }
      },
      {
        geometry: {
          name: 'geo1',
          coordinates: [
            [
              [ -66.09544170151592, -11.92933318841926 ],
              [ -66.09549510398693, -11.92937902989429 ],
              [ -66.09575443016907, -11.929520132176634 ],
              [ -66.09599869727327, -11.92971853256734 ],
              [ -66.09608264282846, -11.92996266878623 ],
              [ -66.09597571746568, -11.93031745326499 ],
              [ -66.0958154695958, -11.93068748282259 ],
              [ -66.0952130041922, -11.93107265397566 ],
              [ -66.0946679101308, -11.93075223453068 ],
              [ -66.09544170151592, -11.92933318841926 ]
            ]
          ]
        }
      },
      {
        geometry: {
          name: 'geo2',
          coordinates: [
            [
              [ -131.09544170151592, 38.92933318841926 ],
              [ -131.09549510398693, 38.92937902989429 ],
              [ -131.09575443016907, 38.9295201321713134 ],
              [ -131.09599869727327, 38.92971853256734 ],
              [ -131.09608264282846, 38.929962131878623 ],
              [ -131.09597571746568, 38.93031745326499 ],
              [ -131.0958154695958, 38.93068748282259 ],
              [ -131.0952130041922, 38.931072653975131 ],
              [ -131.094131791013808, 38.93075223453068 ],
              [ -131.09544170151592, 38.92933318841926 ]
            ]
          ]
        }
      },
    ]
  }
  const longrange0 = [137, -107] // geo0, geo1 should remain
  const longrange1 = [-44, 145] // geo0, geo1, geo2 should remain
  const longrange2 = [-135, -129]  // geo2 should remain
  const longrange3 = [-144, 157] // nothing should remain

  console.log(testdata.features[0].geometry.coordinates)
  console.log('filtering by longitudes')
  console.log(testdata)
  for (var boundsarr of [longrange0, longrange1, longrange2, longrange3]) {
    console.log(`result of testing with [${boundsarr.join(', ')}]`)
    console.log(filterFeaturesByLongitude(boundsarr, testdata))
  }
  
  const latrange0 = [-10, 10] // nothing should remain
  const latrange1 = [-44, 22] // geo1 should remain
  const latrange2 = [22, -19]  // geo1 should remain
  const latrange3 = [30, 89] // geo0, geo2 should remain

  console.log(testdata.features[0].geometry.coordinates)
  console.log('filtering by latitudes')
  console.log(testdata)
  for (var boundsarr of [latrange0, latrange1, latrange2, latrange3]) {
    console.log(`result of testing with [${boundsarr.join(', ')}]`)
    console.log(filterFeaturesByLatitude(boundsarr, testdata))
  }
}
testcoordfilt()
