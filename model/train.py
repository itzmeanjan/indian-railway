#!/usr/bin/python3

from __future__ import annotations
from sys import path
from os.path import dirname
path.append(dirname(__file__))
try:
    from station import Station
    from timetable import TimeTable
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)

'''
    Holds all required information of a train,
    which is running between source station & destination station.

    Each train can be uniquely identified using its number,
    well name of train is also kept

    There's also one timeTable field in this object, which
    lets us keep a record of how much time this train will
    spend on each station over its route ( well there may be some
    non-stopping stations, which will not be included in this record )
'''


class Train(object):
    def __init__(self, number: int, name: str, startAt: Station, endAt: Station, timeTable: TimeTable):
        self.number = number
        self.name = name
        self.source = startAt
        self.destination = endAt
        self.timeTable = timeTable


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
