'use strict';

// as we need to keep track of which train can take us from station A to B,
// we may require to store an instance of all those trains which can be taken
// for going to station B from current one
//
// so we store train id, which is generally one unique identifier string
// and corresponding train name
//
// we'll keep track of all running trains in `Network`
// by keeping a record of available trains from current `StationNode` to
// neighbouring `StationNode`(s)

class Train {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

// holds arrival and departure time at / from current station under
// consideration and next station to come on its way to destination

class TimeTable {
  constructor(arrivalAtCurrent, departureFromCurrent, arrivalAtNext,
              departureFromNext) {
    this.arrivalAtCurrent = arrivalAtCurrent;
    this.departureFromCurrent = departureFromCurrent;
    this.arrivalAtNext = arrivalAtNext;
    this.departureFromNext = departureFromNext;
  }

  // calculates time being spent in `Second(s)` at current station, which is
  // under consideration

  durationAtCurrent() {
    return require('./time').getDifference(this.arrivalAtCurrent,
                                           this.departureFromCurrent);
  }

  // calculates time to be spent in `Second(s)` at next station coming

  durationAtNext() {
    return require('./time').getDifference(this.arrivalAtNext,
                                           this.departureFromNext);
  }

  // calculates time to be spent in `Second(s)` on track i.e. time required to
  // cover distance from current station to next station ( stop )

  durationOnTrack() {
    return require('./time').getDifference(this.departureFromCurrent,
                                           this.arrivalAtNext);
  }
}

// well what we're interested in doing here is,
// representing whole railway network in form of Graph
// where all stations will be considered as vertices of Graph
// and railway tracks will be edges connecting them
//
// and distance between two adjacent stations will be considered
// as edge weight of graph
//
// so StationNode will hold information regrading a certain station i.e. Node
//
// there's one thing `neighbouringStations`, which keeps an array of instances
// of other StationNodes which are adjacent to it and another thing where you
// may be interested in is, `distances`, which keeps a JS object where keys will
// be stationCodes of neighbouring stations and it's values will be distance
// from current station under consideration to station for which we've this
// station code
//
// so one thing should be clear to you by now, elements present in
// `neighbouringStations` & keys present in `distances` needs to be of same
// count
//
// ** we've a new addition `trains`, which will hold a JS object, where keys
// will be neighbouring station codes and their corresponding values will hold a
// JS array, where each element will be an instance of `Train` class, holding
// information regrading running train which can be taken for going to that
// neighbouring station from current one ( under consideration )
//
// you may have already understood, why a JS array of `Train`(s) for a certain
// station code, cause we can take different trains for getting to that
// target station
//
// ** well we've another new addition in `StationNode` class, which is
// `timeTable` now what does it do ?
//
// well it's supposed to hold a JS object, where keys will be neighbouring
// station codes and values will be JS object(s), which will have unique train
// id as keys and instance of `TimeTable` class as values
//
// what we plan to do is, to store arrival and departure time at/ from current
// and next station for a certain train for a certain neighbour, which is why
// keys were unique train id & neighbouring station codes repectively, using
// `TimeTable` object

class StationNode {
  constructor(code, name, neighbouringStations, distances, trains, timeTable) {
    this.code = code;
    this.name = name;
    this.neighbouringStations = neighbouringStations;
    this.distances = distances;
    this.trains = trains;
    this.timeTable = timeTable;
  }
}

// if you've read previous comment in code, you must have got some idea of what
// `Network` might be well `Network` holds whole Graph, where we'll keep track
// of all those nodes, edges and corresponding weights
//
// so in `Network`, we'll have `nodes` which keeps a collection of all nodes
// which will be participating in network i.e. graph
//
// our main focus should be in generating a `Network` instance,
// while holding all Stations i.e. nodes, railway tracks i.e. edges and
// corresponding distance between two adjacent stations i.e. edge weights
//
// we'll be iteratively forming whole graph, in static method `fromTrainList`

class Network {
  constructor(nodes) { this.nodes = nodes; }

  // helps in finding an instance of a `StationNode` i.e. which is already
  // formed, by unique station code
  //
  // if we're unable to find anything matching properly, we'll return
  // `undefined` or `null` in case of error
  //
  // so be ready to handle both of those situations

  findStationNodeByCode(code) {
    try {
      return this.nodes.filter((elem) => elem.code === code)[0];
    } catch (e) {
      return null;
    }
  }

  // mostly we'll be interested in this method's implementation,
  // cause here we're doing a lot of heavy liftings for generating whole Graph
  //
  // more documentation to come soon ...

