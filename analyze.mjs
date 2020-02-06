// 2020 0205 1525-0800 Anwar Hahj Jefferson-George


//find the unique unit types in an object
export function analyzeUnitTypes({features}){
  const res = new Map() // map of the analysise results
  const getTemplate = () => ({
    count: 0,
    unitnames: [] 
  }) // each result should include some predetermined infos
  const addRecord = (res, UNIT_TYPE, UNIT_NAME) => {
    const o = res.get(UNIT_TYPE)
    o.unitnames.push(UNIT_NAME)
    o.count++
  }
  for (let featureentry of features){
    const {UNIT_TYPE, UNIT_NAME} = featureentry.properties
    if(UNIT_TYPE && !res.has(UNIT_TYPE)){ // don't allow empty strings
      res.set(UNIT_TYPE, getTemplate())
      addRecord(res, UNIT_TYPE, UNIT_NAME)
    } else if (res.has(UNIT_TYPE)){
      addRecord(res, UNIT_TYPE, UNIT_NAME)
    } 
    
  }
  return res
}
