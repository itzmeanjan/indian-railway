'use strict';
const {readFile} = require('fs');

// reads target_file, containing actual dataset, and returns a
// JS Object, where each value is a JS array of arrays and each inner array is a
// certain train's PathStop
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
                      .split('\r\n')
                      .filter((elem) => elem.length > 0)
                      .map((elem) => elem.split(','))
                      .reduce((accumulatedValue, currentValue) => {
                        if (currentValue[0] in accumulatedValue)
                          accumulatedValue[currentValue[0]].push(currentValue);
                        else
                          accumulatedValue[currentValue[0]] = [ currentValue ];
                        return accumulatedValue;
                      }, {}));
      });
    } catch (e) {
      reject('error');
    }
  });
}

readIt().then(
    (value) => { console.log(require('./model/data').fromDataSet(value)); },
    (err) => { console.log(err); });
