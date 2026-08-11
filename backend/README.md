### Development

To run the app in dev mode:
```bash
uv run fastapi dev app/main.py
```

Local server: http://127.0.0.1:8000

> documentation
[Swagger UI](http://localhost:8000/docs)
[ReDoc](http://localhost:8000/redoc)


### Test and Linting
- Pytest
- TestClient: APIs
- ruff: Linting and Formatting

> pytest: `uv run pytest <file> -v`

> ruff: 
```bash
ruff check .
ruff check . --fix 
ruff check <file>
ruff check . --watch
ruff rule --all
```
