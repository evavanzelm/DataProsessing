import csv
import json
import sys
reload(sys)
sys.setdefaultencoding("ISO-8859-1")

jsonfile = open('data.json', 'w')
countries = {}

with open("women_graduates_per_field.csv", "rb") as csvfile:
	fieldnames = ("city","date", "average", "min", "max")
	reader = csv.DictReader(csvfile, fieldnames)
	jsonfile.write('[')
	for row in reader:
	    json.dump(row, jsonfile)
	    jsonfile.write(', \n')
	jsonfile.write(']')



	# for row in reader:
	# 	for element, data in enumerate(row):
	# 		countries[element] = data
		
# 		print countries
# print countries
		
# json.dump(countries)

	
