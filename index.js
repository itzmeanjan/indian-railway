'use strict';

const {readIt, storeJSON} = require('./objectify');

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
