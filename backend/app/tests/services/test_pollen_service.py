import json
import pytest
from pathlib import Path

from app.services import pollen_service

FIXTURE_DIR = Path(__file__).parent.parent / "fixtures"


@pytest.fixture
def mock_pollen_response():
    return json.loads((FIXTURE_DIR / "pollen_chch.json").read_text())


def test_parse_allergen_data():
    content = '<span class="status-medium-good" style="font-weight:720; font-size:14px">Imminent</span></br>Hazelnut, Alder</br>'
    result = pollen_service.parse_allergen_data(content)
    expected = ("imminent", ["hazelnut", "alder"])
    assert result == expected


def test_parse_allergen_data_no_match():
    assert pollen_service.parse_allergen_data("<div>Unmatched</div>") is None


def test_extract_allergen_data(mocker, mock_pollen_response):
    mocker.patch.object(
        pollen_service, "fetch_allergen_data", return_value=mock_pollen_response
    )
    location_path = "/towns-cities/regions/christchurch/locations/christchurch"
    result = pollen_service.extract_allergen_data(location_path)
    expected = [
        ( "imminent", ["hazelnut", "alder"]),
        ("low", ["cypress", "cedar", "fungal spores"])
    ]

    assert result == expected
