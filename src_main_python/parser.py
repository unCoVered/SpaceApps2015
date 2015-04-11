import os
import json
import cPickle as pickle

def parse_data(input_dir, output_file):
    dir = {}
    for f in os.listdir(input_dir):
        with open(os.path.join(input_dir,f)) as data_file:
            j = json.load(data_file)
            for time_serie in j['value']['timeSeries']:
                name = time_serie['sourceInfo']['siteName']
                if not name in dir:
                    dir[name] = {}
                    dir[name]['name'] = time_serie['sourceInfo']['siteName']

                    dir[name]['coord'] = {}
                    dir[name]['coord']['latitude'] = float(time_serie['sourceInfo']['geoLocation']['geogLocation']['latitude'])
                    dir[name]['coord']['longitude'] = float(
                        time_serie['sourceInfo']['geoLocation']['geogLocation']['longitude'])

                dummy = {}
                dummy['date'] = time_serie['values'][0]['value'][0]['dateTime']
                dummy['flow'] = time_serie['values'][0]['value'][0]['value']
                try:
                    dir[name]['flowDate'].append(dummy)
                except KeyError:
                    dir[name]['flowDate'] = []
                    dir[name]['flowDate'].append(dummy)

        for key, val in dir.items():
            list = map(lambda x: float(x['flow']), val['flowDate'])

            dir[key]['meanFlow'] = sum(list) / len(list)

        with open(output_file, 'wb') as fp:
            pickle.dump(dir, fp)

if __name__ == "__main__":
    parse_data("./input", "cosa.p")
    print "DONE!"