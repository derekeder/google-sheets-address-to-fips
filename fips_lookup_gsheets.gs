var ui = SpreadsheetApp.getUi();
var streetColumn = 1;
var cityColumn = 2;
var stateColumn = 3;
var zipColumn = 4;
var outputColumn = 5;

// testing
function testLookupGoodAddress(){
  let fips_code = lookupFips("1 East Benton Street",	"Aurora",	"IL",	"60505");
  console.log(fips_code);
}

function testLookupBadAddress(){
  let fips_code = lookupFips("1 Flower Drive", "Flora", "IL", "62839");
  console.log(fips_code);
}

function testLookupLatLong(){
  let fips_code = lookupFipsByLatLong(42.3557634,-89.0276159);
  console.log(fips_code);
}

// helper functions
function processAddress(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var cells = sheet.getActiveRange();
  
  if (cells.getNumColumns() != 5) {
    ui.alert(
      'Warning',
      'You must select 5 columns: Street address, City, State, Zip and destination for FIPS Code',
      ui.ButtonSet.OK
    );
    return;
  }
  
  for (addressRow = 1; addressRow <= cells.getNumRows(); addressRow++) {
    var street = cells.getCell(addressRow, streetColumn).getValue();
    var city = cells.getCell(addressRow, cityColumn).getValue();
    var state = cells.getCell(addressRow, stateColumn).getValue();
    var zip = cells.getCell(addressRow, zipColumn).getValue();
    
    if (!street || street === 'Address') {continue}
    
    let fips_code = lookupFips(street, city, state, zip);
    populateResponse(cells, addressRow, fips_code);
  }
}

function lookupFips(street, city, state, zip){
  const url = "https://geocoding.geo.census.gov/geocoder/geographies/address?benchmark=4&format=json&vintage=4" +
              "&street=" + encodeURIComponent(street) +
              "&city=" + encodeURIComponent(city) +
              "&state=" + encodeURIComponent(state) +
              "&zip=" + encodeURIComponent(zip) 

  // console.log(url)
  const response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  const responseCode = response.getResponseCode()

  if (responseCode == 200) {
    let data = JSON.parse(response.getContentText())
    console.log(data['result'])
    if (data['result']['addressMatches'].length > 0)
      return data['result']['addressMatches'][0]['geographies']['2020 Census Blocks'][0]['GEOID']
    else
      return ""
  } else {
    throw `Error ${responseCode}`
  }
}

function lookupFipsByLatLong(lat, long){
  const url = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates?benchmark=4&format=json&vintage=4" +
              "&x=" + encodeURIComponent(long) +
              "&y=" + encodeURIComponent(lat)

  // console.log(url)
  const response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  const responseCode = response.getResponseCode()

  if (responseCode == 200) {
    let data = JSON.parse(response.getContentText())
    // console.log(data['result'])
    if (data['result']['geographies']['2020 Census Blocks'].length > 0)
      return data['result']['geographies']['2020 Census Blocks'][0]['GEOID']
    else
      return ""
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