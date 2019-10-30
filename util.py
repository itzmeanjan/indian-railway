#!/usr/bin/python3

from __future__ import annotations
from csv import reader
from os.path import join, dirname
from typing import List, Tuple
from functools import reduce
try:
    from model.train import Train
    from model.station import StationNode
    from model.graph import RailGraph
    from model.timetable import Timing, TimeTable
    from distance import Distance
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)


def __calculateDistance__(src: str, dst: str, distanceStr: str, distanceUpto: int) -> int:
    if distanceUpto == -1:
        return distanceUpto, Distance(src, dst, distanceUpto)
    else:
        distance = -1
        if distanceStr.isnumeric():
            distance = int(distanceStr, base=10)
            return distance, Distance(src, dst, distance - distanceUpto)
        else:
            return distance, Distance(src, dst, distance)


def __buildStationNodeUnlessItExistsInGraph__(code: str, name: str, rg: RailGraph) -> StationNode:
    node = rg.getNode(code)
    if not node:
        node = StationNode(code, name, [], [])
        rg.pushNode(node)
        # rg.nodes.append(node)
    return node


def __findStationNodeFromNeighbourElseBuild__(code: str, name: str, distance: Distance, node: StationNode, rg: RailGraph) -> StationNode:
    neighbour = node.getNeighbour(code)
    if not neighbour:
        neighbour = __buildStationNodeUnlessItExistsInGraph__(code, name, rg)
        node.pushNode(neighbour)
        node.pushDistance(distance)
    return neighbour


'''
    Creates an instance of Train class,
    from accumulated rows of CSV data file
    ( function immediately below helped us
    in groupifying rows of CSV data file
    into trains )
'''


def __buildTrain__(trainData: List[List[str]], rg: RailGraph) -> Train:
    timeTable = TimeTable([])
    stopCount = len(trainData)
    src = None
    dst = None
    distanceUpto = 0
    for i, j in enumerate(trainData):
        node = __buildStationNodeUnlessItExistsInGraph__(*j[3:5], rg)
        if i < (stopCount - 1):
            distanceUpto, dist = __calculateDistance__(
                j[3], trainData[i+1][3], trainData[i+1][7], distanceUpto)
            __findStationNodeFromNeighbourElseBuild__(
                *trainData[i+1][3:5], dist, node, rg)
        timeTable.table.append(Timing(node, *j[5:7]))
        if i == 0:
            src = node
        if i == (stopCount - 1):
            dst = node
    return Train(
        trainData[0][0],
        trainData[0][1],
        src,
        dst,
        timeTable)


'''
    Helps us in groupifying all trains,
    works as main backend worker function for function
    lying below it
'''


def __groupify__(data: reader, rg: RailGraph, trains: List[Train]):
    lastItem = []
    tmp = []
    for i in data:
        if not lastItem:
            tmp.append(i)
        else:
            if i[0] == lastItem[0]:
                tmp.append(i)
            else:
                trains.append(__buildTrain__(tmp, rg))
                tmp = [i]
        lastItem = i


'''
    Reads from Indian Railways TimeTable data ( *.csv file ),
    which is then groupified into trains.

    So finally this function returns a collection of Trains
'''


def importFromCSV(targetPath: str = join(dirname(__file__), 'data/Train_details_22122017.csv')) -> Tuple[List[Train], RailGraph]:
    trains = []
    railGraph = RailGraph([])
    try:
        with open(targetPath, 'r') as fd:
            __groupify__(reader(fd.readlines()[1:]), railGraph, trains)
    except Exception:
        trains = None
        railGraph = None
    finally:
        return trains, railGraph


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
