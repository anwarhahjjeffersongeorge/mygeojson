import { getGeoJSON } from './getGeoJSON.mjs'
import { writeGeoJSON } from './writeGeoJSON.mjs'
import { analyzeUnitTypes } from './analyze.mjs'
import { filterFeaturesByLatitude, filterFeaturesByLongitude} from './coordinatefiltering.mjs'
import {filterFeaturesByUnitname, filterFeaturesByUnittype} from './propertyfiltering.mjs'



const defaults = {
  filterparameters: {
    longitudes: [-102.04, +172.44],
    unittypes: ['National Monument', 'National Reserve', 'Park & Wilderness', 'Preserve & Wilderness', 'National Park'],  
    // unitname: 'Grand Canyon'
  }
  
}

async function sanitizeGeoJSONByLongitude(longitudes, geojsonsrcfile, datasetsubdir) {
  return sanitizeGeoJSON({longitudes}, geojsonsrcfile, datasetsubdir)
}

async function sanitizeGeoJSON(filterparameters, geojsonsrcfile, datasetsubdir) {
  const {longitudes, latitudes, unitname, unittypes} = filterparameters
  var json = await getGeoJSON(geojsonsrcfile, datasetsubdir)
  // console.log(analyzeUnitTypes(json))
  
  console.log(`Unfiltered features length: ${json.features.length}`)
  if (longitudes){
    json.features = filterFeaturesByLongitude(longitudes, json)
  }
  console.log(`Longitude-filtered features length: ${json.features.length}`)
  if (latitudes){
    json.features = filterFeaturesByLatitude(latitudes, json)
  }
  console.log(`Latitude-filtered features length: ${json.features.length}`)
  // console.log([...analyzeUnitTypes(json).keys()])
  if (unittypes){
    json.features = filterFeaturesByUnittype(unittypes, json)
  }
  console.log(`UNIT_TYPE-filtered features length: ${json.features.length}`)
  if (unitname){
    json.features = filterFeaturesByUnitname(unitname, json)
  }
  console.log(`UNIT_NAME-filtered features length: ${json.features.length}`)
  
  // console.log(json.features[0].geometry.coordinates)
  writeGeoJSON(json)
}


sanitizeGeoJSON(defaults.filterparameters)
