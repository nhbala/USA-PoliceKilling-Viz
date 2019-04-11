
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import geocoder
import csv
f = open('police_shootings_full.csv')
csv_f = csv.reader(f)
states = {
        'AK': 'Alaska',
        'AL': 'Alabama',
        'AR': 'Arkansas',
        'AS': 'American Samoa',
        'AZ': 'Arizona',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DC': 'District of Columbia',
        'DE': 'Delaware',
        'FL': 'Florida',
        'GA': 'Georgia',
        'GU': 'Guam',
        'HI': 'Hawaii',
        'IA': 'Iowa',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'MA': 'Massachusetts',
        'MD': 'Maryland',
        'ME': 'Maine',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MO': 'Missouri',
        'MP': 'Northern Mariana Islands',
        'MS': 'Mississippi',
        'MT': 'Montana',
        'NA': 'National',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'NE': 'Nebraska',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NV': 'Nevada',
        'NY': 'New York',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'OR': 'Oregon',
        'PA': 'Pennsylvania',
        'PR': 'Puerto Rico',
        'RI': 'Rhode Island',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VA': 'Virginia',
        'VI': 'Virgin Islands',
        'VT': 'Vermont',
        'WA': 'Washington',
        'WI': 'Wisconsin',
        'WV': 'West Virginia',
        'WY': 'Wyoming'
}

geolocator = Nominatim(user_agent="3300")
counter = 0
final_lst = []
for row in csv_f:
    if counter == 0:
        counter+=1
        continue
    else:
        final_lst.append((row[14], row[15]))
print(final_lst)


f_lst = []
for val in final_lst:
    location = geolocator.reverse((val[0], val[1]), timeout=10)
    if location is None:
        print(val)
        f_lst.append((val[0], val))
    else:
        splitting = (location.address).split(",")
        final_county = location.address
        for part in splitting:
            if "County" in part:
                curr = part.strip()
                curr_split = curr.split("County")
                final_county = curr_split[0]
                break
            elif "Parish" in part:
                second_split = (part.strip()).split("Parish")
                final_county = second_split[0]
                break
            elif "St. Louis" in part:
                final_county = "St. Louis city"
                break
            elif "D.C." in part:
                final_county = "District of Columbia"
                break
            elif "21203" in part:
                final_county = "Baltimore city"
                break
            elif "SF" in part:
                final_county = "San Francisco"
                break
            elif "Anchorage" in part:
                final_county = "Anchorage Municipality"
                break
            elif "Fairbanks North Star" in part:
                final_county = "Fairbanks North Star"
                break
            elif "Kenai Peninsula" in part:
                final_county = "Kenai Peninsula Borough"
                break
        if "Salt Lake City" in final_county:
            final_county = "Salt Lake"
        elif "Syracuse, Utah" in final_county:
            final_county = "Davis"
        elif "Draper, Utah" in final_county:
            final_county = "Salt Lake"
        elif "Stillwater, Oklahoma" in final_county:
            final_county = "Payne"
        elif "Guthrie, Oklahoma" in final_county:
            final_county = "Logan County"
        elif "NYC" in final_county:
            final_county = "New York"
        elif "Worcester, Massachusetts," in final_county:
            final_county = "Worcester"
        elif "Shawnee, Oklahoma" in final_county:
            final_county = "Pottawatomie"
        elif "Ogden, Utah" in final_county:
            final_county = "Weber"
        elif "Carson City, Nevada" in final_county:
            final_county = "Carson City"
        elif "Cushing, Oklahoma," in final_county:
            final_county = "Payne"
        print(final_county)
        f_lst.append(location)
print(f_lst)
