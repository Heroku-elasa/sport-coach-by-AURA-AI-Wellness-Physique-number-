
import requests
import sys

def check_health(url):
  """
  Checks the health of a given URL by making a GET request.
  Exits with status code 0 for a successful request (2xx status code),
  and 1 otherwise.
  """
  try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
    print(f"Health check successful for {url}: Status code {response.status_code}")
    sys.exit(0)
  except requests.exceptions.RequestException as e:
    print(f"Health check failed for {url}: {e}", file=sys.stderr)
    sys.exit(1)

if __name__ == "__main__":
  if len(sys.argv) != 2:
    print("Usage: python health_check.py <url>", file=sys.stderr)
    sys.exit(1)
  
  url_to_check = sys.argv[1]
  check_health(url_to_check)
