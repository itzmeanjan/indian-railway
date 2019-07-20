'use strict';

const { readIt, storeJSON, parseJSONDataSet } = require('./objectify');

// following section is temporarily disabled, cause it's already executed
// use following section for generation of JSON dataset from main CSV dataset
// which was actually downloaded

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

// this section will try to show how to objectify ( just converted ) JSON
// dataset and get an instance of `TrainList` class, which will eventually hold
// all running train information

/*
parseJSONDataSet().then((data) => console.log(data), (err) => console.log(err));
*/

// reads from already generated JSON dataset,
// objectifies that into an instance of `TrainList` class
// and iterates over a list of `Train`objects

/*
parseJSONDataSet().then((data) =>
                            data.allTrains.forEach((elem) => console.log(elem)),
                        (err) => console.log(err));
*/

// prints all Stations present in Indian RailWay Network
// ( more specificially saying, stations present in dataset downloaded )

/*
parseJSONDataSet().then(
    (data) => data.allStations.then((stations) => console.log(stations),
                                    (err) => console.log(err)),
    (err) => console.log(err));
*/

// builds railway networks Graph, where stations are vertices,
// railway tracks are considered as edges and
// distance from current station under consideration to adjacent station(s)
// are put as edge weight(s)


parseJSONDataSet().then((data) => {
  console.log(require('./model/network').fromTrainList(data));
}, (err) => console.log(err));

