import pymongo
from sys import argv
import pickle
from pprint import  pprint

if __name__ == '__main__':
    data = pickle.load(open(argv[1],'rb'))

    client = pymongo.MongoClient(argv[2])
    db = client.SpaceApps2015
    col = db.point_col
    col.ensure_index([("loc", pymongo.GEOSPHERE)])

    i = 0
    total = len(data)

    for _, v in data.items():
        if i % 30 == 0:
            print "Data:", float(i)/total*100,"%"

        i += 1
        col.insert(v)


    # points = db.temp_collection.points
    # points.ensure_index([("loc", GEO2D)])
    #
    # i = 0
    # for _, v in data.items():
    #     if i % 30 == 0:
    #         print "Data:", float(i)/total*100,"%"
    #
    #     dummy = {}
    #     dummy['loc'] = {}
    #     dummy['loc']['type'] = "Point"
    #     dummy['loc']['coordinates'] = [v['coord']['latitude'], v['coord']['longitude']]
    #     i += 1
    #     points.insert(v)

    print "DONE"
