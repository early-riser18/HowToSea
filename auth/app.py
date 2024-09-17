from os import environ
import json
from flask import Flask, request, redirect, jsonify
from src.utils import signup_user, password_login
from src.oauth import OAuthJWT, Auth0ServiceProvider


app = Flask(__name__)
app.secret_key = environ.get("FLASK_SECRET_KEY")
app.logger.setLevel("DEBUG")


@app.route("/signup", methods=["POST"])
def signup():
    # TODO See how you can refactor it more neatly, in a more SOLID approach.
    request_body = json.loads(request.get_data())
    app.logger.debug("signup values provided: %s", request_body)

    try:
        username = request_body["username"]
        email = request_body["email"]
        password = request_body["password"]
    except KeyError:
        return "Missing required values", 400

    try:
        res = password_signup(username, email, password)
    except ValueError as e:
        match str(e):
            case "email":
                error = "EmailAlreadyTaken"
            case "username":
                error = "UsernameAlreadyTaken"
            case "password":
                error = "InvalidPassword"
            case _:
                error = "UnknownError"
        return {"error": error}, 409
    except Exception as e:
        app.logger.error(e, exc_info=True)
        return "An error occured. Try again later.", 500

    return res, 200


@app.route("/login", methods=["POST"])
def login():

    request_body = json.loads(request.get_data())
    try:
        username = request_body["username"]
        password = request_body["password"]

    except KeyError:
        return "Missing required values", 400

    try:
        res = password_login(username, password)
    except Exception as e:
        app.logger.error(e, exc_info=True)
        return "An error occured. Try again later.", 500

    return res, 200


@app.route("/oauth/authorize")
def oauth_authorize():
    """
    Redirects to the appropriate authorization URL based on the service provider.
    Expects the 'provider' and 'connection' query parameters.
    Eg: /oauth/authorize?provider=auth0&connection=GOOGLE
    Returns:
        Response: A redirect to the OAuth authorization URL
    Raises:
        KeyError: If the 'provider' or 'connection' arguments are missing from the request.
    """

    try:
        service_provider = request.args["provider"]
    except KeyError:
        return "Missing provider", 400

    if service_provider == "auth0":
        try:
            connection = request.args["connection"]
        except KeyError:
            return "Missing connection", 400
        oauth_authorization_url = Auth0ServiceProvider().get_authorization_url(
            connection=connection
        )
    else:
        return "Invalid provider", 400

    return redirect(oauth_authorization_url)


@app.route("/oauth/callback")
def oauth_callback():
    """
    Handles the OAuth callback by processing the authorization code provided by the OAuth provider.

    This function performs the following steps:
    1. Retrieves the token using the authorization code.
    2. Extracts and verifies the access token from the retrieved token.
    3. Returns a JSON response containing the access token, token type, and expiration time.

    Returns:
        Response: A JSON response containing the access token, token type, and expiration time.
                  If an error occurs, returns an appropriate error message and status code.
    """

    # # TODO: validate that the state is correct accross requests to prevent CSRF
    try:
        authorization_code = request.args["code"]
    except:
        return "An error occured while authenticating", 500
    unverified_token = Auth0ServiceProvider().retrieve_token(authorization_code)

    try:
        unverified_access_token = unverified_token["access_token"]
    except KeyError as e:
        return f"Invalid token: {e}", 400

    access_token = OAuthJWT(unverified_access_token)

    return jsonify(
        {
            "access_token": access_token.b64_encoded,
            "token_type": "Bearer",
            "expires_in": unverified_token["expires_in"],
        }
    )


@app.route("/")
def hello_world():
    return "Hello, World!"
