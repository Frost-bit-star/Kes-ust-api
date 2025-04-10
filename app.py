from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

def get_exchange_rate():
    """Fetch the exchange rate for Tether (USDT) to Kenyan Shilling (KES) from CoinGecko."""
    url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=kes'
    response = requests.get(url)
    data = response.json()
    return data.get('tether', {}).get('kes')

@app.route('/convert', methods=['GET'])
def convert_kes_to_usdt():
    """Convert KES to USDT using the current exchange rate."""
    exchange_rate = get_exchange_rate()

    if exchange_rate is None:
        return jsonify({"error": "Unable to retrieve exchange rate."}), 500

    amount_kes = request.args.get('kes', type=float)

    if amount_kes is None:
        return jsonify({"error": "No KES amount provided."}), 400

    amount_usdt = amount_kes / exchange_rate

    return jsonify({
        "kes": amount_kes,
        "usdt": round(amount_usdt, 2),
        "exchange_rate": round(exchange_rate, 4)
    })

if __name__ == '__main__':
    app.run(debug=True)
