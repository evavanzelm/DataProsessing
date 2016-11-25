import csv
import json

jsonfile = open('data2.json', 'w')
countries = {}

with open("set2.csv", "rb") as csvfile:
	fieldnames = ("Country","Data")
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

	
