from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/search")
async def search(request: Request, query: str):
    # Here you can handle the query, e.g., search in a database
    # For now, let's just redirect to a new URL with the query
    new_url = f"http://example.com/results?query={query}"
    return {"redirect": new_url}
