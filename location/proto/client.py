import grpc
from .AuthTokenValidation_pb2_grpc import AuthTokenValidatorStub
from .AuthTokenValidation_pb2 import Token


channel = grpc.insecure_channel("localhost:50051")
stub = AuthTokenValidatorStub(channel)


if __name__ == "__main__":
    token = Token(token="test-token")
    is_token_valid = stub.ValidateToken(token)
    print(is_token_valid)
