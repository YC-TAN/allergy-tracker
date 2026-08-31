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

### Documentation
Style Guide: [Google Python style](http://google.github.io/styleguide/pyguide.html)
```
    def example_function(args):
    """Example function with types documented in the docstring.

    Args:
        param1 (int): The first parameter.
        param2 (str): The second parameter.

    Returns:
        bool: The return value. True for success, False otherwise.

    Yields:
        int: The next number in the range of 0 to `n` - 1.

    Raises:
        AttributeError: The ``Raises`` section is a list of all exceptions
            that are relevant to the interface.
        ValueError: If `param2` is equal to `param1`.

    Examples:
        Examples should be written in doctest format, and should illustrate how
        to use the function.

        >>> print([i for i in example_generator(4)])
        [0, 1, 2, 3]
    """
```
