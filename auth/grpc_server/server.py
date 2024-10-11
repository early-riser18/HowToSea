import logging
from how_to_sea_auth_grpc.server import ServerABC
from how_to_sea_auth_grpc.utils import TokenStatus
from src.oauth import OAuthJWT
from os import environ
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("app")


class gRPCServer(ServerABC):

    def __init__(self, port):
        super().__init__(port)

    def ValidateToken(self, request, context):
        logger.debug("Server received %s %s", request.token, context)
        try:
            OAuthJWT(request.token)
        except Exception as e:
            logger.debug("Failed token validation: %s", e, exc_info=True)
            return TokenStatus(valid=0)
        return TokenStatus(valid=1)


if __name__ == "__main__":
    gRPCServer(port=environ.get("GRPC_PORT")).serve()
