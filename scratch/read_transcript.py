import json

filepath = r"C:\Users\User\.gemini\antigravity\brain\984c4385-f55e-450e-9cd0-be0f86888af8\.system_generated\logs\transcript.jsonl"
print(f"Reading transcript: {filepath}")
try:
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            step = json.loads(line)
            if step.get("type") == "USER_INPUT":
                print(f"\n--- USER INPUT ---")
                print(step.get("content"))
except Exception as e:
    print(f"Error: {e}")
