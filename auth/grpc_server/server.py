import grpc
from concurrent import futures

from grpc_server import AuthTokenValidation_pb2_grpc
from grpc_server.AuthTokenValidation_pb2 import TokenStatus, Token
from src.oauth import OAuthJWT, Auth0ServiceProvider
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("app")

class AuthTokenValidatorServicer(AuthTokenValidation_pb2_grpc.AuthTokenValidatorServicer):
    def ValidateToken(self, request: Token, context):
        logger.debug("Server received %s %s", request.token, context)
        try:
            OAuthJWT(request.token)
        except Exception as e:
            logger.debug("Failed token validation: %s", e, exc_info=True)
            return TokenStatus(valid=0)
        return TokenStatus(valid=1)
    


def serve():
    port = 50051
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    AuthTokenValidation_pb2_grpc.add_AuthTokenValidatorServicer_to_server(AuthTokenValidatorServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    logger.info("gRPC server running on port %s", port)
    server.wait_for_termination()
    logger.info("Turning off gRPC server...")


if __name__ == "__main__":
    serve()