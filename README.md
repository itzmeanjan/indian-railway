# indian-railway
A collection of utility Scripts, for manipulating Indian Railway's Running Train(s) Dataset, written with :heart:, using _JavaScript_

## what does it do ?
- Reads Indian Railway running train's _CSV_ [dataSet](/data/Train_details_22122017.csv)
- Cleans dataset up and extracts required data using JS Array ( well it's _nested_ ) data structure
- Then objectifies dataset, so that it can be used for further processing & analysis
- Each line in _CSV_ file, corresponds to a certain station ( i.e. stopping station ) for a certain train, on its way towards destination
- Now what we do here is, putting a certain record from _CSV_ into `Train` object, where each train is uniquely identified using its `id`
- We also keep track of name of train, both its source & destination station & path it follows
- This `Path` object is pretty interesting, using it we can find out list/ number of station(s) between two stations, distance between two stations, total running path distance, an intermediate station present on current path, average speed between two stations
- A `Path` object holds a collection of `PathStop` objects, where each of them will be holding current station details ( i.e. Id & Name ), time spent there ( both arrival time & departure time ) & distance from source station
- From `PathStopTime` object, we can easily calculate `duration` spent in a certain station, we'll calculate it in _Second_
- Dataset was downloaded from [here](https://data.gov.in/catalog/indian-railways-train-time-table-0?filters%5Bfield_catalog_reference%5D=332021&format=json&offset=0&limit=6&sort%5Bcreated%5D=desc)

## how does it do ?
- First thing to do, is reading dataset from _CSV_ file
- Calling `readIt()` from `objectify.js` will result in returning an instance of `TrainList` class, via `Promise`
- Now we've a handle, using which we can access all _running train details_
- By _running train details_, I mean, train name, no., both source & destination stations ( station id & name ), path it cover i.e. all intermediate station details including source & destination, time spent standing in each of them & distance between each station pair
- We can easily utilize this objectified dataset for finding some more patterns, like what's average speed of a certain train while moving between _stationOne_ & _stationTwo_ or total runtime of a certain train _( while excluding stop times for all intermediate station(s) )_ and many more ...
- So first we gonna JSONify this dataset ( after some cleaning ), and put that in a JSON file for future utilization
- Each of _data holder classes_ under `TrainList`, is having a `toJSON()` method, using which we can simply convert it to JSON and `storeJSON()` from `objectify.js` will help in putting it into a _target_file_, which will be `./data/train.json` by default
```javascript
readIt().then((value) => {
  storeJSON(JSON.stringify(require('./model/data')
                               .fromDataSet(value)
                               .toJSON(), // Objectifying data set from CSV to
                                          // `TrainList` object is done here
                           null, 4)) // stringifying to JSON, so that it can be
      // written into target file properly
      // also adding some indentation, so that
      // it stays readable ;)
      .then((val) => console.log(val),  // in case of success, prints `success`
            (err) => console.log(err)); // otherwise `error`
}, (err) => console.log(err));          // if reading data fails some how
```
### Generated Dataset :
A small portion is extracted from `./data/train.json`, which holds _all train details_

In `path`, first and last `PathStop` denotes source & destination stations respectively

**Distance is in KiloMeters from Source Station**
```json
{
    "allTrains": [
        {
            "id": "107",
            "name": "SWV-MAO-VLNK",
            "path": [
                {
                    "station": {
                        "code": "SWV",
                        "name": "SAWANTWADI R"
                    },
                    "time": {
                        "arrival": "00:00:00",
                        "departure": "10:25:00",
                        "duration": 37500
                    },
                    "distanceFromSource": "0"
                },
                {
                    "station": {
                        "code": "THVM",
                        "name": "THIVIM"
                    },
                    "time": {
                        "arrival": "11:06:00",
                        "departure": "11:08:00",
                        "duration": 120
                    },
                    "distanceFromSource": "32"
                },
                {
                    "station": {
                        "code": "KRMI",
                        "name": "KARMALI"
                    },
                    "time": {
                        "arrival": "11:28:00",
                        "departure": "11:30:00",
                        "duration": 120
                    },
                    "distanceFromSource": "49"
                },
                {
                    "station": {
                        "code": "MAO",
                        "name": "MADGOAN JN."
                    },
                    "time": {
                        "arrival": "12:10:00",
                        "departure": "00:00:00",
                        "duration": 42600
                    },
                    "distanceFromSource": "78"
                }
            ]
        },
        {
            "id": "108",
            "name": "VLNK-MAO-SWV",
            "path": [
                {
                    "station": {
                        "code": "MAO",
                        "name": "MADGOAN JN."
                    },
                    "time": {
                        "arrival": "00:00:00",
                        "departure": "20:30:00",
                        "duration": 73800
                    },
                    "distanceFromSource": "0"
                },
                {
                    "station": {
                        "code": "KRMI",
                        "name": "KARMALI"
                    },
                    "time": {
                        "arrival": "21:04:00",
                        "departure": "21:06:00",
                        "duration": 120
                    },
                    "distanceFromSource": "33"
                },
                {
                    "station": {
                        "code": "THVM",
                        "name": "THIVIM"
                    },
                    "time": {
                        "arrival": "21:26:00",
                        "departure": "21:28:00",
                        "duration": 120
                    },
                    "distanceFromSource": "51"
                },
                {
                    "station": {
                        "code": "SWV",
                        "name": "SAWANTWADI R"
                    },
                    "time": {
                        "arrival": "22:25:00",
                        "departure": "00:00:00",
                        "duration": 5700
                    },
                    "distanceFromSource": "83"
                }
            ]
        }
    ]
}
```
### Performance :
Result of running
```bash
$ node index.js
```
```bash
success

real	0m3.937s
user	0m4.200s
sys	0m0.486s
```


**_Coming soon ..._**