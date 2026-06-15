# Python Server Template

```python
from fastmcp import FastMCP
import httpx
import os

mcp = FastMCP(name="my-server")
api_base = os.environ["API_BASE"]
api_token = os.environ["API_TOKEN"]

@mcp.tool()
def list_items(input: dict) -> dict:
    with httpx.Client(base_url=api_base, headers={"Authorization": f"Bearer {api_token}"}) as client:
        response = client.get("/items", params=input)
        if response.status_code >= 400:
            return {
                "error": {
                    "code": "upstream_error",
                    "message": "List failed",
                    "details": response.text,
                }
            }
        return response.json()

if __name__ == "__main__":
    mcp.run()
```
