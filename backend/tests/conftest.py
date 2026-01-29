import os
import sys

import pytest
from fastapi.testclient import TestClient

# Ensure the backend package is importable whether pytest is run from repo root
# or inside the backend directory.
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from main import app  # noqa: E402

@pytest.fixture
def client():
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c
