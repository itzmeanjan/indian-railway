#!/usr/bin/python3

from __future__ import annotations
from typing import List
try:
    from station import Station
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)

'''
    When we're talking about a certain train,
    it'll move via a path, for each of those stations
    it'll have some arrival & departure time and their corresponding distance
    from source station ( of that train )

    A Timing object will hold record when a certain train,
    will arrive in this station & depart from here, along
    with its distance from source station of this train
    ( well distance will be in kilometers )
'''


class Timing(object):
    def __init__(self, arrival: str, departure: str, station: Station, distance: int):
        self.arrival = arrival
        self.departure = departure
        self.station = station
        self.distance = distance


'''
    This simply a collection of Timing objects,
    holding a full time table of a certain train
'''


class TimeTable(object):
    def __init__(self, table: List[Timing]):
        self.table = table


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
