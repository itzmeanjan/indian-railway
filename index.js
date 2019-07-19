'use strict';

const {readIt, storeJSON, parseJSONDataSet} = require('./objectify');

// following section is temporarily disabled, cause it's already executed

/*
readIt().then((value) => {
  storeJSON(JSON.stringify(require('./model/data')
    .fromDataSet(value)
    .toJSON(), // Objectifying data set from CSV to
    // `TrainList` object is done here
    null, 4)) // stringifying to JSON, so that it can be
    // written into target file properly
    // also adding some indentation, so that
    // it stays readable ;)
    .then((val) => console.log(val),  // in case of success, prints `success`
      (err) => console.log(err)); // otherwise `error`
}, (err) => console.log(err));          // if reading data fails some how
*/

parseJSONDataSet().then((data) => console.log(data), (err) => console.log(err));
