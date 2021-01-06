from flask import Flask, current_app, request
from UnleashClient import UnleashClient
import requests

app = Flask(__name__)

client = UnleashClient(url="http://unleash/api",app_name="My Program",refresh_interval=1)
client.initialize_client()

@app.route('/', methods=['GET'])
def do_homepage():
  statusCode = request.args.get('statusCode');

  if statusCode == "500":
    return 500;

  if client.is_enabled("EnableStaticContent"):
    r = requests.get('https://raw.githubusercontent.com/agardnerIT/OddFiles/master/index2.html')
    return r.text
  else:
    return current_app.send_static_file('index.html')
