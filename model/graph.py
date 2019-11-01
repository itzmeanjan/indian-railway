#!/usr/bin/python3

from __future__ import annotations
from typing import List
from functools import reduce
from collections import deque
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
        return self.__getNode__(code.lower(), 0, len(self.nodes) - 1)

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

    '''
    def __exploreNeighbours__(self, currentNode: StationNode, src: str, sink: str) -> int:
        found = currentNode.getNeighbour(sink)
        if not found:
            accDistance = 0
            toBeVisited = deque(currentNode.neighbours)
            visited = deque([])
            visit = toBeVisited.popleft()
            while visit:
                print(visited)
                foundInner = visit.getNeighbour(sink)
                if not foundInner:
                    toBeVisited.extend(
                        reduce(lambda acc, cur:
                               acc + [cur] if cur.code not in visited
                               else acc, visit.neighbours, []))
                else:
                    return accDistance + visit.getDistance(sink)
                visited.append(visit.code)
                visit = toBeVisited.popleft()
        else:
            return currentNode.getDistance(sink)

    # returning -1, denotes failure in finding
    # distance between that Pair or any / both Node(s)
    def getDistanceBetweenPair(self, src: str, sink: str) -> int:
        srcNode = self.getNode(src)
        if not srcNode:
            return -1
        sinkNode = self.getNode(sink)
        if not sinkNode:
            return -1
        return self.__exploreNeighbours__(srcNode, src, sink)
    '''


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
