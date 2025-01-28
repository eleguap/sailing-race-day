function raceDayScore(){
  // Format check and warning
  if (warning('Score')){return NaN}
  constants = new SailingConstants()
  searchRange = constants.searchRange
  raceDayCheckFormat(searchRange)

  // Set variables
  setVariables(searchRange)

  insertResults(tiebreak(score(getResults(searchRange))))
}

function raceDayEditResult(){
  // Format check and warning
  if (warning('Edit Result')){return NaN}
  constants = new SailingConstants()
  searchRange = constants.searchRange
  raceDayCheckFormat(searchRange)

  // Set variables
  setVariables(searchRange)

  // Getting and checking inputs
  sailor = inputs[0]
  race = inputs[1]
  resultInput = inputs[2]
  for (i = 0; i < inputs.length; i++){
    if (inputs[i] == ''){error(`Edit Result: ${inputNames[i]} input is empty.`)}
  }
  if (!valueInArray(sailor,sailors)){error(`Edit Result: '${sailor}' is not in sailors listed.`)}
  if (typeof(race) != 'number' || race <= 0 || race > race.length){error(`Edit Result: Race ${race} is invalid.`)}
  if (typeof(resultInput) == 'string' && !compareValues(resultInput,'redress') && (resultInput.slice(0,-6) == '' || isNaN(Number(resultInput.slice(0,-6))))){error(`Edit Result: Result '${resultInput}' is invalid.`)}

  results = getResults()

  // Replace results
  sailorIndex = indexOfSailorInResults(sailor,results)
  if (typeof(resultInput) == 'string' && compareValues(resultInput,'redress')){
    results[sailorIndex].results[race-1] = 'Redress'
  } else{
    results[sailorIndex].results[race-1] = resultInput
  }

  insertResults(tiebreak(score(results)))
}
