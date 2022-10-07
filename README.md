# Look up Census FIPS code for Addresses in Google Sheets

Add this Script to your Google Sheet to get a menu item for looking up Census FIPS codes for addresses.

FPIS codes are geographic identifiers for US Census blocks, block groups, tracts, counties and states: https://www.geocod.io/guides/census/#geoids-and-fips

## Getting started

1. Go the FIPS Lookup - Starter Template, sign in to your account, and File > Make a Copy to your Google Drive: 
2. Select two columns for each address: the source address and the empty column to put the result.
3. Google Sheets script will ask for permission to run the first time

## Adding this script to your own Google Sheet

1. In your Google Sheet, click on Extensions => Apps Script
2. Click Close on the pop-up tutorial window, and delete the starter text.
3. Copy the entire code in [fips-lookup-google-sheets.gs](https://github.com/derekeder/google-sheets-address-to-fips/blob/main/fips_lookup_gsheets.gs) and paste it in.
4. Save it and give it a name like 'Census FIPS Lookup'
5. Reload your Google Sheet and you will see a menu item at the top called 'Census FIPS Lookup'
6. Follow the steps in **Getting Started** above!

## Authors

* Derek Eder @derekeder

## Errors / Bugs

If something is not behaving intuitively, it is a bug, and should be reported.
[Report it here](https://github.com/derekeder/google-sheets-address-to-fips/issues)


## Note on Patches/Pull Requests
 
* Fork the project.
* Make your feature addition or bug fix.
* Send us a pull request. Bonus points for topic branches.

## Copyright

Copyright (c) 2022 Derek Eder. Released under the [MIT License](https://github.com/derekeder/google-sheets-address-to-fips/blob/master/LICENSE).