  static fromTrainList(data) {

    function nodeHandler(index, node, wholeSet, network, innerElem,
                         connectingTrain, nodeState = 0) {
      // nodeState value 0, denotes this node i.e. station in Railway Network is
      // just created anything else will denotes, this node has already been
      // added to network
      if (index === 0) {
        if (nodeState === 0)
          node.distances[wholeSet[index + 1].station.code] =
              Math.abs(wholeSet[index + 1].distanceFromSource -
                       innerElem.distanceFromSource);
        else {
          if (!(wholeSet[index + 1].station.code in node.distances))
            node.distances[wholeSet[index + 1].station.code] =
                Math.abs(wholeSet[index + 1].distanceFromSource -
                         innerElem.distanceFromSource);
        }
        if (!(wholeSet[index + 1].station.code in node.trains))
          node.trains[wholeSet[index + 1].station.code] = [ connectingTrain ];
        else {
          if (!node.trains[wholeSet[index + 1].station.code].some(
                  (elem) => elem.id === connectingTrain.id))
            node.trains[wholeSet[index + 1].station.code].push(connectingTrain);
        }
        if (!(wholeSet[index + 1].station.code in node.timeTable))
          node.timeTable[wholeSet[index + 1].station.code] =
              {}; // this is done simply to avoid one situation ;)
        // holding timetable i.e. arrival and departure time, both at( from )
        // current station and next station
        node.timeTable[wholeSet[index + 1].station.code][connectingTrain.id] =
            new TimeTable(innerElem.time.arrival, innerElem.time.departure,
                          wholeSet[index + 1].time.arrival,
                          wholeSet[index + 1].time.departure);
        let anotherInstance =
            network.findStationNodeByCode(wholeSet[index + 1].station.code);
        if (anotherInstance !== undefined && anotherInstance !== null) {
          if (nodeState === 0)
            node.neighbouringStations.push(anotherInstance);
          else if (!node.neighbouringStations.some(
                       (elm) => elm.code === anotherInstance.code))
            node.neighbouringStations.push(anotherInstance);
        } else {
          anotherInstance =
              new StationNode(wholeSet[index + 1].station.code,
                              wholeSet[index + 1].station.name, [], {}, {}, {});
          network.nodes.push(anotherInstance);
          node.neighbouringStations.push(anotherInstance);
        }
      } else if (index === (wholeSet.length - 1)) {
        if (nodeState === 0) {
          node.distances[wholeSet[index - 1].station.code] =
              Math.abs(innerElem.distanceFromSource -
                       wholeSet[index - 1].distanceFromSource);
          node.neighbouringStations.push(
              network.findStationNodeByCode(wholeSet[index - 1].station.code));
        } else {
          if (!(wholeSet[index - 1].station.code in node.distances))
            node.distances[wholeSet[index - 1].station.code] =
                Math.abs(innerElem.distanceFromSource -
                         wholeSet[index - 1].distanceFromSource);
          if (!node.neighbouringStations.some(
                  (elm) => elm.code === wholeSet[index - 1].station.code))
            node.neighbouringStations.push(network.findStationNodeByCode(
                wholeSet[index - 1].station.code));
        }
      } else {
        if (nodeState === 0) {
          node.distances[wholeSet[index - 1].station.code] =
              Math.abs(innerElem.distanceFromSource -
                       wholeSet[index - 1].distanceFromSource);
          node.distances[wholeSet[index + 1].station.code] =
              Math.abs(wholeSet[index + 1].distanceFromSource -
                       innerElem.distanceFromSource);
          node.neighbouringStations.push(
              network.findStationNodeByCode(wholeSet[index - 1].station.code));
        } else {
          if (!(wholeSet[index - 1].station.code in node.distances))
            node.distances[wholeSet[index - 1].station.code] =
                Math.abs(innerElem.distanceFromSource -
                         wholeSet[index - 1].distanceFromSource);
          if (!(wholeSet[index + 1].station.code in node.distances))
            node.distances[wholeSet[index + 1].station.code] =
                Math.abs(innerElem.distanceFromSource -
                         wholeSet[index + 1].distanceFromSource);
          if (!node.neighbouringStations.some(
                  (elm) => elm.code === wholeSet[index - 1].station.code))
            node.neighbouringStations.push(network.findStationNodeByCode(
                wholeSet[index - 1].station.code));
        }
        if (!(wholeSet[index + 1].station.code in node.trains))
          node.trains[wholeSet[index + 1].station.code] = [ connectingTrain ];
        else {
          if (!node.trains[wholeSet[index + 1].station.code].some(
                  (elem) => elem.id === connectingTrain.id))
            node.trains[wholeSet[index + 1].station.code].push(connectingTrain);
        }
        if (!(wholeSet[index + 1].station.code in node.timeTable))
          node.timeTable[wholeSet[index + 1].station.code] = {};
        // holding timetable i.e. arrival and departure time, both at( from )
        // current station and next station
        node.timeTable[wholeSet[index + 1].station.code][connectingTrain.id] =
            new TimeTable(innerElem.time.arrival, innerElem.time.departure,
                          wholeSet[index + 1].time.arrival,
                          wholeSet[index + 1].time.departure);
        let anotherInstance =
            network.findStationNodeByCode(wholeSet[index + 1].station.code);
        if (anotherInstance !== undefined && anotherInstance !== null) {
          if (nodeState === 0)
            node.neighbouringStations.push(anotherInstance);
          else if (!node.neighbouringStations.some(
                       (elm) => elm.code === anotherInstance.code))
            node.neighbouringStations.push(anotherInstance);
        } else {
          anotherInstance =
              new StationNode(wholeSet[index + 1].station.code,
                              wholeSet[index + 1].station.name, [], {}, {}, {});
          network.nodes.push(anotherInstance);
          node.neighbouringStations.push(anotherInstance);
        }
      }
    }

    let network = new Network([]);
    data.allTrains.forEach((elem) => {
      let train = new Train(
          elem.id,
          elem.name); // we create instance of current `Train`, here and keep it
      // using for all intermediate stations it'll cover from
      // its source to destination ( including both of them )
      elem.path.stops.forEach((innerElem, idx, whole) => {
        let foundInstance =
            network.findStationNodeByCode(innerElem.station.code);
        if (foundInstance !== undefined && foundInstance !== null)
          nodeHandler(idx, foundInstance, whole, network, innerElem, train, 1);
        else {
          let stationNode = new StationNode(
              innerElem.station.code, innerElem.station.name, [], {}, {}, {});
          network.nodes.push(stationNode);
          nodeHandler(idx, stationNode, whole, network, innerElem, train);
        }
      });
    });
    return network;
  }
}

// making it available for use from outer section
// mostly you'll be interested in invoking static method `fromTrainList`
// on Network, which can finally give you an instance of whole railway network
// where stations will be represented as Vertices and railway tracks will be
// edges in between them

module.exports = Network;
