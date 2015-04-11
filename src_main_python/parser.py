import os
import json
from sys import argv
import cPickle as pickle

def parse_data(input_dir, output_file):
    dir = {}
    for f in os.listdir(input_dir):
        with open(os.path.join(input_dir,f)) as data_file:
            print os.path.join(input_dir,f)
            try:
                j = json.load(data_file)
                for time_serie in j['value']['timeSeries']:
                    name = time_serie['sourceInfo']['siteName']
                    if not name in dir:
                        dir[name] = {}
                        dir[name]['name'] = time_serie['sourceInfo']['siteName']

                        dir[name]['coord'] = {}
                        lat = float(time_serie['sourceInfo']['geoLocation']['geogLocation']['latitude'])
                        long = float(time_serie['sourceInfo']['geoLocation']['geogLocation']['longitude'])

                        dir[name]['coord']['latitude'] = lat
                        dir[name]['coord']['longitude'] = long
                        dir[name]['sphere'] = [lat, long]

                    dummy = {}
                    if len(time_serie['values']) > 0 and len(time_serie['values'][0]['value']) >0:
                        dummy['date'] = time_serie['values'][0]['value'][0]['dateTime']
                        dummy['flow'] = time_serie['values'][0]['value'][0]['value']
                        try:
                            dir[name]['flowDate'].append(dummy)
                        except KeyError:
                            dir[name]['flowDate'] = []
                            dir[name]['flowDate'].append(dummy)
                    else:
                        print "some error"
            except ValueError:
                print "dummy"

    for key, val in dir.items():
        if 'flowDate' in val:
            list = map(lambda x: float(x['flow']), val['flowDate'])

            dir[key]['meanFlow'] = sum(list) / len(list)

    with open(output_file, 'wb') as fp:
        pickle.dump(dir, fp)

if __name__ == "__main__":
    parse_data(argv[1], argv[2])
    print "DONE!"
