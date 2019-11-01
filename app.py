#!/usr/bin/python3

from __future__ import annotations
try:
    from util import importFromCSV
except ImportError as e:
    print('[!]Module Unavailable : {}'.format(str(e)))
    exit(1)


def main() -> bool:
    _ = importFromCSV()
    return True


if __name__ == '__main__':
    try:
        print('Success' if main() else 'Failure')
    except KeyboardInterrupt:
        print('\n[!]Terminated')
    finally:
        exit(0)
