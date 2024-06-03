import json
from flask import Response, make_response

SEARCH_PARAMS_TYPE = {
    "lat": float,
    "lng": int,
    "rad": float,
    "level": list,
}


def typecast_query_params(query_params: dict[any, None], mapping: dict):
    """
    Casts URL query parameters string values to specified types.

    Args:
        query_params (dict): Dictionary of query parameters.
        mapping (dict): Dictionary mapping parameter names to desired types.

    Returns:
        dict: Dictionary with query parameters cast to specified types.
    """
    formatted = {}
    for q_param, q_val in query_params.items():
        if q_val is not None:
            try:
                target_type = mapping[q_param]
                if hasattr(target_type, "__origin__"):
                    inner_type = target_type.__args__[0]
                    if target_type.__origin__ is list:
                        formatted[q_param] = [inner_type(item) for item in q_val]
                    elif target_type.__origin__ is tuple:
                        formatted[q_param] = tuple(inner_type(item) for item in q_val)
                else:
                    formatted[q_param] = mapping[q_param](q_val)
            except KeyError:
                raise KeyError(f"No mapping found for key '{q_param}'")
        else:
            formatted[q_param] = None

    return formatted


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


if __name__ == "__main__":
    good_user_input = {"lat": 32, "lng": 22, "rad": -1, "level": "easy"}
    none_user_input = {"lat": None, "lng": None, "rad": None, "level": None}
    missing_key_user_input = {"lat": 32, "rad": -1, "level": "easy"}
    unexpected_key_user_input = {"lat": 32, "bad_key": 22, "rad": -1, "level": "easy"}
    wrong_type_user_input = {"lat": 1, "lng": 22.2, "rad": -1, "level": "easy"}

    print(typecast_query_params(wrong_type_user_input, SEARCH_PARAMS_TYPE))
