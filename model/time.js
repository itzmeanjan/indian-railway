'use strict';

// remember start and end are required to be passed in order
// and both of them will be String
//
// format for start and end will be like --> `HH:MM:SS`
// this'll simply convert a certain TimeString to SecondCount in a day
// We already know there's 86400 seconds in a day

function getDifference(start, end) {
  // conversion from TimeString to SecondCount is performed here
  function convertToSecond(time) {
    return time.split(':').reduce((acc, cur, idx) => {
      switch (idx) {
      case 0:
        acc += (parseInt(cur) * 3600);
        break;
      case 1:
        acc += (parseInt(cur) * 60);
        break;
      default:
        acc += parseInt(cur);
      }
      return acc;
    }, 0);
  }
  // converting both of them
  let startSec = convertToSecond(start);
  let endSec = convertToSecond(end);
  // this is where difference is calculated
  return (endSec > startSec)
             ? (endSec - startSec)
             : (endSec <
                startSec) // because we've 86400 seconds in a day, so in case of
                          // folding, a subtraction is required
                   ? (endSec + (86400 - startSec))
                   : 0;
}

// making it available for external users

module.exports = {
  getDifference : getDifference
};
