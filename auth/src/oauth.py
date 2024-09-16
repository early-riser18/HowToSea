from os import environ
import requests
from jose import jwt, JWTError
from typing import Any
import abc

SUPPORTED_OAUTH_PROVIDERS = {f"https://{environ.get('AUTH0_DOMAIN')}/": "AUTH0"}


class OAuthServiceProvider(metaclass=abc.ABCMeta):
    """Abstract class to represent an OAuth service provider.
    req

    """

    def __init__(self):
        self._jwks = None
        self.scope = "email openid profile"
        self.audience = environ.get("BACKEND_API_URL")
        self.connection = None  # Auth0 specific, needs refactoring
        self.authorization_url = None
        self.token_url = None
        self.client_id = None
        self.client_secret = None
        self.redirect_uri = None

    @property
    def jwks(self):
        if not self._jwks:
            self._jwks = self.__get_jwks()
        return self._jwks

    @property
    @abc.abstractmethod
    def jwks_endpoint(self):
        pass

    @property
    @abc.abstractmethod
    def issuer_url(self):
        pass

    def __get_jwks(self) -> Any:
        # Get the JWKS keys from Auth0
        jwks = requests.get(self.jwks_endpoint).json()
        return jwks

    def get_authorization_url(self, **kwargs) -> str:

        if kwargs["connection"] == "GOOGLE":
            connection = "google-oauth2"
        else:
            raise ValueError("Invalid id_provider value")

        return (
            f"{self.authorization_url}?"
            f"response_type=code&"
            f"client_id={self.client_id}&"
            f"connection={connection}&"
            f"redirect_uri={self.redirect_uri}&"
            f"scope={self.scope}&"
            f"audience={self.audience}"
        )

    def retrieve_token(self, authorization_code: str) -> Any:

        token_request_body = {
            "grant_type": "authorization_code",
            "code": authorization_code,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
        }

        token_endpoint = self.token_url

        token_response = requests.post(token_endpoint, json=token_request_body)
        token_obj = token_response.json()
        return token_obj


class OAuthServiceProviderFactory:
    """Factory class to return an OAuthServiceProvider concrete class instance based on the issuer URL."""

    def __init__(self):
        self.issuer_map = {
            f"https://{environ.get('AUTH0_DOMAIN')}/": Auth0ServiceProvider,
            # Add more mappings for other issuers
        }

    def get(self, issuer_url):
        issuer_class = self.issuer_map.get(issuer_url)
        if not issuer_class:
            raise ValueError(f"No issuer found for {issuer_url}")
        return issuer_class()


class Auth0ServiceProvider(OAuthServiceProvider):
    def __init__(self):
        super().__init__()
        self.authorization_url = f"https://{environ.get('AUTH0_DOMAIN')}/authorize"
        self.client_id = environ.get("AUTH0_CLIENT_ID")
        self.client_secret = environ.get("AUTH0_CLIENT_SECRET")
        self.redirect_uri = f"{environ.get('SERVICE_URL')}/oauth/callback"
        self.token_url = f"https://{environ.get('AUTH0_DOMAIN')}/oauth/token"

    @property
    def jwks_endpoint(self):
        return f'https://{environ.get("AUTH0_DOMAIN")}/.well-known/jwks.json'

    @property
    def issuer_url(self):
        return f"https://{environ.get('AUTH0_DOMAIN')}/"


class OAuthJWT:
    """
    A class to represent and validate a JWT (JSON Web Token) using OAuth authentication.

    Attributes: https://early-riser18.eu.auth0.com/authorize?response_type=code&client_id=o5Ed5F3PDTT61kn5JnMXdfTndzyjwTkK&connection=google-oauth2&redirect_uri=https://localhost/auth/oauth/callback&scope=email openid profile&audience=https://localhost.
    -----------
    b64_token : str
        The base64-encoded JWT token as a string.
    _token_issuer : OAuthIssuer
        The OAuth issuer obtained from the unverified token claims.
    _payload : dict
        The validated token payload.
    """

    def __init__(
        self, b64_token: str, service_provider: OAuthServiceProvider = None
    ) -> None:
        """Validate the token upon object initialization"""
        self._b64_encoded = b64_token
        if not service_provider:
            self._token_issuer = OAuthServiceProviderFactory().get(
                jwt.get_unverified_claims(self.b64_encoded)["iss"]
            )

        self._payload = self.__validate_jwt()
        self._header = jwt.get_unverified_headers(self.b64_encoded)
        print("Token validated")

    @property
    def payload(self):
        return self._payload

    @property
    def b64_encoded(self):
        return self._b64_encoded

    @property
    def token_issuer(self) -> OAuthServiceProvider:
        return self._token_issuer

    def __validate_jwt(self) -> dict[str, Any]:
        try:
            unverified_header = jwt.get_unverified_header(self.b64_encoded)

            algorithm_key = self.__get_algorithm_key(
                self.token_issuer.jwks, unverified_header["kid"]
            )

            if algorithm_key:
                payload = jwt.decode(
                    self.b64_encoded,
                    algorithm_key,
                    audience=environ.get("BACKEND_API_URL"),
                    issuer=self.token_issuer.issuer_url,
                )
                return payload
            else:
                raise Exception("Unable to find appropriate key")
        except JWTError as e:
            raise Exception(f"Token validation failed: {e}")

    def __get_algorithm_key(self, jwks, kid):

        for key in jwks["keys"]:
            if key["kid"] == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
                return rsa_key
        return None


if __name__ == "__main__":

    authorization_code = "J2xN28BSeaFBOPMUwjGGj1L-mDKQTthdiANZLjufh23YM"
    unverified_token = get_token_from_authorization_code(authorization_code)

    OAuthJWT(unverified_token["access_token"])
