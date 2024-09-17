import abc
import requests
import logging
from os import environ
from jose import jwt, JWTError
from typing import Any

logger = logging.getLogger("app")
SUPPORTED_OAUTH_PROVIDERS = {f"https://{environ.get('AUTH0_DOMAIN')}/": "AUTH0"}


class OAuthServiceProvider(metaclass=abc.ABCMeta):
    """Abstract class to represent an OAuth service provider.
    req

    """

    def __init__(self):
        self._jwks = None
        self.scope = "email openid profile"
        self.audience = environ.get("BACKEND_API_URL")
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
        jwks = requests.get(self.jwks_endpoint).json()
        return jwks

    def get_authorization_url(self, additional_params: str = "", **kwargs) -> str:
        return (
            f"{self.authorization_url}?"
            f"response_type=code&"
            f"client_id={self.client_id}&"
            f"redirect_uri={self.redirect_uri}&"
            f"scope={self.scope}&"
            f"audience={self.audience}&"
            f"{additional_params}"
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

    def get_authorization_url(self, additional_params: str = "", **kwargs) -> str:

        if kwargs["connection"] == "GOOGLE":
            additional_params += "connection=google-oauth2&"
        else:
            raise ValueError("Invalid id_provider value")
        additional_params += "prompt=select_account&"
        return super().get_authorization_url(additional_params, **kwargs)


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

    # authorization_code = "J2xN28BSeaFBOPMUwjGGj1L-mDKQTthdiANZLjufh23YM"
    # unverified_token = get_token_from_authorization_code(authorization_code)
    # OAuthJWT(unverified_token["access_token"])

    auth0_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImppeFNaX1puRHdWVXNnMTA1TzZMUyJ9.eyJpc3MiOiJodHRwczovL2Vhcmx5LXJpc2VyMTguZXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDY2ZTkwODM3NmZmZmE5YzU1YjA4MDQyYyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0IiwiaWF0IjoxNzI2NTQ4MTc1LCJleHAiOjE3MjY2MzQ1NzUsImd0eSI6InBhc3N3b3JkIiwiYXpwIjoibzVFZDVGM1BEVFQ2MWtuNUpuTVhkZlRuZHp5andUa0sifQ.crLUcsfDbh5g7QMneQMk1ERlmM0uYy3_9wh2c0EpC0xUwkHRXHMy_K_4KCgLYUFkYX9LknWSXDRgp2tw9vZRQiLR8ASoSmLAaTkZ2-nqOoiEEeLpFATv9B1KSHgbtk0LhqJL75EzwpISd0PyqKie6eWs80M4aLhiHzW7KYcjvhivuum53HLri7F04A7VdrUGz0kTBazeZemUmJg9XGYf9eW2rS_ZhgdzZyn78Vj--bnHiZDvVtl9wvFJNCpD_fgXnkHlMBOi0bLU5j12K6OO47uxy_N2dbk5uphEt0A-rAxhDh48Nedre6w-VehdRxqmOVQR1ukhdh7AgPZ3a_y2wg"
    OAuthJWT(auth0_token)
