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
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)


def __findStationNodeFromNeighbourElseBuild__(code: str, name: str, node: StationNode, rg: RailGraph) -> StationNode:
    neighbour = node.getNeighbour(code)
    if not neighbour:
        neighbour = StationNode(code, name, [], [])
        rg.nodes.append(neighbour)
        node.neighbours.append(neighbour)
    return neighbour


def __buildStationNodeUnlessItExistsInGraph__(code: str, name: str, rg: RailGraph) -> StationNode:
    node = rg.getNode(code)
    if not node:
        node = StationNode(code, name, [], [])
        rg.nodes.append(node)
    return node


'''
    Creates an instance of Train class,
    from accumulated rows of CSV data file
    ( function immediately below helped us
    in groupifying rows of CSV data file
    into trains )
'''


def __buildTrain__(trainData: List[List[str]], rg: RailGraph) -> Train:
    timeTable = TimeTable([])
    for i, j in enumerate(trainData):
        node = __buildStationNodeUnlessItExistsInGraph__(*j[3:5], rg)
        if i < (len(trainData) - 1):
            __findStationNodeFromNeighbourElseBuild__(
                *trainData[i+1][3:5], node, rg)
        timeTable.table.append(Timing(node, *j[5:7], -1))
    return Train(
        trainData[0][0],
        trainData[0][1],
        rg.getNode(trainData[0][8]),
        rg.getNode(trainData[0][10]),
        timeTable)


'''
    Helps us in groupifying all trains,
    works as main backend worker function for function
    lying below it
'''


def __groupify__(data: reader, rg: RailGraph) -> List[Train]:
    holder = []
    lastItem = []
    tmp = []
    for i in data:
        if not lastItem:
            tmp.append(i)
        else:
            if i[0] == lastItem[0]:
                tmp.append(i)
            else:
                holder.append(__buildTrain__(tmp, rg))
                tmp = [i]
        lastItem = i
    return holder


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
            trains = __groupify__(reader(fd.readlines()[1:]), railGraph)
    except Exception as e:
        print(e)
        trains = None
        railGraph = None
    finally:
        return trains, railGraph


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
