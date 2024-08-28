from http import HTTPStatus

from flask import Response


class NoContentResponse(Response):
    def __init__(self):
        super().__init__(status=HTTPStatus.NO_CONTENT, response={})
