import pandas as pd
f = pd.read_csv('final_data.csv')
d = pd.read_csv('acs2015_county_data.csv')
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

majority_ethn_lst = []
median_income_lst = []
poverty_lst = []

curr_dict = {}
for other_row in d.iterrows():
    other_state = other_row[1][1]
    other_county = other_row[1][2]
    curr_key = (other_state, other_county)
    curr_val = [other_row[1][6], other_row[1][7],other_row[1][8], other_row[1][9], other_row[1][10], other_row[1][11], other_row[1][13], other_row[1][17]]
    curr_dict[curr_key] = curr_val

for row in f.iterrows():
    curr_state = states[row[1][11]]
    curr_county = row[1][15]
    curr_key = (curr_state, curr_county.strip())
    curr_lst = curr_dict[curr_key]
    big_lst = []
    big_lst.append(("hispanic", curr_lst[0]))
    big_lst.append(("white", curr_lst[1]))
    big_lst.append(("black", curr_lst[2]))
    big_lst.append(("native american", curr_lst[3]))
    big_lst.append(("asian", curr_lst[4]))
    big_lst.append(("pacific", curr_lst[5]))
    big_lst.sort(key=lambda tup: tup[1])
    big_lst.reverse()
    current_name = big_lst[0][0]
    majority_ethn_lst.append(current_name)
    curr_median = curr_lst[6]
    if curr_median < 50000:
        median_income_lst.append('< 50,000')
    if curr_median >= 50000 and curr_median < 65000:
        median_income_lst.append('50,000 - 65,000')
    if curr_median >= 65000  and curr_median < 80000:
        median_income_lst.append('65,000 - 80,000')
    if curr_median >= 80000  and curr_median < 95000:
        median_income_lst.append('80,000 - 95,000')
    if curr_median >= 95000:
        median_income_lst.append('> 95,000')
    curr_poverty = curr_lst[7]
    if curr_poverty < 5.0:
        poverty_lst.append('< 5.0%')
    if curr_poverty >= 5.0 and curr_poverty < 10.0:
        poverty_lst.append('5.0% - 10.0%')
    if curr_poverty >= 10.0 and curr_poverty < 20.0:
        poverty_lst.append('10.0% - 20.0%')
    if curr_poverty >= 20.0 and curr_poverty < 30.0:
        poverty_lst.append('20.0% - 30.0%')
    if curr_poverty >= 30.0 and curr_poverty < 35.0:
        poverty_lst.append('30.0% - 35.0%')
    if curr_poverty >= 35.0:
        poverty_lst.append('> 35.0%')





df = pd.read_csv('the-counted-2015.csv')
majority_ethn_column = pd.DataFrame({'majority_ethn': majority_ethn_lst})
median_income_column = pd.DataFrame({'Median_income': median_income_lst})
poverty_column = pd.DataFrame({'Poverty_percentage': poverty_lst})
df = df.merge(majority_ethn_column, left_index = True, right_index = True)
df = df.merge(median_income_column, left_index = True, right_index = True)
df = df.merge(poverty_column, left_index = True, right_index = True)
df.to_csv('real_data3.csv')
