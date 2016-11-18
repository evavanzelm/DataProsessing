#!/usr/bin/env python
# Name: Eva van Zelm
# Student number: 10002352
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import json

from pattern.web import URL, DOM

TARGET_URL = "https://en.wikipedia.org/wiki/List_of_countries_by_suicide_rate"

# import unicode characters
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

url = URL(TARGET_URL)
html = url.download()
dom = DOM(html)

countries = {}
for table in dom.by_tag("table")[1:2]:
    for country in table.by_tag("tr")[1:]:
        # empty the list with series info
        

        # title
        for name in (country.by_tag("a")[:1]):
            country_name = str(name.content)

        for rate in country.by_tag("td")[-5]:
            country_rate = str(rate)

        countries[country_name] = country_rate

print json.dumps(countries)



       



