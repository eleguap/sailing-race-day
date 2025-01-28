class SailorResult {
  constructor(sailor,total,results){
    this.sailor = sailor
    this.total = total
    this.results = results
  }
}

class SailingConstants {
  constructor(){
    //General
    this.searchRange = 40
    this.backgroundColor = '#cfe2f3'
    this.borderColor = '#4a86e8'

    // Race Day
    this.raceDaySailorsColumn = 1
    this.raceDayAddOrEditRaceColumn = 4
    this.raceDayEditResultColumn = 9
    this.raceDayResultsColumn = 15
    this.raceDayPursuitDrillColumn = 2
    this.raceDayPursuitDrillCheckboxRow = 9
    this.raceDayHeaders = ['Sailors','','','Results','Race Number','Starting Order','','','Sailor','Race','Result','','','','Sailors','Total']

    // Leaderboard
    this.leaderboardSailorsColumn = 1
    this.leaderboardAddRaceDayColumn = 4
    this.leaderboardEditResultColumn = 7
    this.leaderboardResultsColumn = 13
    this.leaderboardHeaders = ['Sailors','','','Day','','','Sailor','Day','Result','','','','Sailors','Total']
  }
}

function setVariables(searchRange = 40, leaderboard = false){
  constants = new SailingConstants
  backgroundColor = constants.backgroundColor
  borderColor = constants.borderColor

  if (leaderboard){
    correctHeaders = constants.leaderboardHeaders
    sailors = getData(2,constants.leaderboardSailorsColumn,searchRange)
    numSailors = sailors.length
    races = getData(1,constants.leaderboardResultsColumn+2,searchRange,false)
    numRaces = races.length
    if(numRaces){races = getRange(1,constants.leaderboardResultsColumn+2,1,numRaces)[0]}
    races = races.map(function(value){
      if (value instanceof Date){
        value = Utilities.formatDate(value,'GMT','MMM dd')
        if (value[4] == '0'){return value.slice(0,4) + value.slice(5)}
      }
      return value
    })
    racesColumn = constants.leaderboardResultsColumn+2
    resultsColumn = constants.leaderboardResultsColumn

    raceDay = getCell(2,constants.leaderboardAddRaceDayColumn)

    inputs = getRange(2,constants.leaderboardEditResultColumn,1,3)[0]
    inputNames = ['Sailor','Day','Result']
  } else{
    correctHeaders = constants.raceDayHeaders
    sailors = getData(2,constants.raceDaySailorsColumn,searchRange)
    numSailors = sailors.length
    races = getData(1,constants.raceDayResultsColumn+2,searchRange,false)
    numRaces = races.length
    if (numRaces){races = getRange(1,constants.raceDayResultsColumn+2,1,numRaces)[0]}
    racesColumn = constants.raceDayResultsColumn+2
    resultsColumn = constants.raceDayResultsColumn

    newResults = getData(2,constants.raceDayAddOrEditRaceColumn,numSailors)
    raceNumber = getCell(2,constants.raceDayAddOrEditRaceColumn+1)
    startingOrder = flattenArray(getRange(2,6,constants.raceDayAddOrEditRaceColumn+2,1))

    inputs = getRange(2,constants.raceDayEditResultColumn,1,3)[0]
    inputNames = ['Sailor','Race','Result']
  }
}

function indexOfSailorInResults(sailor,results){
  for (j = 0; j < results.length; j++){
    if (compareValues(results[j].sailor,sailor)){
      return j
    }
  }
  return -1
}

function ifPursuitDrill(){
  constants = new SailingConstants

  return SpreadsheetApp.getActiveSheet().getRange(constants.raceDayPursuitDrillCheckboxRow,constants.raceDayPursuitDrillColumn).isChecked()
}

function getResults(){
  // Needs setVariables() to have been called
  // Inital results
  results = []
  for (i = 0; i < numSailors; i++){
    result = getRange(2+i,resultsColumn,1,2+numRaces)[0]
    results.push(new SailorResult(result[0],result[1],result.slice(2)))
  }

  // Processing sailors in results
  results = results.filter(function(value){
    if (value.sailor == ''){
      return false
    }
    if (!valueInArray(value.sailor,sailors)){
      return false
    }
    return true
  })

  // Adding sailors that aren't listed in results
  sailorsInResults = results.map(function(value){return value.sailor})
  for (i = 0; i < numSailors; i++){
    if (!valueInArray(sailors[i],sailorsInResults)){
      results.push(new SailorResult(sailors[i],(numSailors+1)*numRaces,new Array(numRaces).fill(`${numSailors+1} (DNF)`)))
    }
  }

  // Processing individual results and calculating totals
  for (i = 0; i < results.length; i++){
    results[i].results = results[i].results.map(function(value){
      if (typeof(value) == 'string' && (value.slice(0,-6) == '' || isNaN(Number(value.slice(0,-6))))){
        return `${numSailors+1} (DNF)`
      }
      return value
    })
  }

  results = score(results)

  return results
}

function insertResults(results){
  // Building input
  input = [['','Sailors','Total'].concat(races)]
  for (i = 0; i < numSailors; i++){
    input.push([i+1].concat([results[i].sailor],[results[i].total],results[i].results))
  }

  // Clear area
  sheet = SpreadsheetApp.getActiveSheet()
  sheet.getRange(2,resultsColumn-1,sheet.getMaxRows()-(resultsColumn-1),sheet.getMaxColumns()-2).clear()

  // Set results
  setRange(1,resultsColumn-1,1+numSailors,3+numRaces,input)
}
