'use strict';

// keeps a record of a certain station, by holding its name and identifier code
// Code will be alphabetic ( 3/ 4 character lengthy )

class Station {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }

  toJSON() { return {code : this.code, name : this.name}; }
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

  toJSON() {
    return {
      arrival : this.arrival,
      departure : this.departure,
      duration : this.duration // this one will be in `Second`
    };
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

  toJSON() {
    return {
      station : this.station,
      time : this.time,
      distanceFromSource : this.distanceFromSource // stays in KiloMeter(s)
    };
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

  toJSON() {
    return {id : this.id, name : this.name, path : this.path.toJSON()};
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

  toJSON() { return {allTrains : this.allTrains.map((elem) => elem.toJSON())}; }

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
