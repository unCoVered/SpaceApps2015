# coding = utf-8
# SpaceApps2015
# @author: 
import urllib2
from concurrent.futures import ThreadPoolExecutor

def download(url, state):
	print "Download " +  state + " in " + folder + "/" + state + ".json"
	file_ = open(folder + "/" + state +".json", "w")
	response = urllib2.urlopen(url)
	file_.write(response.read())
	file_.close()
	print "Download complete " + state

STATE = ["al", "ak", "aq", "az", "ar", "ca", "co", "ct", "de", "dc", "fl", "ga", "gu", "hi", "id",\
 	"il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv",\
 	"nh", "nj", "nm", "ny", "nc", "nd", "mp", "oh", "ok", "or", "pa", "pr", "ri", "sc", "sd", "tn",\
	"tx", "ut", "vt", "vi", "va", "wa", "wv", "wi", "wy"]
folder = "json_original"

for i in STATE:
	# Download information state
	url = "http://waterservices.usgs.gov/nwis/iv/?format=json,1.1&stateCd="\
		+ i + "&startDT=2015-04-01&endDT=2015-04-11&parameterCd=00060&siteType=ST&siteStatus=active"
	download(url, i)
