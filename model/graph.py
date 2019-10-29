#!/usr/bin/python3

from __future__ import annotations
from typing import List
from functools import reduce
try:
    from station import StationNode
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)


class RailGraph(object):
    def __init__(self, nodes: List[StationNode]):
        self.nodes = nodes

    def getNode(self, code: str) -> StationNode:
        return reduce(
            lambda acc, cur: cur if cur.code == code else acc,
            self.nodes, None)


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
