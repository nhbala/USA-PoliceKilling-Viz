import pandas as pd
df = pd.read_csv('real_datafinal.csv').fillna(value = "undetermined")

dict_now = {}
for row in df.iterrows():
    current_value = row[1]['armed']
    if current_value in dict_now.keys():
        dict_now[current_value] += 1
    else:
        dict_now[current_value] = 1

array_over = []
for key in dict_now:
    if dict_now[key] <= 10:
        array_over.append(key)

df.loc[(df.armed.isin(array_over)), 'armed'] = "Other"
df.to_csv('datum.csv', index=False)


# for row in df.iterrows():
#     current_value = row[1]['armed']
#     if current_value not in array_over:
#         df.loc[df["armed"].isin(array_over), "Sites"] = "fuck"
#     print(row)
