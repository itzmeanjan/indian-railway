#!/usr/bin/python3

from __future__ import annotations
from typing import List
from functools import reduce
try:
    from distance import Distance
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)

'''
    Holds record of a certain Station along with
    its neighbouring ( not only immediate neighbours ) stations.

    Not only keeping track of immediate neighbours - this
    issue needs to be addressed, which will be done in near
    future

    A railway station can be uniquely identified using its
    code, its name is also stored here

    Currently I'm ignoring storing distance to
    each of those neighbours, which will be fixed soon
'''


class StationNode(object):
    def __init__(self, code: str, name: str,
                 neighbours: List[StationNode], distances: List[Distance]):
        self.code = code
        self.name = name
        self.neighbours = neighbours
        self.distances = distances

    def __getNeighbourIndex__(self, code: str, low: int, high: int) -> int:
        if low > high:
            return -1
        elif low == high:
            return low if self.neighbours[low].code == code else -1
        else:
            mid = (low + high)//2
            return self.__getNeighbour__(code, low, mid) if self.neighbours[mid].code >= code \
                else self.__getNeighbour__(code, mid+1, high)

    def __getNeighbour__(self, code: str, low: int, high: int) -> StationNode:
        idx = self.__getNeighbourIndex__(code, low, high)
        return None if idx == -1 else self.neighbours[idx]

    def getNeighbour(self, code: str) -> StationNode:
        return self.__getNeighbour__(code, 0, len(self.neighbours) - 1)

    def __findProperPlace__(self, node: StationNode, low: int, high: int) -> int:
        if low > high:
            return 0
        elif low == high:
            return low if self.neighbours[low].code >= node.code else (low + 1)
        else:
            mid = (low + high) // 2
            return self.__findProperPlace__(node, low, mid) if self.neighbours[mid].code >= node.code \
                else self.__findProperPlace__(node, mid + 1, high)

    def pushNode(self, node: StationNode):
        self.neighbours.insert(self.__findProperPlace__(
            node, 0, len(self.neighbours) - 1), node)

    '''
        Pushes a Distance object, holding distance between
        this StationNode & some other StationNode,
        into proper position of collection
    '''

    def pushDistance(self, distance: Distance):
        self.distances.insert(self.__getNeighbourIndex__(
            distance.to, 0, len(self.neighbours) - 1), distance)


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
