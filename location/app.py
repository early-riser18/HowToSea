import json
from flask import Flask, request
from jsonschema import validate, ValidationError
from src.db_client import SpotDB
from src.search import search_with_geospatial, get_recommended_spots
from src.utils import SEARCH_PARAMS_TYPE, typecast_query_params, create_jsonapi_response
from flask_cors import CORS
from src.auth import login_required


app = Flask(__name__)
CORS(app)
app.logger.setLevel("DEBUG")
# Instantiate DB connection
spot_db = SpotDB.from_env()


# Load Schemas
with open("./schema/search_spot.json") as schema_f:
    SEARCH_SPOT_SCHEMA = json.load(schema_f)



@app.errorhandler(Exception)
def catch_all_exception(e):
    app.logger.error(f"Unexpected error: {str(e)}", exc_info=True)
    return create_jsonapi_response(
        500, message="Unable to handle this request at the moment."
    )


@app.route("/")
@login_required()
def hello_world():
    return create_jsonapi_response(200)


@app.route("/id/<string:spot_id>", methods=["GET"])
def get_spot(spot_id):
    try:
        res = spot_db.get_spots([spot_id])
        app.logger.info(res)
    except ValueError as e:
        app.logger.error(e, exc_info=True)
        return create_jsonapi_response(400, content=str(e))
    except Exception as e:
        app.logger.error(e, exc_info=True)
        return create_jsonapi_response(500)
    return create_jsonapi_response(200, content=res)

@login_required()
@app.route("/add/<string:url_params>", methods=["POST"])
def create_spot(spot_id: str):
    pass    

@login_required()
@app.route("/<int:spot_id>/<string:url_params>", methods=["PUT"])
def update_spot(spot_id: str, url_params: str):
    pass

@login_required()
@app.route("/<int:spot_id>/<string:url_params>", methods=["DELETE"])
def delete_spot(spot_id):
    pass


@app.route("/search", methods=["GET"])
def search():

    # Prepare Input
    query_params = {}
    try:
        # Extract query params
        query_params["lat"] = request.args["lat"]
        query_params["lng"] = request.args["lng"]
        query_params["rad"] = request.args["rad"]
        query_params["level"] = request.args.getlist("level")

        # Validate
        app.logger.debug(f"Now calling typecast", exc_info=True)

        query_params = typecast_query_params(query_params, SEARCH_PARAMS_TYPE)
        validate(query_params, SEARCH_SPOT_SCHEMA)

    except (ValueError, KeyError, ValidationError) as e:
        app.logger.debug(f"Error: {str(e)}", exc_info=True)
        return create_jsonapi_response(400)

    app.logger.debug("Extracted query params: %s", query_params)

    try:
        # Search
        search_res = search_with_geospatial(
            lat=query_params["lat"],
            lng=query_params["lng"],
            rad=query_params["rad"],
            keywords={"level": query_params["level"]},
        )
    except ValueError as e:
        return create_jsonapi_response(400)

    return create_jsonapi_response(200, search_res)


@app.route("/rec", methods=["GET"])
def get_recommendation():
    return create_jsonapi_response(200, get_recommended_spots())


@app.route("/test")
def test():
    raise ValueError


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="8000", debug=True)
