function score(results){
  // Redress handling
  for (i = 0; i < results.length; i++){
    average = 0
    numRedress = 0
    results[i].results = results[i].results.map(function(value){
      if (compareValues(value,'Redress')){numRedress += 1;return 'Redress'}
      if (typeof(value) == 'string' && compareValues(value.slice(-5),'(RED)')){numRedress += 1;return 'Redress'}
      if (typeof(value) == 'string'){average += Number(value.slice(0,-6))}
      else{average += value}
      return value
    })
    if (numRedress && results[i].results.length == numRedress){error(`Score: Too many redresses for ${results[i].sailor}`)}
    average /= results[i].results.length-numRedress
    results[i].results = results[i].results.map(function(value){
      if (compareValues(value,'Redress')){return `${average} (RED)`}
      return value
    })
  }

  for (i = 0; i < results.length; i++){
    results[i].total = 0
    results[i].results.forEach(function(value){
      if (typeof(value) == 'string'){
        results[i].total += Number(value.slice(0,-6))
      } else{
        results[i].total += value
      }
    })
  }

  return results
}

function tiebreak(results){
  console.log(results)

  results = results.sort(function(a,b){
    // Totals
    if (a.total - b.total != 0){return a.total - b.total}

    // Head-to-head
    ret = 0
    for (i = 0; i < a.results.length; i++){
      aResult = a.results[i]
      bResult = b.results[i]
      if (typeof(aResult) == 'string'){aResult = Number(aResult.slice(0,-6))}
      if (typeof(bResult) == 'string'){bResult = Number(bResult.slice(0,-6))}

      if (aResult < bResult){ret -= 1}
      if (aResult > bResult){ret += 1}
    }
    if (ret != 0){return ret}

    // High place
    aResults = a.results.map(function(value){
      if (typeof(value) == 'string'){return Number(value.slice(0,-6))}
      return value
    }).sort(function(a,b){return a-b})
    bResults = b.results.map(function(value){
      if (typeof(value) == 'string'){return Number(value.slice(0,-6))}
      return value
    }).sort(function(a,b){return a-b})

    for (i = 0; i < a.results.length; i++){
      if (aResults[i] < bResults[i]){return -1}
      if (aResults[i] > bResults[i]){return 1}
    }
    return 0
  })

  if (ifPursuitDrill()){
    results = results.reverse()
  }

  return results
}
