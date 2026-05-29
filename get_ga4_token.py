"""
Obtiene el refresh token de Google Analytics para el ERP.
Instrucciones:
  1. Asegurate de haber agregado http://localhost:8080 en los Authorized Redirect URIs
     del cliente OAuth2 en Google Cloud Console.
  2. Corre este script: python get_ga4_token.py
  3. El navegador se abrira para que autorices el acceso.
  4. Copia el REFRESH TOKEN que aparece al final y agregalo en Railway como GA4_REFRESH_TOKEN
"""
import json, webbrowser, urllib.parse, urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler

CLIENT_ID     = "883709357660-9af7m6j783av76sjf9amf5o311hb2636.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REDIRECT_URI  = "http://localhost:8080"
SCOPE         = "https://www.googleapis.com/auth/analytics.readonly"

auth_code = None

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code
        params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        auth_code = params.get("code", [None])[0]
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write("<h2>✅ Autorizado. Puedes cerrar esta ventana.</h2>".encode())
    def log_message(self, *args):
        pass

auth_url = (
    "https://accounts.google.com/o/oauth2/auth"
    f"?client_id={CLIENT_ID}"
    f"&redirect_uri={urllib.parse.quote(REDIRECT_URI)}"
    f"&scope={urllib.parse.quote(SCOPE)}"
    "&response_type=code"
    "&access_type=offline"
    "&prompt=consent"
)

print("Abriendo navegador para autorizar Google Analytics...")
webbrowser.open(auth_url)
print("Esperando autorizacion en http://localhost:8080 ...")

server = HTTPServer(("localhost", 8080), Handler)
server.handle_request()

if not auth_code:
    print("ERROR: no se recibio el codigo de autorizacion.")
    exit(1)

data = urllib.parse.urlencode({
    "code":          auth_code,
    "client_id":     CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "redirect_uri":  REDIRECT_URI,
    "grant_type":    "authorization_code",
}).encode()

req = urllib.request.Request(
    "https://oauth2.googleapis.com/token",
    data=data,
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    method="POST"
)

try:
    with urllib.request.urlopen(req) as r:
        resp = json.loads(r.read())
except urllib.error.HTTPError as e:
    print("ERROR al intercambiar codigo:", e.read().decode())
    exit(1)

refresh_token = resp.get("refresh_token")
if not refresh_token:
    print("ERROR: no se obtuvo refresh_token. Respuesta:", resp)
    exit(1)

print("\n" + "="*60)
print("REFRESH TOKEN OBTENIDO:")
print(refresh_token)
print("="*60)
print("\nAgrega estas 3 variables en Railway:")
print(f"  GA4_CLIENT_ID     = {CLIENT_ID}")
print(f"  GA4_CLIENT_SECRET = {CLIENT_SECRET}")
print(f"  GA4_REFRESH_TOKEN = {refresh_token}")
print("\nYa puedes borrar GA4_CREDENTIALS_JSON de Railway (ya no se necesita).")
