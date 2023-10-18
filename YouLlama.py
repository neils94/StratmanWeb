from langchain.llms.huggingface_pipeline import HuggingFacePipeline
import os
import requests
from langchain.retrievers.you import YouRetriever
from langchain.chains import RetrievalQA
from transformers import LlamaPreTrainedModel
config = None
llm = HuggingFacePipeline.from_model_id(
    model_id="bigscience/",
    task="text-generation",
    model_kwargs={"temperature": 0, "max_length": 64},
)

os.environ["AUTH_KEY"] = "DpXG1IHe4M55qJl0kMQmvksgNMrnFi15eu12a8Db"
yr = YouRetriever()
qa = RetrievalQA.from_chain_type(llm=llm, chain_type="map_reduce", retriever=yr)


if not os.getenv("AUTH_KEY"):
  raise RuntimeError("You need to set both AUTH_KEY and COHERE_API_KEY environment variables to proceed")


