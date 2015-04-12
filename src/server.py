# coding = utf-8
from flask import Flask, send_from_directory, request, jsonify, Response
import logging
import json
import time
import pprint
from pymongo import MongoClient
from dateutil.parser import parse

CLIENT = MongoClient()
DB = CLIENT.SpaceApps2015
COL = DB.point_col
app = Flask(__name__)


@app.route('/rivers', methods=['POST'], )
def pos():
    """
        1. parsear fecha
    :return:
    """
    # Parse date
    j_data = request.get_json(force=True)
    date_lower = long(time.mktime(parse(j_data['date_lower']).timetuple()))
    date_upper = long(time.mktime(parse(j_data['date_upper']).timetuple()))
    swlat = long(j_data['rect']['swlat'])
    nelat = long(j_data['rect']['nelat'])
    swlon = long(j_data['rect']['swlon'])
    nelon = long(j_data['rect']['nelon'])
    data_set = list(COL.find())
    # print date_
    re_dic = []
    total_dates = 0
    print "Filter data!"
    for data_item in data_set:
        # data_item['flowDate'] = [i for i in data_item['flowDate'] if i['date'] == date_]
        longit = data_item['loc']['coordinates'][0]
        latit = data_item['loc']['coordinates'][1]
        if nelat > latit > swlat and nelon > longit > swlon:
            dict = {}
            dict['name'] = data_item['name']
            dict['loc'] = data_item['loc']
            dict['meanFlow'] = data_item['meanFlow']
            dict['flowDate'] = [i for i in data_item['flowDate'] if i['date'] >= date_lower and i['date'] <= date_upper]
            total_dates = len(dict['flowDate'])
            if len(dict['flowDate']) != 0:
                re_dic.append(dict)

    geo_array = []
    print "gen data!!!"
    for i in range(total_dates):
        dummy_dir = {'type': "FeatureCollection", 'features': []}
        for point in re_dic:
            # pprint.pprint(point)
            dummy_point = {"type": "Feature"}
            dummy_point['geometry'] = {'type': "Point"}
            dummy_point['geometry']['coordinates'] = point['loc']['coordinates']
            dummy_point['properties'] = {}
            dummy_point['properties']['popupContent'] = point['name']
            dummy_point['properties']['meanFlow'] = point['meanFlow']
            try:
                dummy_point['properties']['flow'] = point['flowDate'][i]['flow']
                dummy_dir['features'].append(dummy_point)
            except IndexError:
                print
        geo_array.append(dummy_dir)


    return Response(json.dumps(geo_array), mimetype='application/json')


@app.route('/')
def ini():
    return "Hello"


if __name__ == "__main__":
    app.run(debug=True)
