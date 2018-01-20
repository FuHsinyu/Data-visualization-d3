import json

scores = open('scores.json')
sales = open('sales.json')
summary = open('data.json', 'w')

sales = json.load(sales)
scores = json.load(scores)

games = []

platforms = {
	'Dreamcast': 'Dreamcast',
	'GameCube': 'GameCube',
	'DS': 'DS',
	'3DS': '3DS',
	'Switch': 'Switch',
	'Nintendo 64': 'N64',
	'Wii': 'Wii',
	'Wii U': 'Wii U',
	'PC': 'PC',
	'Xbox': 'Xbox',
	'Xbox 360': 'Xbox 360',
	'Xbox One': 'Xbox One',
	'PlayStation': 'PS',
	'PlayStation 2': 'PS2',
	'PlayStation 3': 'PS3',
	'PlayStation 4': 'PS4',
	'PlayStation Vita': 'Vita',
	'Game Boy Advance': 'GBA',
	'PSP': 'PSP'
}

genres = {
	'Role-Playing': 'RPG',
	'Action': 'Action',
	'Shooter': 'Shooter',
	'Puzzle': 'Puzzle',
	'Simulation': 'Simulator',
	'Adventure': 'Adventure',
	'Platform': 'Platformer',
	'Sports': 'Sports',
	'Racing': 'Racing',
	'Fighting': 'Fighting',
	'Strategy': 'Strategy',
	'Misc': 'Miscellaneous'
}

sales_d = {}


counter = 0
for sale in sales:
	counter += 1
	sales_d[(sale['title'], sale['platform'])] = {
		'genre': genres[sale['genre']],
		'platform': platforms[sale['platform']],
		'publisher': sale['publisher'],
		'sales': int( float( sale['sales']['Global']) * 1e6)
	}
	
print('VGcharts: %d' %counter)
counter = 0
games = []

for score in scores:
	counter += 1
	if (score['title'], score['platform']) in sales_d:
		if score['metascore'] != 'tbd' and score['userscore'] != 'tbd':
			sale = sales_d[(score['title'], score['platform'])]
			game = {
				'title' : score['title'],
				'platform' : sale['platform'],
				'publisher' : sale['publisher'],
				'developer' : score['developer'],
				'released' : score['released'],
				'genre' : sale['genre'],
				'sales' : sale['sales'],
				'metascore' : score['metascore'],
				'reviews_count' : score['reviews_count'],
				'userscore' : str( int( float( score['userscore']) * 10)),
				'user_reviews_count' : score['user_count'],
				'rating' : score['rating']
				}
			games.append(game)
		#	print('%4d: %s, %s' %(counter, score['title'], sale['platform']))

print('Metacritic: %d' %counter)
json.dump(games, summary, indent = 4)

