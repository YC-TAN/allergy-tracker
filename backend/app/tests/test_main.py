def test_read_root(client):
    response = client.get("/health-check")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from backend"}