import ast


def body_to_dict(body: bytes):
    if body is None:
        return {}

    return ast.literal_eval(body.decode('utf-8'))