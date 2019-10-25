#!/usr/bin/python3

from __future__ import annotations
from typing import List
try:
    from station import Station
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)


class Timing(object):
    def __init__(self, arrival: str, departure: str, station: Station, distance: int):
        self.arrival = arrival
        self.departure = departure
        self.station = station
        self.distance = distance


class TimeTable(object):
    def __init__(self, table: List[Timing]):
        self.table = table


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
