from auth0.authentication import Database, GetToken
from auth0.management import Auth0
from os import environ

database = Database(environ.get("AUTH0_DOMAIN"), environ.get("AUTH0_CLIENT_ID"))
auth0_token_endpoint = GetToken(
    environ.get("AUTH0_DOMAIN"),
    environ.get("AUTH0_CLIENT_ID"),
    environ.get("AUTH0_CLIENT_SECRET"),
)

client_token = auth0_token_endpoint.client_credentials(
    "https://{}/api/v2/".format(environ.get("AUTH0_DOMAIN"))
)
auth0 = Auth0(environ.get("AUTH0_DOMAIN"), client_token["access_token"])


def password_signup(username: str, email: str, password: str) -> dict[str]:

    if check_if_username_already_exists(username):
        raise ValueError("username")

    if check_if_email_already_exists(email):
        raise ValueError("email")

    if test_password_strength(password):
        raise ValueError("password")

    return database.signup(
        username=username,
        email=email,
        password=password,
        connection=environ.get("AUTH0_DB_CONNECTION"),
    )


def password_login(username: str, password: str) -> dict[str]:
    return auth0_token_endpoint.login(
        username=username,
        password=password,
        grant_type="password",
        audience=environ.get("BACKEND_API_URL"),
    )


def test_password_strength(password: str) -> bool:
    """Implements tests according to the Auth0 password policy in place"""

    return len(password) < 8


def check_if_username_already_exists(username) -> bool:
    users = auth0.users.list(q=f'username:"{username}"')
    return users["length"] > 0


def check_if_email_already_exists(email) -> bool:
    res = auth0.users_by_email.search_users_by_email(email)
    return len(res) > 0


def login_with_jwt(jwt: str):
    """
    Then, extract the email address to match against your database.
        - if email already exist with current provider, perform a sign in
        - If email already exist but with different provider, check from where and inform user to log in via that mean
        - if email does not exist, create user and return your own Authorization JWT (signed by yourself)

    """

    # Look for email address is db. if not found perform signup. If found, check provider and sign in or ask to use correct provider
    pass


if __name__ == "__main__":
    print(client_token["access_token"])
    auth0.users.list(q=f'username:"test"')
