function leaderboardScore(){
  if (warning('Score')){return NaN}
  constants = new SailingConstants()
  searchRange = constants.searchRange
  leaderboardCheckFormat(searchRange)

  // Set variables
  setVariables(searchRange,true)

  insertResults(tiebreak(score(getResults(searchRange))))
}

function leaderboardEditResult(){
  if (warning('Edit Result')){return NaN}
  constants = new SailingConstants()
  searchRange = constants.searchRange
  leaderboardCheckFormat(searchRange)

  // Set variables
  setVariables(searchRange,true)

  // Getting and checking inputs
  sailor = inputs[0]
  day = inputs[1]
  resultInput = inputs[2]
  for (i = 0; i < inputs.length; i++){
    if (inputs[i] == ''){error(`Edit Result: ${inputNames[i]} input is empty.`)}
  }
  if (!valueInArray(sailor,sailors)){error(`Edit Result: '${sailor}' is not in sailors listed.`)}

  if (day instanceof Date){
    day = Utilities.formatDate(day,'GMT','MMM dd')
    if (day[4] == '0'){return day.slice(0,4) + day.slice(5)}
  }
  if (!valueInArray(day,races)){error(`Edit Result: ${day} is not in race days listed.`)}
  if (typeof(resultInput) == 'string' && !compareValues(resultInput,'redress') && (resultInput.slice(0,-6) == '' || isNaN(Number(resultInput.slice(0,-6))))){error(`Edit Result: Result '${resultInput}' is invalid.`)}

  results = getResults()

  // Replace results
  sailorIndex = indexOfSailorInResults(sailor,results)
  if (typeof(resultInput) == 'string' && compareValues(resultInput,'redress')){
    results[sailorIndex].results[indexOfValueInArray(day,races)] = 'Redress'
  } else{
    results[sailorIndex].results[indexOfValueInArray(day,races)] = resultInput
  }

  insertResults(tiebreak(score(results)))
}
