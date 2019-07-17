'use strict';
const { readFile } = require('fs');

// reads target_file, containing actual dataset, and returns a
// JS Object, where each value is a JS array of arrays and each inner array is denoting a
// certain train's PathStop i.e. Station
//
// Dataset is CRLF line seperated, so only required data is filtered for further
// processing And components in target_file's line(s) are `,` seperated
//
// throws an error in case of absense of target_file, or any other possible
// error

function readIt(target_file = './data/Train_details_22122017.csv') {
  return new Promise((resolve, reject) => {
    try {
      readFile(target_file, (err, data) => {
        if (err !== undefined && err !== null)
          reject('error');
        else
          // because it's a file with `CRLF line terminators`
          resolve(data.toString()
            .split('\r\n') // line splitter
            .filter((elem) => elem.length > 0) // eleminates last element, because it's an empty String
            .reduce((accumulatedValue, currentValue) => {
              let splitted = currentValue.split(','); // splitting a certain line using `,`, because it's a CSV data file 
              if (splitted[0] in accumulatedValue)
                accumulatedValue[splitted[0]].push(splitted); // if a certain station stop for train, identified using Train No.
              // is already pushed into corresponding JS array, we just push a new record into it
              else
                accumulatedValue[splitted[0]] = [splitted]; // creating an empty record ( JS array ), holding Source Station for
              // a certain train, other stops to be appended during next iteration(s)
              return accumulatedValue; // starting value of `accumulatedValue` is `{}`
            }, {}));
      });
    } catch (e) {
      reject('error');
    }
  });
}

// making it available for use to external users

// module.exports = readIt;

// following section was used for testing purposes

readIt().then(
  (value) => { console.log(require('./model/data').fromDataSet(value).allTrains[0].path.stops[0].time.duration); },
  (err) => { console.log(err); });
