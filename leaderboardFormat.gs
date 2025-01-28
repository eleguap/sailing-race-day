function leaderboardFormat() {
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
  sheet.setColumnWidth(constants.leaderboardAddRaceDayColumn-1,2)
  sheet.setColumnWidth(constants.leaderboardEditResultColumn-1,2)
  sheet.setColumnWidth(constants.leaderboardResultsColumn-2,2)
  sheet.setColumnWidth(constants.leaderboardResultsColumn-1,30)

  //Headers
  headers = constants.leaderboardHeaders
  setRange(1,1,1,headers.length,[headers])

  // Header Background Formatting
  sheet.getRange(1,constants.leaderboardAddRaceDayColumn,1,1).setBackground('#cfe2f3')
  sheet.getRange(1,constants.leaderboardEditResultColumn,1,3).setBackground('#cfe2f3')

  // Header Border Formatting
  sheet.getRange(1,constants.leaderboardAddRaceDayColumn,1,1).setBorder(null,true,null,true,true,null,'#4a86e8',SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  sheet.getRange(1,constants.leaderboardEditResultColumn,1,3).setBorder(null,true,null,true,true,null,'#4a86e8',SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
}
