# BeatzGear
![main](https://github.com/Severon96/beatzgear/actions/workflows/backend.yml/badge.svg?branch=main)

Hardware Management for use in between multiple Persons.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tests](#tests)

## Installation

### Prerequisites

- Python 3.12
- Docker and Docker Compose

Install those dependencies, using the official docs for your system as guide.

The project uses poetry for dependency management. If you haven't installed poetry, yet, install it by using the official installer.

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

After that, install the backend dependencies.

```bash
poetry install 
```


## Usage

The project environment is already configured in the docker-compose.

> [!CAUTION]
> When setting up this tool for production, set up a new realm or at least regenerate  all client secrets, since they are maintained in this repository for testing purposes.

Frontend is still wip.

## Tests
The tests are set up as End-2-End tests. This means we are using a real Keycloak instance (the one from the docker-compose.yml) and real postgres databases for the tests.

If you haven't already a keycloak running, start it by using docker-compose.

```bash
docker compose up -d keycloak
```

The Keycloak instance will import the initial realm, used for tests.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
