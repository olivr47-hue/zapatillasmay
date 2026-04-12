import os
import urllib.request
import urllib.parse
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def supabase_get(tabla):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

def supabase_post(tabla, data):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=HEADERS, method="POST")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

def get_url():
    return SUPABASE_URL

def get_headers():
    return HEADERS