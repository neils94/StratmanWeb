from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.urls import path
import os
import requests

os.environ["YDC_API_KEY"] = 'DpXG1IHe4M55qJl0kMQmvksgNMrnFi15eu12a8Db'

def index(request):
    return render(request, 'templates/index.html')

def search(request):
    query = request.GET.get('q', '')  # 'q' is the name of the input field in the form
    if 'news' in query:
        results = requests.get(
            f"https://api.ydc-index.io/news?query={query}",
            headers=os.getenv("YDC_API_KEY"),
        ).json()        
        return JsonResponse(results)
    else:
        # Handle case when no query is provided
        results = requests.get(
            f"https://api.ydc-index.io/rag?q={query}",
            params={"query:": query},
            headers=os.getenv("YDC_API_KEY"),
            ).json()        
        return JsonResponse(results)
    
urlpatterns = [
    path('home/', index, name='index'),
    path('search/', search, name='search'),
    ]
