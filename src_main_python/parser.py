# coding=utf-8
# SpaceApps2015
# @author:

import json
import os
import pprint
from concurrent.futures import ThreadPoolExecutor

def parser(ruta):
	"""
		Parse a json file
	"""

FOLDER_JSON = './json_original'
FOLDER_DST = './json_parser'
list_ = os.listDirectory(FOLDER_JSON)

executor = ThreadPoolExecutor(max_workers=4)

for i in list_:
	executor(parser, FOLDER_JSON + '/' + i)

