function leaderboardAddOrEditRaceDay(){
  if (warning('Add Race Day')){return NaN}
  constants = new SailingConstants()
  searchRange = constants.searchRange
  leaderboardCheckFormat(searchRange)
  setVariables(searchRange,true)

  // Get and process race day
  if (raceDay == ''){error('Add Race Day: Blank race day is invalid.')}
  if (raceDay instanceof Date){
    raceDay = Utilities.formatDate(raceDay,'GMT',"MMM dd")
    if (raceDay[4] == '0'){raceDay = raceDay.slice(0,4) + raceDay.slice(5)}
  } else if (typeof(raceDay) == 'number'){
    raceDay = raceDay.toString()
  }

  // Get sheets
  sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function(value){return value.getName()})
  sheets = sheets.filter(function(value){
    if (compareValues(value,'instructions') || compareValues(value,'leaderboard')){return false}
    return true
  })

  // Check race day against sheets
  if (!sheets.includes(raceDay)){error("Add Race Day: Couldn't find race day.")}

  // Get and process results from race day
  raceDayResultsColumn = constants.raceDayResultsColumn
  raceDayResults = getData(2,raceDayResultsColumn,searchRange,true,raceDay).filter(function(value){
    if(valueInArray(value,sailors)){return true}
    return false
  })

  results = getResults()

  addingRace = false
  if (!valueInArray(raceDay,races)){
    toast(`Add Race Day: Adding ${raceDay}`)
    addingRace = true
    races.push(raceDay)
    numRaces += 1
  } else{
    toast(`Add Race Day: Editing ${raceDay}`)
  }
  for (i = 0; i < numSailors; i++){
    sailor = sailors[i]
    sailorIndex = indexOfSailorInResults(sailor,results)
    if (valueInArray(sailor,raceDayResults)){sailorResult = indexOfValueInArray(sailor,raceDayResults)+1}
    else{sailorResult = `${numSailors+1} (DNF)`}
    if (addingRace){results[sailorIndex].results.push(sailorResult)}
    else{results[sailorIndex].results[indexOfValueInArray(raceDay,races)] = sailorResult}
  }

  insertResults(tiebreak(score(results)))
}

function leaderboardAllRaceDays(){
  function leaderAllRaceDaysHelper(raceDayResults){
    for (i = 0; i < numSailors; i++){
    sailor = sailors[i]
    sailorIndex = indexOfSailorInResults(sailor,results)
    if (valueInArray(sailor,raceDayResults)){sailorResult = indexOfValueInArray(sailor,raceDayResults)+1}
    else{sailorResult = `${numSailors+1} (DNF)`}
    results[sailorIndex].results.push(sailorResult)}
  }

  if (warning('Add All Race Days')){return NaN}
  leaderboardCheckFormat()
  constants = new SailingConstants()
  searchRange = constants.searchRange
  setVariables(searchRange,true)

  // Get sheets
  sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function(value){return value.getName()})
  sheets = sheets.filter(function(value){
    if (compareValues(value,'instructions') || compareValues(value,'leaderboard')){return false}
    return true
  })

  raceDayResultsColumn = constants.raceDayResultsColumn

  // Get and clear results
  results = getResults()
  for (i = 0; i < numSailors; i++){
    results[i].total = 0
    results[i].results = []
  }
  races = []

  raceDayResultsColumn = constants.raceDayResultsColumn
  sheets.forEach(function(value){
    if (compareValues(value,'instructions') || compareValues(value,'leaderboard')){return NaN}
    raceDayResults = getData(2,raceDayResultsColumn,searchRange,true,value).filter(function(value){
      if(valueInArray(value,sailors)){return true}
      return false
    })
    races.push(value)
    leaderAllRaceDaysHelper(raceDayResults)
  })
  numRaces = races.length

  insertResults(tiebreak(score(results)))
}
