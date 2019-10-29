#!/usr/bin/python3

from __future__ import annotations


class Distance(object):
    def __init__(self, frm: str, to: str, value: int):
        self.frm = frm  # source station code
        self.to = to  # sink station code
        self.value = value  # this is in kilometers


if __name__ == '__main__':
    print('[!]This module is designed to be used as a backend handler')
    exit(0)
