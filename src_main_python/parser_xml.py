import os
import json
import xmltodict
import time
from sys import argv
from dateutil.parser import parse
import cPickle as pickle

def parse_xml(input_dir,output_file):
    dir = {}
    for f in os.listdir(input_dir):
        with open(os.path.join(input_dir,f)) as data_file:
            print os.path.join(input_dir,f)
            j = xmltodict.parse(data_file)
            for time_serie in j['ns1:timeSeriesResponse']['ns1:timeSeries']:
                if len(time_serie['ns1:values']) > 0: # there's some values, each value contains multiple data ...
                    name = time_serie['ns1:sourceInfo']['ns1:siteName']
                    dummy = []
                    if not name in dir:
                        dir[name] = {}
                        dir[name]['name'] = name
                        latitude = float(time_serie['ns1:sourceInfo']['ns1:geoLocation']['ns1:geogLocation']['ns1:latitude'])
                        longitude = float(time_serie['ns1:sourceInfo']['ns1:geoLocation']['ns1:geogLocation']['ns1:longitude'])
                        dir[name]['loc'] = {}
                        dir[name]['loc']['type'] = 'Point'
                        dir[name]['loc']['coordinates'] = [longitude, latitude]

                    for value in time_serie['ns1:values']['ns1:value']:
                        time_ = value['@dateTime']
                        flow = float(value['#text'])
                        temp = {}
                        temp['date'] = long(time.mktime(parse(time_).timetuple()))
                        temp['flow'] = flow
                        dummy.append(temp)

                    if not 'flowDate' in dir[name]:
                        dir[name]['flowDate'] = []

                    if dummy != {}:
                        for dum in dummy:
                            dir[name]['flowDate'].append(dum)

                    # TODO: Test all this shit works, gotta set it up to download multiple xml files

    with open("temp_"+output_file, 'wb') as fp:
        pickle.dump(dir, fp)

    for key, val in dir.items():
        if 'flowDate' in val:
            list = map(lambda x: float(x['flow']), val['flowDate'])

            dir[key]['meanFlow'] = sum(list) / len(list)

    with open(output_file, 'wb') as fp:
        pickle.dump(dir, fp)

if __name__ == "__main__":
    parse_xml("./test/", "cosa.p")
    print "DONE!"
