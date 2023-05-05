"""
Useful utility function for extracting the required information from a log output
"""

import json
  
# Opening JSON file
try:
    f = open('./utils/generationStats.txt')
    print('Loaded ./utils/generationStats.txt')
except FileNotFoundError:
    try :
        f = open('../utils/generationStats.txt')
        print('Loaded ../utils/generationStats.txt')
    except FileNotFoundError:
        print('File not found')
        exit()
  
desired_stats = [
                    'pieces',
                    'kings',
                    'avrDist',
                    'backline',
                    'corners',
                    'edges',
                    'centre2',
                    'centre4',
                    'centre8',
                    'defended',
                    'attacks'
                ]

"""desired_stats = [
                    'naive',
                    'guided'
                ]"""


desired_fields = [
                    'mean',
                    'stdDev'
                ]

"""desired_fields = [
                    'score',
                    'winloss'
                ]"""

results = {k: {x: [] for x in desired_fields} for k in desired_stats}

for line in f:
    #print(line)
    try :
        data = json.loads(line)
        for stat in desired_stats:
            if stat in data:
                #print(stat + ': ' + str(data[stat]))
                try:
                    stats = data[stat]
                    #print(stats)
                    for field in desired_fields:
                        #print(field in stats)
                        if field in stats:
                            #results[stat][field].append(stats[field])
                            results[stat][field].append(round(stats[field],4))
                except TypeError:
                    pass

    except json.decoder.JSONDecodeError:
        pass
    #data = json.loads(line)
    #print(data)

print(results)

#data = json.load(f)
  
# Iterating through the json
# list
#for i in data['emp_details']:
#    print(i)
  
# Closing file
f.close()