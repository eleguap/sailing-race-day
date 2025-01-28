function getCell(row,column,sheet = "") {
  if (sheet){
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet).getRange(row,column).getValue()
  }
  return SpreadsheetApp.getActiveSheet().getRange(row,column).getValue()
}

function getRange(row,column,numRows,numColumns,sheet = ""){
  if (sheet){
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet).getRange(row,column,numRows,numColumns).getValues()
  }
  return SpreadsheetApp.getActiveSheet().getRange(row,column,numRows,numColumns).getValues()
}

function setCell(row,column,value,sheet  = ""){
  if (sheet){
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet).getRange(row,column).setValue(value)
  }
  return SpreadsheetApp.getActiveSheet().getRange(row,column).setValue(value)
}

function setRange(row,column,numRows,numColumns,values,sheet = ""){
  if (sheet){
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet).getRange(row,column,numRows,numColumns).setValues(values)
  }
  return SpreadsheetApp.getActiveSheet().getRange(row,column,numRows,numColumns).setValues(values)
}

function toast(message){
  SpreadsheetApp.getActive().toast(message)
}

function error(message){
  throw new Error(message)
}

function warning(message){
  confirm = SpreadsheetApp.getUi().alert(`You are about ${message}. Do you wish to continue?`, SpreadsheetApp.getUi().ButtonSet.YES_NO)
  if (confirm == SpreadsheetApp.getUi().Button.NO){
    return 1
  }
  return 0
}

function getData(row,column,searchRange,vertical = true,sheet = ""){
  if (vertical){
    var data = flattenArray(getRange(row,column,searchRange,1,sheet))
  } else{
    var data = flattenArray(getRange(row,column,1,searchRange,sheet))
  }

  return data.filter(function(value){
    if (typeof(value) == 'string'){
      return !(value.replaceAll(" ","") == "")
    }
    return true
  })
}

function flattenArray(array){
  if (array.length == 0){
    return []
  }
  if (Array.isArray(array[0])){
    return flattenArray(array[0]).concat(flattenArray(array.slice(1)))
  }
  return [array[0]].concat(flattenArray(array.slice(1)))
}

function compareValues(a,b){
  if (typeof(a) == 'string' && typeof(b) == 'string'){
    return a.toLowerCase().replaceAll(" ","") == b.toLowerCase().replaceAll(" ","")
  }
  return a == b
}

function valueInArray(value,array){
  for (j = 0; j < array.length; j++){
    if(compareValues(value,array[j])){
      return true
    }
  }
  return false
}

function indexOfValueInArray(value,array){
  for (j = 0; j < array.length; j++){
    if (compareValues(value,array[j])){
      return j
    }
  }
  return -1
}
