// 2020 0206 0157-0800 Anwar Hahj Jefferson-George

// filter features according to a list of acceptable unit types
export function filterFeaturesByUnittype(goodtypesarr, {features}){
  return features.filter(({properties}) => goodtypesarr.includes(properties.UNIT_TYPE))
}

// filter features according to a given unit name string or regular expression
export function filterFeaturesByUnitname(unitnameregexorstr, {features}){
  return features.filter(({properties}, i, arr) => (unitnameregexorstr instanceof RegExp) 
    ? unitnameregexorstr.test(properties.UNIT_NAME)
    : properties.UNIT_NAME === unitnameregexorstr 
  )
}
// console.log(filterFeaturesByUnitname(/canyon/gi, json))
