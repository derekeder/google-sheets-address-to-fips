var ui = SpreadsheetApp.getUi();
var addressColumn = 1;
var outputColumn = 2;

function testLookup(){
  let fips = lookupFips("4600 Silver Hill Rd, Washington, DC 20233");
  console.log(fips);
}

function processAddress(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var cells = sheet.getActiveRange();
  
  if (cells.getNumColumns() != 2) {
    ui.alert(
      'Warning',
      'You must select 2 columns: Address, FIPS Code',
      ui.ButtonSet.OK
    );
    return;
  }
  
  for (addressRow = 1; addressRow <= cells.getNumRows(); addressRow++) {
    var address = cells.getCell(addressRow, addressColumn).getValue();
    
    if (!address) {continue}
    
    let fips_code = lookupFips(address);
    populateResponse(cells, addressRow, fips_code);
  }
}

function lookupFips(address){
  const url = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?benchmark=4&format=json&vintage=4" +
              "&address=" + encodeURIComponent(address)

    const response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
    const responseCode = response.getResponseCode()

    if (responseCode == 200) {
      let data = JSON.parse(response.getContentText())
      console.log(data['result']['addressMatches'][0]['geographies']['2020 Census Blocks'][0]['GEOID'])
      let fips_code = data['result']['addressMatches'][0]['geographies']['2020 Census Blocks'][0]['GEOID']
      return fips_code;
    } else {
      throw `Error ${responseCode}`
    }
}

function populateResponse(cells, row, value){
  insertDataIntoSheet(cells, row, [
        [outputColumn, value]
      ]);
}
  
/**
 * Sets cells from a 'row' to values in data
 */
function insertDataIntoSheet(cells, row, data) {
  for (d in data) {
    cells.getCell(row, data[d][0]).setValue(data[d][1]);
  }
}

function onOpen() {
  ui.createMenu('Census FIPS Lookup')
   .addItem('Get FIPS code for selected addresses', 'processAddress')
   .addToUi();
}