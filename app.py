from flask import Flask, render_template, jsonify
import requests
from bs4 import BeautifulSoup
import pandas as pd

app = Flask(__name__)

# Function to scrape and process player data
def fetch_player_data():
    url = 'https://www.ligainsider.de/stats/kickbase/marktwerte/tag/gewinner/'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    rows = soup.find_all('tr')

    data = []
    for row in rows:
        cols = row.find_all('td')
        if len(cols) > 1:
            player_name = cols[2].text.strip()
            team_name = cols[3].text.strip()
            position = cols[4].text.strip()
            market_value = float(cols[6].text.strip().replace('€', '').replace('.', '').replace(',', '.'))
            price_increase = float(cols[8].text.strip().replace('€', '').replace('.', '').replace(',', '.'))

            data.append({
                'Player': player_name,
                'Team': team_name,
                'Position': position,
                'Market Value': market_value,
                'Price Increase': price_increase,
                'Value Increase Ratio': (price_increase / market_value) * 100
            })

    # Sort data by 'Value Increase Ratio' and return it as a list
    sorted_data = sorted(data, key=lambda x: x['Value Increase Ratio'], reverse=True)
    return sorted_data

@app.route('/')
def home():
    players = fetch_player_data()
    return render_template('index.html', players=players[:5])

@app.route('/load_more', methods=['GET'])
def load_more():
    players = fetch_player_data()
    return jsonify(players)

if __name__ == '__main__':
    app.run(debug=True)
