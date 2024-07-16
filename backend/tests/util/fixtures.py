import json
import os

from _pytest.fixtures import fixture


@fixture
def chalice_environment():
    print("Configuring chalice environment...")
    config_path = '.chalice/config.json'

    if not os.path.exists(config_path):
        print(f"Chalice config path {config_path} not existing.")
        return

    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)

    stages = config_data.get('stages')
    if not isinstance(stages, dict):
        print("The 'stages' object is missing or invalid.")
        return

    testing_stage = stages.get('testing')
    if not isinstance(testing_stage, dict):
        print("The key 'testing' is missing or invalid.")
        return

    environment_variables = testing_stage.get('environment_variables')
    if not isinstance(environment_variables, dict):
        print("Property 'environment_variables' are missing or not valid.")
        return
    print(f"environment: {environment_variables.items()}")
    for key, value in environment_variables.items():
        os.environ.setdefault(key, value)
        print(f"Set {key}={value} in os.environ")
