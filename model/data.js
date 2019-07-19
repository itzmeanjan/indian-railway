'use strict';

// keeps a record of a certain station, by holding its name and identifier code
// Code will be alphabetic ( 3/ 4 character lengthy )

class Station {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }

  // gets us a JSON representation of this object, so that
  // it can be easily written into a certain data file as JSON string ( after
  // stringifying whole using JSON.stringify() )

  toJSON() { return { code: this.code, name: this.name }; }

  // forms an instance of `Station` class, from a JSON object

  static fromJSON(jsonObject) {
    let station = new Station(null, null);
    station.code = jsonObject.code;
    station.name = jsonObject.name;
    return station;
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

  // this one gives time spent in a certain station,
  // will be always in `Second(s)`

  get duration() {
    return require('./time').getDifference(this.arrival, this.departure);
  }

  // for writing JSON string data to target file, for future usage
  // we'll use it
  //
  // it holds `duration` too, which is calculated and kept in `Second(s)`

  toJSON() {
    return {
      arrival: this.arrival,
      departure: this.departure,
      duration: this.duration // this one will be in `Second`
    };
  }

  // builds an instance of `PathStopTime` class from JSON object

  static fromJSON(jsonObject) {
    let pathStopTime = new PathStopTime(null, null);
    pathStopTime.arrival = jsonObject.arrival;
    pathStopTime.departure = jsonObject.departure;
    return pathStopTime;
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

  // may be helpful in converting this object representation into JSON string
  // which can be stored and reused for reloading dataset and getting object
  // representation for sake of better data analysis

  toJSON() {
    return {
      station: this.station,
      time: this.time,
      distanceFromSource: this.distanceFromSource // stays in KiloMeter(s)
    };
  }

  // this static method will be helpful in grabbing
  // an instance of this class from JSON dataset
  //
  // after we've loaded data from CSV and converted to JSON string,
  // later on we may require to reload same data ( but this time JSON )
  // then we'll use this method

  static fromJSON(jsonObject) {
    let pathStop = new PathStop(null, null, null);
    pathStop.station = Station.fromJSON(jsonObject.station);
    pathStop.time = PathStopTime.fromJSON(jsonObject.time);
    pathStop.distanceFromSource = jsonObject.distanceFromSource;
    return pathStop;
  }

  // each `PathStop` object present in `Path`, holds information
  // regarding a certain stopping station, present on its path towards
  // destination from source
  //
  // remember they stay in ordered fashion
  // now each PathStop holds current station information ( like code and name ),
  // stopping time ( like arrival and departure time, so we can calculate
  // duration easily ) and distance for current station from source station ( no
  // doubt it's w.r.t. current train )

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

  // will get us distance from Source to Destination Station, in KiloMeter(s)

  get totalDistance() {
    let response = null;
    try {
      response = this.stops[this.stops.length - 1].distanceFromSource;
    } catch (e) {
      response = null;
    } finally {
      return response;
    }
  }

  // finds instance of a certain Station, where this train is supposed to stop
  // if not present, returns null

  findStopByStationId(id) {
    let response = null;
    try {
      id = id.toUpperCase();
      response = this.stops.filter((elem) => id === elem.station.code)[0];
    } catch (e) {
      response = null;
    } finally {
      return response;
    }
  }

  // finds stations in between starting and end station id,
  // including both of them
  //
  // will be helpful in calculating timespent for moving
  // from one station to another
  // or for finding average speed on track for a certain train between stations
  // provided

  hopsInBetween(firstStationId, lastStationId) {
    let response;
    try {
      firstStationId = firstStationId.toUpperCase();
      lastStationId = lastStationId.toUpperCase();
      if (firstStationId === lastStationId)
        throw Error('both station id can\'t be same');
      response = this.stops.reduce((acc, cur) => {
        if (cur.station.code === firstStationId)
          acc.push(cur);
        else if (cur.station.code === lastStationId)
          acc.push(cur);
        else if (acc.some((elem) => elem.station.code === firstStationId) &&
          !acc.some((elem) => elem.station.code === lastStationId))
          acc.push(cur);
        return acc;
      }, []);
      if (!(response[0].station.code === firstStationId &&
        response[response.length - 1].station.code === lastStationId))
        response = null;
    } catch (e) {
      response = null;
    } finally {
      return response;
    }
  }

  // counts number of stops to be covered between two stations
  // stations need to be ordered, otherwise null will be returned
  // even if both of them are present in to be stopped station(s) list

  hopCountInBetween(firstStationId, lastStationId) {
    let tmp = this.hopsInBetween(firstStationId, lastStationId);
    return (tmp !== undefined && tmp !== null) ? tmp.length - 2 : null;
  }

  // calculates average speed of traversal in between two stations
  // while eliminating Time spent in any intermediate Station(s)
  //
  // only runtime and distance between stationOne
  // and stationTwo will be considered
  //
  // returned average speed will be in KiloMeter(s)/ Hour
  // in case of error, returns `null`

  averageSpeedBetween(firstStationId, lastStationId) {
    let tmp = this.hopsInBetween(firstStationId, lastStationId);
    return (tmp !== undefined && tmp !== null)
      ? (tmp.reduce(
        (acc, cur, idx, whole) =>
          (acc += ((idx >= 0 && idx < (tmp.length - 1))
            ? (whole[idx + 1].distanceFromSource -
              cur.distanceFromSource)
            : 0)),
        0) /
        tmp.reduce((acc, cur, idx, whole) =>
          (acc += ((idx >= 0 && idx < (tmp.length - 1))
            ? require('./time').getDifference(
              cur.time.departure,
              whole[idx + 1].time.arrival)
            : 0)),
          0)) *
      3600
      : null;
  }

  toJSON() { return this.stops.map((elem) => elem.toJSON()); }

  // converts JSON object to `Path` object

  static fromJSON(jsonObject) {
    let path = new Path(null);
    // using JS functional construct
    path.stops = jsonObject.map((elem) => PathStop.fromJSON(elem));
    return path;
  }

  // takes an JS Array or Arrays, and convert those data set into a collection
  // of PathStop object, where each of them is a Station on that Trains path
  // towards destination

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

  // helpful while writing JSON string representation
  // of dataset into some target `*.json` file
  //
  // one thing to be noticed, when we convert `Train` to JSON we don't
  // consider `source` and `destination`
  //
  // but while converting JSON to `Train` object we need to have both source and
  // destination, which is why we'll take very first and last element of `path`
  // as `source` and `destination` respectively
  //
  // stations covered are sequentially placed from source to destination

  toJSON() {
    return { id: this.id, name: this.name, path: this.path.toJSON() };
  }

  // returns an object of `Train` class from JSON
  // ( actually parsed JSON string, i.e. JS object )

  static fromJSON(jsonObject) {
    let train = new Train(null, null, null, null, null);
    train.id = jsonObject.id;
    train.name = jsonObject.name;
    train.source = Station.fromJSON(jsonObject.path[0].station);
    train.destination =
      Station.fromJSON(jsonObject.path[jsonObject.path.length - 1].station);
    train.path = Path.fromJSON(jsonObject.path);
    return train;
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
  //
  // includes both UP and DOWN of a certain Train

  get runningTrainCount() {
    let response = 0;
    try {
      response = this.allTrains.length;
    } catch (e) {
      response = 0;
    } finally {
      return response;
    }
  }

  get allStations() {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.allTrains.reduce((acc, cur) => {
          cur.path.stops.reduce((innerAcc, innerCur) => {
            if (!(innerCur.station.code in innerAcc))
              innerAcc[innerCur.station.code] = innerCur.station.name;
            return innerAcc;
          }, acc);
          return acc;
        }, {}));
      } catch (e) {
        reject('error');
      }
    });
  }

  // finds a certain running train by its Train No, which is denoted as Train
  // Id. here returns a Promise

  findById(id) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.allTrains.filter((elem) => id === elem.id)[0]);
      } catch (e) {
        reject('error');
      }
    });
  }

  // converts to JSON object

  toJSON() { return { allTrains: this.allTrains.map((elem) => elem.toJSON()) }; }

  // holds all instances of running trains under it
  // builds this instance from JSON object, which was eventually read from a
  // JSON file

  static fromJSON(jsonObject) {
    let trainList = new TrainList(null);
    trainList.allTrains =
      jsonObject.allTrains.map((elem) => Train.fromJSON(elem));
    return trainList;
  }

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
