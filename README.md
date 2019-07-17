# indian-railway
A collection of utility Scripts, for manipulating Indian Railway's Running Train(s) Dataset, written with :heart:, using _JavaScript_

### what does it do ?
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


**_Coming soon ..._**