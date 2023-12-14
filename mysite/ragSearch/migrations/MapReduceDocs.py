from langchain.chains.combine_documents import collapse_docs, split_list_of_docs
from langchain.chat_models import ChatAnthropic
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser
from langchain.schema.prompt_template import format_document
from langchain.schema.runnable import RunnableParallel, RunnablePassthrough
from functools import partial


llm = ChatAnthropic()
# Prompt and method for converting Document -> str.
document_prompt = PromptTemplate.from_template("{page_content}")
partial_format_document = partial(format_document, prompt=document_prompt)

class MapReduceDocs():
    def __init__(self, document):
        self.document = document


    # The chain we'll apply to each individual document.
    # Returns a summary of the document.
    def map_chain():
        map_chain = (
            {"context": partial_format_document}
            | PromptTemplate.from_template("Summarize this content:\n\n{context}")
            | llm
            | StrOutputParser()
        )
        return map_chain
    # A wrapper chain to keep the original Document metadata
    def doc_metadata(self):
        map_chain = self.map_chain()
        map_as_doc_chain = (
            RunnableParallel({"doc": RunnablePassthrough(), "content": map_chain})
            | (lambda x: self.document(page_content=x["content"], metadata=x["doc"].metadata))
        ).with_config(run_name="Summarize (return doc)")
        return map_as_doc_chain

    # The chain we'll repeatedly apply to collapse subsets of the documents
    # into a consolidate document until the total token size of our
    # documents is below some max size.
    def format_docs(self,docs):
        return "\n\n".join(partial_format_document(doc) for doc in docs)

    def collapse_chain(self):
        collapse_chain = (
        {"context": self.format_docs}
        | PromptTemplate.from_template("Collapse this content:\n\n{context}")
        | llm
        | StrOutputParser()
            )
        return collapse_chain


    def get_num_tokens(self, docs):
        return llm.get_num_tokens(self.format_docs(docs))

    def collapse(
        self,
        docs,
        config,
        token_max=4000,
    ):
        collapse_ct = 1
        while self.get_num_tokens(docs) > token_max:
            config["run_name"] = f"Collapse {collapse_ct}"
            invoke = partial(self.collapse_chain.invoke, config=config)
            split_docs = split_list_of_docs(docs, self.get_num_tokens, token_max)
            docs = [collapse_docs(_docs, invoke) for _docs in split_docs]
            collapse_ct += 1
        return docs

    # The chain we'll use to combine our individual document summaries
    # (or summaries over subset of documents if we had to collapse the map results)
    # into a final summary.

    reduce_chain = (
        {"context": format_docs}
        | PromptTemplate.from_template("Combine these summaries:\n\n{context}")
        | llm
        | StrOutputParser()
    ).with_config(run_name="Reduce")

