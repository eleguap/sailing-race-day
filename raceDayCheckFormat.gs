function raceDayCheckFormat(){
  constants = new SailingConstants()
  searchRange = constants.searchRange
  setVariables(searchRange)

  // Checking headers
  correctHeadersLength = correctHeaders.length
  actualHeaders = getRange(1,1,1,correctHeadersLength)[0]
  for(i = 0; i < correctHeadersLength; i++){
    if (!compareValues(correctHeaders[i],actualHeaders[i])){
      if (actualHeaders[i] == ''){
        error(`Check Format: A column in the header row is incorrectly empty. '${correctHeaders[i]}' is expected.`)
      } else if (correctHeaders[i] == ''){
        error(`Check Format: An empty cell in the header row is expected instead of '${actualHeaders[i]}'.`)
      } else{
        error(`Check Format: ${correctHeaders[i]} is expected in the header row  instead of '${actualHeaders[i]}'.`)
      }
    }
  }

  // Checking sailors
  if (numSailors == 0){
    error(`Check Format: No sailors detected.`)
  }
  processedSailors = sailors.map(function(value){
    if (value == 'string'){processedSailors.push(value.toLowerCase().replaceAll(" ",""))}
    return value
  })
  for (i = 0; i < numSailors; i++){
    if (processedSailors.indexOf(processedSailors[i]) != processedSailors.lastIndexOf(processedSailors[i])){
      error(`Check Format: Duplicates detected in sailors.`)
    }
  }

  // Checking race titles
  if (numRaces){
    for (i = 0; i < numRaces; i++){
      if (races[i] == ''){error(`Check Format: An empty cell is invalid.`)}
      if (races[i].slice(0,5) != 'Race '){error(`Check Format: ${races[i]} is not formatted correctly.`)}
      if (!Number(races[i].slice(5))){error(`Check Format: ${races[i]} is not formatted correctly.`)}
      if (races[i].slice(5) != i+1){error(`Check Format: ${races[i]} is not in order.`)}
    }
  }
}
