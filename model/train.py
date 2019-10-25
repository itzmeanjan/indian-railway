#!/usr/bin/python3

from __future__ import annotations
from typing import List
from functools import reduce
from csv import reader
from sys import path
from os.path import dirname, join
path.append(dirname(__file__))
try:
    from station import Station
    from timetable import TimeTable
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)


class Train(object):
    def __init__(self, number: int, name: str, startAt: Station, endAt: Station, timeTable: List[TimeTable]):
        self.number = number
        self.name = name
        self.source = startAt
        self.destination = endAt
        self.timeTable = timeTable


def __groupify__(data):
    holder = []
    lastItem = []
    tmp = ()
    for i in data:
        if not holder:
            tmp += (i, )
        else:
            if i[0] == lastItem[0]:
                tmp += (i, )
            else:
                holder += tmp
                tmp = (i, )
        lastItem = i
    return holder


def importFromCSV(targetPath: str = join(dirname(__file__), '../data/Train_details_22122017.csv')):
    trains = None
    try:
        with open(targetPath, 'r') as fd:
            trains = __groupify__(reader(fd.readlines()[1:]))
    except Exception:
        trains = None
    finally:
        return trains


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
