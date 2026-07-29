#### Pytest commands

- version: `pytest --version`
- `pytest`: run all files whose names follow the form test_*.py or *_test.py in the current directory and its subdirectories.
- `pytest <filename.py>`: run all tests in a specific file
- `pytest dir_name/`: run all tests in specific directory
- `pytest tests/test_mod.py::test_func`: run a specific test within a module
- `pytest tests/test_mod.py::TestClass`: run all tests in specific class
- `pytest tests/test_mod.py::TestClass::test_method`: run a specific test in specific class

*flags*
- `-q or --quiet`: brief output reporting
- `-v or --verbose`
- `-V or --version`
- `-h or --help`
- `-k EXPRESSION`