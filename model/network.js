'use strict';

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

class StationNode {
  constructor(code, name, neighbouringStations, distances) {
    this.code = code;
    this.name = name;
    this.neighbouringStations = neighbouringStations;
    this.distances = distances;
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
                         nodeState = 0) {
      if (index === 0) {
        if (nodeState === 0)
          node.distances[wholeSet[index + 1].station.code] =
              Math.abs(wholeSet[index + 1].distanceFromSource -
                       innerElem.distanceFromSource);
        else if (!(wholeSet[index + 1].station.code in node.distances))
          node.distances[wholeSet[index + 1].station.code] =
              Math.abs(wholeSet[index + 1].distanceFromSource -
                       innerElem.distanceFromSource);
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
                              wholeSet[index + 1].station.name, [], {});
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
                              wholeSet[index + 1].station.name, [], {});
          network.nodes.push(anotherInstance);
          node.neighbouringStations.push(anotherInstance);
        }
      }
    }

    let network = new Network([]);
    data.allTrains.forEach((elem) => {
      elem.path.stops.forEach((innerElem, idx, whole) => {
        let foundInstance =
            network.findStationNodeByCode(innerElem.station.code);
        if (foundInstance !== undefined && foundInstance !== null)
          nodeHandler(idx, foundInstance, whole, network, innerElem, 1);
        else {
          let stationNode = new StationNode(innerElem.station.code,
                                            innerElem.station.name, [], {});
          network.nodes.push(stationNode);
          nodeHandler(idx, stationNode, whole, network, innerElem);
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

module.exports = {
  Network : Network
}
