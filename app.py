from flask import Flask, current_app, request
from UnleashClient import UnleashClient
import requests

app = Flask(__name__)

client = UnleashClient("http://unleash:4242/api", "My Program")
client.initialize_client()

@app.route('/', methods=['GET'])
def do_homepage():
  statusCode = request.args.get('statusCode');

  if statusCode == "500":
  	return 500;
  if client.is_enabled("NormalDelivery", default_value=True):
    return current_app.send_static_file('index.html')
  else:
    r = requests.get('https://raw.githubusercontent.com/agardnerIT/OddFiles/master/index2.html')
    return r.text
