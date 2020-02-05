//sanitize the geojson 
import { join, format } from 'path'
import { promises as fsp } from 'fs' 

const defaults = {
  geojsondir: 'geojson',
  datasetsubdir: 'nps_boundary_geojson',
  geojsonsrcfile: 'nps_boundary'
}

export async function getGeoJSON(geojsonsrcfile = defaults.geojsonsrcfile, datasetsubdir = defaults.datasetsubdir) {
  const geojsonpth = join(defaults.geojsondir, datasetsubdir)
  const ext = '.geojson'
  const target = format({
    dir: geojsonpth,
    name: geojsonsrcfile,
    ext
  })
  let filehandle = null // this is the FileHandle object (https://nodejs.org/api/fs.html#fs_class_filehandle)
  let json = null
  try {
    // we will try to open the json file
    await fsp.open(target, 'r')
      .then(fh => {
        // if we succeed, we'll get a FileHandle object
        filehandle = fh 
        return fsp.readFile(filehandle)
      })
      .then(async (fileContents) => {
        json = await JSON.parse(fileContents)
        // console.log(json) //we can enable this to look at the json 
      })
  } catch (e) {
    // if errors happen here, we don't want to handle them. we 
    // won't be able to do anything further if this step fails anyhow
    throw e
  } finally {
     //console.log(filehandle)
     // here, we should close any open file handle
     if (filehandle) {
       await filehandle.close()
     }  
  }  
  return json
}

// getGeoJSON()
