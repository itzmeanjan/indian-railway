'use strict';

// keeps a record of a certain station, by holding its name and identifier code
// Code will be alphabetic ( 3/ 4 character lengthy )

class Station {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }
}

// keeps track of time spent in a station during a stop
// this can be useful in calculating further more things i.e. running average
// speed & etc.
//
// arrival and departure time at a certain station will be
// represented using string of form `HH:MM:SS`
//
// this one is helpful in determining stop time at a certain station

class PathStopTime {
  constructor(arrival, departure) {
    this.arrival = arrival;
    this.departure = departure;
  }
}

// a certain PathStop denotes a stop, present in running path, that a train
// follows this object will hold details of stop, both time of arrival and
// departure & distanceFromSourceStation, which will be in KiloMeter(s)
//
// distanceFromSource will be in KiloMeter(s) unit
// it'll be zero, for source station, cause source station will
// also be considered as a valid `PathStop`, present in `Path`
// which this `Train` follows

class PathStop {
  constructor(station, time, distanceFromSource) {
    this.station = station;
    this.time = time;
    this.distanceFromSource = distanceFromSource;
  }

  static fromDataSet(data) {
    let pathStop = new PathStop(null, null, null);
    pathStop.station = new Station(...data.slice(0, 2));
    pathStop.time = new PathStopTime(...data.slice(2, 4));
    pathStop.distanceFromSource = data[4];
    return pathStop;
  }
}

// this is nothing but a collection of PathStops where a certain train stop
// while moving towards its destination
//
// Note: Both source and destination station will be kept in Path
// So they can be accessed using first and last PathStop respectively

class Path {
  constructor(stops) { this.stops = stops; }

  // will get us # of stops ( i.e. Station ), a train has thoughout its running
  // path
  get hopCount() {
    let response = 0;
    try {
      response = this.stops.length;
    } catch (e) {
      response = 0;
    } finally {
      return response;
    }
  }

  static fromDataSet(data) {
    let path = new Path([]);
    path.stops = data.map((elem) => PathStop.fromDataSet(elem));
    return path;
  }
}

// keeps record of a certain Train, where this train is identified using
// its unique Train No.
// holds name of train, source & destination station and running path of Train

class Train {
  constructor(id, name, source, destination, path) {
    this.id = id;
    this.name = name;
    this.source = source;
    this.destination = destination;
    this.path = path;
  }

  // parameter `data` will be a JS array of arrays,
  // where each inner array is representing a single stopping station,
  // where this train will stop
  //
  // this method will be used for grabbing an instance of this class,
  // which holds record of a certain Train

  static fromDataSet(data) {
    let train = new Train(null, null, null, null, null);
    train.id = data[0][0];
    train.name = data[0][1];
    train.source = new Station(...data[0].slice(8, 10));
    train.destination = new Station(...data[0].slice(10, 12));
    train.path = Path.fromDataSet(data.map((elem) => elem.slice(3, 8)));
    return train;
  }
}

// simply holds a collection of `Trains` i.e. all trains listed in data file
// will be objectified and can be accessed using instance of this class

class TrainList {
  constructor(allTrains) { this.allTrains = allTrains; }

  // returns # of running trains, which are objectified, and can be accessed
  // using this object

  get runningTrainCount() {
    let response = 0;
    try {
      response = this.allTrains.length;
    } catch (e) {
      response = 0;
    } finally {
      return response;
    }
  };

  // parameter `data` will be a JS Object

  static fromDataSet(data) {
    let trainList = new TrainList([]);
    trainList.allTrains =
        Object.values(data).map((elem) => Train.fromDataSet(elem));
    return trainList;
  }
}

// making accessible to external users

module.exports = TrainList;