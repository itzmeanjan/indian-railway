#!/usr/bin/python3

from __future__ import annotations
from csv import reader
from os.path import join, dirname
from typing import List
from functools import reduce
try:
    from model.train import Train
    from station import Station
    from timetable import TimeTable, Timing
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)

'''
    Creates an instance of Train class,
    from accumulated rows of CSV data file
    ( function immediately below helped us
    in groupifying rows of CSV data file
    into trains )
'''


def __buildTrain__(trainData: List[List[str]]) -> Train:
    return Train(
        trainData[0][0],
        trainData[0][1],
        Station(*trainData[0][8:10]),
        Station(*trainData[0][10:12]),
        TimeTable(reduce(lambda acc, cur: acc +
                         [Timing(*([cur[3]] + cur[5:8]))],
                         trainData, [])))


'''
    Helps us in groupifying all trains,
    works as main backend worker function for function
    lying below it
'''


def __groupify__(data: reader) -> List[Train]:
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
                holder.append(__buildTrain__(tmp))
                tmp = [i]
        lastItem = i
    return holder


'''
    Reads from Indian Railways TimeTable data ( *.csv file ),
    which is then groupified into trains.

    So finally this function returns a collection of Trains
'''


def importFromCSV(targetPath: str = join(dirname(__file__), 'data/Train_details_22122017.csv')) -> List[Train]:
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
