#!/usr/bin/env python
# Name: Eva van Zelm
# Student number: 10002352
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

# import unicode characters
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    list = []
    
    for i in dom.by_tag("div.lister-item-content")[:50]:
        # empty the list with series info
        series = []

        # title
        for j in i.by_tag("a")[:1]:
            series.append(str(j.content))

        # rating
        for j in i.by_tag("strong"):
            series.append(str(j.content))

        # genre 
        for j in i.by_tag("span.genre")[:1]:
            genres = j.content[1:]
            genres = genres.rstrip()
            series.append(str(genres))

        # actors
        actors = []
        for j in i.by_tag("p")[2]:
            for k in j.children:
                actors.append(str(k))
        series.append(", " .join(actors))

        # runtime
        for j in i.by_tag("span.runtime")[:1]:
            series.append(str(filter(lambda x:x>='0' and x<='9', j.content)))
        list.append(series)

    return list# replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    for i in range(0,50):
        writer.writerow(tvseries[i])
    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)