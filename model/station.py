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

    def getNeighbour(self, code: str) -> StationNode:
        return reduce(
            lambda acc, cur: cur if cur.code == code else acc,
            self.neighbours, None)


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
