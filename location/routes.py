import json
from flask import Flask, request
from jsonschema import validate, ValidationError
from db_client import SpotDB
from search import search_with_geospatial
from utils import SEARCH_PARAMS_TYPE, typecast_query_params, create_jsonapi_response

app = Flask(__name__)

# Instantiate DB connection
spot_db = SpotDB.from_env()


# Configure logging
app.logger.setLevel("DEBUG")


@app.before_request
def log_request_info():
    app.logger.info("Headers: %s", request.headers)
    app.logger.info("Body: %s", request.get_data())


def create_jsonapi_response(
    code: int, content: dict = {}, message: str = None
) -> Response:
    """
    Creates a JSON:API formatted response.

    Args:
        code (int): HTTP status code.
        content (dict): Response payload, added as 'data' if successful code, 'errors' otherwise.
        message (str, optional): Additional message for the response.

    Returns:
        Response: Flask response object with JSON:API formatted body and appropriate headers.
    """

    is_success = False if (code // 100) in [4, 5] else True
    status = "success" if is_success else "error"
    payload_type = "data" if is_success else "errors"

    response = {
        "code": code,
        "status": status,
        payload_type: content,
        "message": message,
    }
    return make_response(
        json.dumps(response), code, {"Content-Type": "application/vnd.api+json"}
    )


@app.route("/")
def hello_world():
    return create_jsonapi_response(200)


@app.route("/<string:spot_id>", methods=["GET"])
def get_spot(spot_id):
    try:
        res = spot_db.get_spots([spot_id])
        logging.info(res)
    except Exception as e:
        logging.info(e)
        return create_jsonapi_response(404)
    return create_jsonapi_response(200, content=res)


@app.route("/add/<string:url_params>", methods=["POST"])
def create_spot(spot_id: str):
    pass


@app.route("/<int:spot_id>/<string:url_params>", methods=["PUT"])
def update_spot(spot_id: str, url_params: str):
    pass


@app.route("/<int:spot_id>/<string:url_params>", methods=["DELETE"])
def delete_spot(spot_id):
    pass


@app.route("/search", methods=["GET"])
def search():
    # Extract query params
    query_params = {}
    try:
        query_params["lat"] = request.args["lat"]
        query_params["lng"] = request.args["lng"]
        query_params["rad"] = request.args["rad"]
        query_params["level"] = request.args.getlist("level")
    except KeyError as e:
        return create_jsonapi_response(
            400, message="Invalid query parameters provided."
        )

    app.logger.debug("Extracted query params: %s", query_params)

    try:
        # Validation
        query_params = typecast_query_params(query_params, SEARCH_PARAMS_TYPE)
        validate(query_params, SEARCH_SPOT_SCHEMA)
        # Search
        search_res = search_with_geospatial(
            lat=query_params["lat"],
            lng=query_params["lng"],
            rad=query_params["rad"],
            keywords={"level": query_params["level"]},
        )
    except (ValueError, KeyError, ValidationError) as e:
        app.logger.debug(f"Error: {str(e)}", exc_info=True)
        return create_jsonapi_response(400)

    return create_jsonapi_response(200, search_res)


@app.route("/test")
def test():
    return "<h1>Successful test!</h1>"
