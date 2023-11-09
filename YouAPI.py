#Globals
import os
import requests


#Globals
os.environ["YDC_API_KEY"] = 'DpXG1IHe4M55qJl0kMQmvksgNMrnFi15eu12a8Db'
os.environ["OPENAI_API_KEY"] = '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'
os.environ["OPENAI_ORGANIZATION_ID"] = 'org-aSkXwZFHRVVS7xRO9uTJaMC3'
url = "https://api.ydc-index.io/search"


class YouApi():
    def __init__(self):
        self.headers=  {"X-API-Key": os.getenv("YDC_API_KEY")}
    def get_urls(self, query):
        params = {"query": query, "num_web_results": 3, "offset": 0, "country": 'US'}
        response = requests.get(url, headers= self.headers, params=params).json()
        return [hit["url"] for hit in response["hits"]]
    
    def get_general_search_snippets(self, query):
        
        
        results = requests.get(
            f"https://api.ydc-index.io/search?query={query}",
            headers=self.headers,
        ).json()

        # We return many text snippets for each search hit so
        # we need to explode both levels
        return "\n".join(["\n".join(hit["snippets"]) for hit in results["hits"]])
    
    def get_news_snippets(self, query):
        params = {"query": query}
        return requests.get(
            f"https://api.ydc-index.io/news?q={query}",
            params=params,
            headers=self.headers,
        ).json()
    

    def perform_rag(self,query):
        params = {"query": query}
        response = requests.get(
                            "https://api.ydc-index.io/rag?query={query}",
                            params=params,
                            headers=self.headers
                            ).json()
        return response
        
u = YouApi()
results = u.perform_rag()
print(results)
