'use strict';

class StationNode {
    constructor(code, name, neighbouringStations, distances) {
        this.code = code;
        this.name = name;
        this.neighbouringStations = neighbouringStations;
        this.distances = distances;
    }
}

class Network {
    constructor(nodes) {
        this.nodes = nodes;
    }

    findStationNodeByCode(code) {
        try {
            return this.nodes.filter((elem) => elem.code === code)[0];
        }
        catch (e) {
            return null;
        }
    }

    static fromTrainList(data) {
        let network = new Network([]);
        data.allTrains.forEach((elem) => {
            elem.path.stops.forEach((innerElem, idx, whole) => {
                let foundInstance = network.findStationNodeByCode(innerElem.station.code);
                if (foundInstance !== undefined && foundInstance !== null) {
                    innerElem.station;
                }
                else {
                    let stationNode = new StationNode(innerElem.station.code, innerElem.station.name, [], {});
                    if (idx === 0) {
                        stationNode.distances[whole[idx + 1].station.code] = Math.abs(whole[idx + 1].distanceFromSource - innerElem.distanceFromSource);
                        let anotherInstance = network.findStationNodeByCode(whole[idx + 1].station.code);
                        if (anotherInstance !== undefined && anotherInstance !== null)
                            stationNode.neighbouringStations.push(anotherInstance);
                        else {
                            anotherInstance = new StationNode(whole[idx + 1].station.code, whole[idx + 1].station.name, [], {});
                            network.nodes.push(anotherInstance);
                            stationNode.neighbouringStations.push(anotherInstance);
                        }
                    }
                    else if (idx === (whole.length - 1)) {
                        stationNode.distances[whole[idx - 1].station.code] = Math.abs(innerElem.distanceFromSource - whole[idx - 1].distanceFromSource);
                        stationNode.neighbouringStations.push(network.findStationNodeByCode(whole[idx - 1].station.code));
                    } else {
                        stationNode.distances[whole[idx - 1].station.code] = Math.abs(innerElem.distanceFromSource - whole[idx - 1].distanceFromSource);
                        stationNode.distances[whole[idx + 1].station.code] = Math.abs(whole[idx + 1].distanceFromSource - innerElem.distanceFromSource);
                        stationNode.neighbouringStations.push(network.findStationNodeByCode(whole[idx - 1].station.code));
                        let anotherInstance = network.findStationNodeByCode(whole[idx + 1].station.code);
                        if (anotherInstance !== undefined && anotherInstance !== null)
                            stationNode.neighbouringStations.push(anotherInstance);
                        else {
                            anotherInstance = new StationNode(whole[idx + 1].station.code, whole[idx + 1].station.name, [], {});
                            network.nodes.push(anotherInstance);
                            stationNode.neighbouringStations.push(anotherInstance);
                        }
                    }
                    network.nodes.push(stationNode);
                }
            });
        });
        return network;
    }
}
