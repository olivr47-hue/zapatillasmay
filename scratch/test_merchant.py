# -*- coding: utf-8 -*-
import os
import sys
import json

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
import google_sa
import routers.merchant as merchant

def main():
    # Load .env variables
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    parts = line.strip().split("=", 1)
                    if len(parts) == 2:
                        key, val = parts[0].strip(), parts[1].strip()
                        # Clean quotes if present
                        if val.startswith('"') and val.endswith('"'):
                            val = val[1:-1]
                        os.environ[key] = val

    # Override merchant credentials with GA4 if merchant isn't set, as they might share the same service account
    if not os.getenv("MERCHANT_CREDENTIALS_JSON"):
        ga4_creds = os.getenv("GA4_CREDENTIALS_JSON")
        if ga4_creds:
            print("Using GA4_CREDENTIALS_JSON for Google Merchant authentication...")
            os.environ["MERCHANT_CREDENTIALS_JSON"] = ga4_creds
            merchant.MERCHANT_CREDENTIALS = ga4_creds

    print("Merchant ID:", merchant.MERCHANT_ID)
    
    # Run diagnostic
    print("\n--- Diagnostic ---")
    diag = merchant.diagnostico()
    print(json.dumps(diag, indent=2))
    
    if not diag.get("cuenta_ok"):
        print("\n[!] Connection failed. Showing last error:")
        print(diag.get("ultimo_error"))
        return

    # Fetch account info
    print("\n--- Account Info ---")
    cuenta = merchant.cuenta()
    print(json.dumps(cuenta, indent=2))

    # Fetch account-level issues
    print("\n--- Account Issues ---")
    issues = merchant.account_issues()
    print(json.dumps(issues, indent=2))

    # Fetch feeds
    print("\n--- Feeds ---")
    feeds = merchant.feeds()
    print(json.dumps(feeds, indent=2))

    # Fetch product status summary
    print("\n--- Product Issues Summary ---")
    prod_summary = merchant.resumen_problemas()
    print(json.dumps(prod_summary, indent=2))

    # Fetch detailed product issues
    print("\n--- Detailed Product Issues ---")
    prods = merchant.estado_productos(limite=5, solo_con_problemas=True)
    print(json.dumps(prods, indent=2))

if __name__ == "__main__":
    main()
