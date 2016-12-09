import csv
import json

jsonfile = open('multiline.json', 'w')
countries = {}

with open("weaterdata.csv", "rb") as csvfile:
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

	
