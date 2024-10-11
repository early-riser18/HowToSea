import logging
from functools import wraps
from flask import request
from src.utils import create_jsonapi_response
from how_to_sea_auth_grpc.client import Client
from how_to_sea_auth_grpc.utils import Token

logger = logging.getLogger()
from os import environ

grpc_auth_client = Client(hostname=environ.get("AUTH_SERVICE_HOSTNAME"), port=50051)

def login_required():
    """
    A decorator to ensure that a valid authorization token is present in the request headers.
    It proxies the request to a token validation service.

    If the token is invalid or an error occurs during validation,
    a 401 JSON API response is returned with an error message. If the token is valid, the
    decorated function is executed.

    Returns:
            function: The decorated function if the token is valid, otherwise a 401 JSON API response.
    """

    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            logger.debug("Headers: %s", request.headers)
            logger.debug("Body: %s", request.get_data())
            try:
                authorization_header = request.headers["Authorization"]
                bearer_token = authorization_header.split(" ", 1)[1]
                token_status = grpc_auth_client.validate_auth_token(
                    Token(token=bearer_token)
                )
                if not token_status.valid:
                    raise Exception("Invalid token")
            except Exception as e:
                logger.debug("Error while validating the token %s", e, exc_info=True)
                return create_jsonapi_response(
                    401, message="Error while validating the token"
                )
            logger.debug("Valid token, proceeding...")
            return f(*args, **kwargs)

        return decorated

    return decorator
