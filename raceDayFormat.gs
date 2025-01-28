function raceDayFormat() {
  if(warning('Format, which will erase all current information on this sheet')){
    return NaN
  }

  sheet = SpreadsheetApp.getActiveSheet()
  constants = new SailingConstants()

  // Clear sheet
  sheet.clear()
  sheet.setColumnWidths(1,sheet.getMaxColumns(),100)
  sheet.setRowHeights(1,sheet.getMaxRows(),21)

  // Column sizes
  sheet.setColumnWidth(constants.raceDayAddOrEditRaceColumn-1,2)
  sheet.setColumnWidth(constants.raceDayEditResultColumn-1,2)
  sheet.setColumnWidth(constants.raceDayResultsColumn-2,2)
  sheet.setColumnWidth(constants.raceDayResultsColumn-1,30)

  //Headers
  headers = constants.raceDayHeaders
  setRange(1,1,1,headers.length,[headers])

  // Pursuit Drill Checkbox
  setCell(constants.raceDayPursuitDrillCheckboxRow-1,constants.raceDayPursuitDrillColumn,'Pursuit Drill')
  sheet.getRange(constants.raceDayPursuitDrillCheckboxRow-1,constants.raceDayPursuitDrillColumn).setHorizontalAlignment('center')
  sheet.getRange(constants.raceDayPursuitDrillCheckboxRow-1,constants.raceDayPursuitDrillColumn).setBackground(constants.backgroundColor)
  sheet.getRange(constants.raceDayPursuitDrillCheckboxRow-1,constants.raceDayPursuitDrillColumn,2,1).setBorder(true,true,true,true,null,true,constants.borderColor,SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  sheet.getRange(constants.raceDayPursuitDrillCheckboxRow,constants.raceDayPursuitDrillColumn).insertCheckboxes()

  // Header Background Formatting
  sheet.getRange(1,constants.raceDayAddOrEditRaceColumn,1,3).setBackground(constants.backgroundColor)
  sheet.getRange(1,constants.raceDayEditResultColumn,1,3).setBackground(constants.backgroundColor)

  // Header Border Formatting
  sheet.getRange(1,constants.raceDayAddOrEditRaceColumn,1,3).setBorder(null,true,null,true,true,null,constants.borderColor,SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  sheet.getRange(1,constants.raceDayEditResultColumn,1,3).setBorder(null,true,null,true,true,null,constants.borderColor,SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
}
