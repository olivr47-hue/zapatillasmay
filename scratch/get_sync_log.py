import urllib.request, json

url = "https://zapatillasmay-production.up.railway.app/ml/sync/log"
print(f"Fetching sync log from {url}...")
try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error: {e}")
