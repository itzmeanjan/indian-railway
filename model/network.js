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

        function nodeHandler(index, node, wholeSet, network, innerElem, nodeState = 0) {
            if (index === 0) {
                if (nodeState === 0)
                    node.distances[wholeSet[index + 1].station.code] = Math.abs(wholeSet[index + 1].distanceFromSource - innerElem.distanceFromSource);
                else
                    if (!(wholeSet[index + 1].station.code in node.distances))
                        node.distances[wholeSet[index + 1].station.code] = Math.abs(wholeSet[index + 1].distanceFromSource - innerElem.distanceFromSource);
                let anotherInstance = network.findStationNodeByCode(wholeSet[index + 1].station.code);
                if (anotherInstance !== undefined && anotherInstance !== null) {
                    if (nodeState === 0)
                        node.neighbouringStations.push(anotherInstance);
                    else
                        if (!node.neighbouringStations.some((elm) => elm.code === anotherInstance.code))
                            node.neighbouringStations.push(anotherInstance);
                }
                else {
                    anotherInstance = new StationNode(wholeSet[index + 1].station.code, wholeSet[index + 1].station.name, [], {});
                    network.nodes.push(anotherInstance);
                    if (nodeState === 0)
                        node.neighbouringStations.push(anotherInstance);
                    else
                        if (!node.neighbouringStations.some((elm) => elm.code === anotherInstance.code))
                            node.neighbouringStations.push(anotherInstance);
                }
            }
            else if (index === (wholeSet.length - 1)) {
                if (nodeState === 0) {
                    node.distances[whole[index - 1].station.code] = Math.abs(innerElem.distanceFromSource - whole[index - 1].distanceFromSource);
                    node.neighbouringStations.push(network.findStationNodeByCode(whole[index - 1].station.code));
                }
                else {
                    if (!(wholeSet[index - 1].station.code in node.distances))
                        node.distances[wholeSet[index - 1].station.code] = Math.abs(innerElem.distanceFromSource - wholeSet[index - 1].distanceFromSource);
                    if (!node.neighbouringStations.some((elm) => elm.code === whole[index - 1].station.code))
                        node.neighbouringStations.push(network.findStationNodeByCode(whole[index - 1].station.code));
                }
            } else {
                if (nodeState === 0) {
                    node.distances[whole[index - 1].station.code] = Math.abs(innerElem.distanceFromSource - whole[index - 1].distanceFromSource);
                    node.distances[whole[index + 1].station.code] = Math.abs(whole[index + 1].distanceFromSource - innerElem.distanceFromSource);
                    node.neighbouringStations.push(network.findStationNodeByCode(whole[index - 1].station.code));
                }
                else {
                    if (!(wholeSet[index - 1].station.code in node.distances))
                        node.distances[wholeSet[index - 1].station.code] = Math.abs(innerElem.distanceFromSource - wholeSet[index - 1].distanceFromSource);
                    if (!(wholeSet[index + 1].station.code in node.distances))
                        node.distances[wholeSet[index + 1].station.code] = Math.abs(innerElem.distanceFromSource - wholeSet[index + 1].distanceFromSource);
                    if (!node.neighbouringStations.some((elm) => elm.code === whole[index - 1].station.code))
                        node.neighbouringStations.push(network.findStationNodeByCode(whole[index - 1].station.code));
                }
                let anotherInstance = network.findStationNodeByCode(whole[index + 1].station.code);
                if (anotherInstance !== undefined && anotherInstance !== null) {
                    if (nodeState === 0)
                        node.neighbouringStations.push(anotherInstance);
                    else
                        if (!node.neighbouringStations.some((elm) => elm.code === anotherInstance.code))
                            node.neighbouringStations.push(anotherInstance);
                }
                else {
                    anotherInstance = new StationNode(wholeSet[index + 1].station.code, wholeSet[index + 1].station.name, [], {});
                    network.nodes.push(anotherInstance);
                    if (nodeState === 0)
                        node.neighbouringStations.push(anotherInstance);
                    else
                        if (!node.neighbouringStations.some((elm) => elm.code === anotherInstance.code))
                            node.neighbouringStations.push(anotherInstance);
                }
            }
        }

        let network = new Network([]);
        data.allTrains.forEach((elem) => {
            elem.path.stops.forEach((innerElem, idx, whole) => {
                let foundInstance = network.findStationNodeByCode(innerElem.station.code);
                if (foundInstance !== undefined && foundInstance !== null)
                    nodeHandler(idx, foundInstance, whole, network, innerElem, nodeState = 1);
                else {
                    let stationNode = new StationNode(innerElem.station.code, innerElem.station.name, [], {});
                    nodeHandler(idx, stationNode, whole, network, innerElem);
                    network.nodes.push(stationNode);
                }
            });
        });
        return network;
    }
}
