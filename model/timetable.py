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
    with its distance from previous station on which this train
    had a stoppage ( well distance will be calculated in kilometers )
'''


class Timing(object):
    def __init__(self, stationCode: str, arrival: str, departure: str, distance: int):
        self.stationCode = stationCode
        self.arrival = arrival
        self.departure = departure
        self.distance = distance

    '''
        parses HH:MM:SS formatted arrival or departure time
        in this station, for this train, into one integer,
        which is representing x-th second of a day ( well 
        a day has 86400 seconds in it ).

        so it can have any value in between >=0 and < 86400,
        if date string is not like 00:00:00, which will
        be in case of dates when we're dealing with
        source or destination station

        and if we're in either of source or destination station
        then we'll simply return -1, denoting so, to caller
    '''
    @staticmethod
    def __parseTime__(tmString: str) -> int:
        return -1 if tmString == '00:00:00' else \
            sum([int(j, base=10)*(60**i)
                 for i, j in enumerate(reversed(tmString.split(':')))])

    '''
        calculates amout of time ( in seconds ),
        for which this train will stop in this station

        for source & destination stations, it'll hold a value of
        -1, denoting this station is either of it
    '''
    @property
    def stopsFor(self) -> int:
        tmpArr, tmpDept = self.__parseTime__(
            self.arrival), self.__parseTime__(self.departure)
        # remember this time is in second
        return -1 if tmpArr == -1 or tmpDept == -1 else abs(tmpDept - tmpArr)


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
