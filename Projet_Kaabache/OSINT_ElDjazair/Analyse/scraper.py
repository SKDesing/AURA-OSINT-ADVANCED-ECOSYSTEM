import requests
from fake_useragent import UserAgent
from stem import Signal
from stem.control import Controller

class MoudjahidScraper:
    def __init__(self):
        self.ua = UserAgent()
        self.proxies = self._get_tor_proxies()  # Rotation IP via Tor

    def _get_tor_proxies(self):
        with Controller.from_port(port=9051) as controller:
            controller.authenticate()
            controller.signal(Signal.NEWNYM)  # Nouvelle identité Tor
        return {"http": "socks5h://127.0.0.1:9050", "https": "socks5h://127.0.0.1:9050"}

    def scrape(self, target_url):
        try:
            response = requests.get(
                target_url,
                headers={"User-Agent": self.ua.random},
                proxies=self.proxies,
                timeout=10
            )
            return response.text if response.status_code == 200 else None
        except:
            return None

# Usage
if __name__ == "__main__":
    scraper = MoudjahidScraper()
    data = scraper.scrape("https://exemple.com/cible")
    print(data[:500])  # Afficher les 500 premiers caractères