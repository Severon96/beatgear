#!/bin/bash

if [[ -n "$1" ]]; then
    alembic revision --autogenerate -m "$1"
else
    echo "Error: Revision message ist required."
    exit 1
fi
