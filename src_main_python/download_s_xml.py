import urllib2
import xmltodict
import cPickle as pickle

if __name__ == '__main__':
    print "reading url"
    file = urllib2.urlopen("http://waterservices.usgs.gov/nwis/iv/?format=waterml,1.1&stateCd=va&startDT=2015-01-01&endDT=2015-04-01&parameterCd=00060&siteType=ST")
    file_ = open("va1.xml", "w")
    print "read"
    file_.write(file.read())
    file_.close()

    print "DONE"
