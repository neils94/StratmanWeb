from langchain.document_loaders import UnstructuredURLLoader
from langchain.document_transformers import Html2TextTransformer
import datetime



def load_url(url):
    loader = UnstructuredURLLoader(urls=url)
    data = loader.load()
    return data
def transform_html_to_text(data):
    transformer = Html2TextTransformer()
    transformed = transformer.transform_documents(data)
    return transformed[0].page_content[:]

