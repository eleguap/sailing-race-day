function raceDayAddOrEditRace(){
  // Format check and warning
  if (warning('Add/Edit Race')){return NaN}
  constants = new SailingConstants()
  searchRange = constants.searchRange
  raceDayCheckFormat(searchRange)

  // Set variables
  setVariables(searchRange)

  // Checking Race Number input
  if (raceNumber == ''){error("Add/Edit Race: No race number entered.")}
  if (raceNumber > numRaces+1 || raceNumber < 0){error(`Add/Edit Race: Race number '${raceNumber}' is invalid.`)}

  // Build results
  results = getResults(searchRange)
  if (results.length == 0){error(`Add/Edit Race: Something went really wrong.`)}

  // Check starting order
  if (ifPursuitDrill()){
    for (i = 0; i < numSailors; i++){
      if (startingOrder[i] == ''){error("Add/Edit Race: Not enough sailors entered in starting order.")}
      else if (!valueInArray(startingOrder[i],sailors)){
        error(`Add/Edit Race: '${startingOrder[i]}' from starting order not found in sailors listed.`)}
    }
  }

  // Adding/Editing race
  addingRace = false
  if (raceNumber == numRaces+1){
    toast(`Add/Edit Race: Adding Race ${raceNumber}`)
    addingRace = true
    races.push(`Race ${numRaces+1}`)
    numRaces += 1
  } else{
    toast(`Add/Edit Race: Editing Race ${raceNumber}`)
  }
  for (i = 0; i < numSailors; i++){
    sailor = sailors[i]
    sailorIndex = indexOfSailorInResults(sailor,results)
    if (valueInArray(sailor,newResults)){sailorResult = indexOfValueInArray(sailor,newResults)+1}
    else{sailorResult = `${numSailors+1} (DNF)`}
    if (ifPursuitDrill()){
      startingPlace = (indexOfValueInArray(sailor,startingOrder)+raceNumber-1)%numSailors+1
      sailorResult = startingPlace - sailorResult
    }
    if (addingRace){results[sailorIndex].results.push(sailorResult)}
    else{results[sailorIndex].results[raceNumber-1] = sailorResult}
  }

  //Score and tiebreak
  results = tiebreak(score(results))

  // Inputting results
  insertResults(results)
}
