FROM python:3.12-bullseye as builder

RUN pip install poetry==1.8

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-interaction --without dev --no-root && rm -rf $POETRY_CACHE_DIR

COPY . ./

# The runtime image, used to just run the code provided its virtual environment
FROM python:3.12-slim-bullseye as runtime

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

COPY . ./

EXPOSE 5000

ENTRYPOINT ["python", "-m", "flask", "run"]