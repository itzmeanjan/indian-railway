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

    def __getNode__(self, code: str, low: int, high: int) -> StationNode:
        if low > high:
            return None
        elif low == high:
            _tmp = self.nodes[low]
            return _tmp if _tmp.code == code else None
        else:
            mid = (low + high)//2
            return self.__getNode__(code, low, mid) if self.nodes[mid].code >= code \
                else self.__getNode__(code, mid+1, high)

    def getNode(self, code: str) -> StationNode:
        return self.__getNode__(code, 0, len(self.nodes) - 1)

    def __findProperPlace__(self, node: StationNode, low: int, high: int) -> int:
        if low > high:
            return 0
        elif low == high:
            return low if self.nodes[low].code >= node.code else (low + 1)
        else:
            mid = (low + high) // 2
            return self.__findProperPlace__(node, low, mid) if self.nodes[mid].code >= node.code \
                else self.__findProperPlace__(node, mid + 1, high)

    def pushNode(self, node: StationNode):
        self.nodes.insert(self.__findProperPlace__(
            node, 0, len(self.nodes) - 1), node)


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
