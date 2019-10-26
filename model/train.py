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
    def __init__(self, number: int, name: str, startAt: Station, endAt: Station, timeTable: List[TimeTable]):
        self.number = number
        self.name = name
        self.source = startAt
        self.destination = endAt
        self.timeTable = timeTable


'''
    Helps us in groupifying all trains,
    works as main backend worker function for function
    lying below it
'''


def __groupify__(data: reader):
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
                holder.append(tmp)
                tmp = [i]
        lastItem = i
    return holder


'''
    Reads from Indian Railways TimeTable data ( *.csv file ),
    which is then groupified into trains.

    So finally this function returns a collection of Trains
'''


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
