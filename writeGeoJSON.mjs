
import {join, format} from 'path'
import {promises as fsp} from 'fs'

const datestr = (d, joiner='_') => [...new Map([
  ['getUTCFullYear', res => res], 
  ['getUTCMonth', res => `${res}`.padStart(2, '0')], 
  ['getUTCDay', res => `${res}`.padStart(2, '0')], 
  ['getUTCHours', res => `${res}`.padStart(2, '0')], 
  ['getUTCMinutes', res => `${res}`.padStart(2, '0')], 
  ['getUTCSeconds', res => `${res}`.padStart(2, '0')], 
  ['getTimezoneOffset', (res, hrs = res/60) => `${(Math.sign(res)===1) ? '-' : '+'}`+`${hrs}`.padStart(2, '0')] 
]).entries()]
  .map(([fname, fmtfn]) => fmtfn(d[fname]()))
  .join(joiner)

const defaults = {
  outdir: 'sanitized',
}

export async function writeGeoJSON(geojson, outname = datestr(new Date()), outdir = defaults.outdir ) {
  const ext = '.geojson'
  const target = format({
    dir: outdir,
    name: outname,
    ext
  })
  let filehandle = null
  let data = null
  try {
    console.log('stringifying GeoJSON')
    data = await JSON.stringify(geojson)
    console.log('opening file')
    await fsp.open(target, 'wx')
      .then(fh => {
        filehandle = fh
        return fh
      })
      .then(fh => {
        console.log('writing data to file')
        return fsp.writeFile(
          fh, data
        )
      })
  } catch (e) {
    throw e
  } finally {
    if (filehandle) {
      console.log('closing file')
      await filehandle.close()
    }
  }
}
