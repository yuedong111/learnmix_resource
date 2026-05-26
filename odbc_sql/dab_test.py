import requests

url = "https://datahub-api-dab-dev.fonterrachina.com.cn"
r = requests.get(url)
print(r.text)

# dab validate --config  dab_config.json