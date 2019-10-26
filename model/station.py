#!/usr/bin/python3

from __future__ import annotations

'''
    Holds record of a certain Station.

    A railway station can be uniquely identified using its
    code, its name is also stored here
'''


class Station(object):
    def __init__(self, code: str, name: str):
        self.code = code
        self.name = name


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
