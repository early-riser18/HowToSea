import json
import boto3
import time
import logging

SERVICE_NAMES = ["location"]
CLUSTER_NAME = "how-to-sea-prod"

logger = logging.getLogger()
logger.setLevel("INFO")


def lambda_handler(raw_event, context):
    """
    AWS Lambda function handler to update ECS services' desired task count and verify the update.

    Parameters:
    raw_event (str): JSON-formatted string containing the desired service count.
    context: Lambda Context runtime methods and attributes.

    Returns:
    dict: Response with status code.
    """
    logger.info("Received event: %s", raw_event)
    print("Event received", raw_event)

    try:
        # Check if lambda was triggered by Cloudwatch Event
        raw_event["source"]
    except KeyError:
        try:
            event = json.loads(raw_event["body"])
            # Validate input
            desired_cnt = event["desired_count"]
            assert type(desired_cnt) == int
            desired_cnt = 1 if desired_cnt > 0 else 0

        except (AssertionError, KeyError) as e:
            logger.error("Invalid input: %s", e)
            return {
                "statusCode": 400,
            }
        return scale_service(desired_cnt)

    return scale_service(0)


def scale_service(task_cnt: int):
    client = boto3.client("ecs")

    for s in SERVICE_NAMES:
        logger.info("Updating service %s to desired count: %d", s, task_cnt)
        client.update_service(cluster=CLUSTER_NAME, service=s, desiredCount=task_cnt)

    def check_services() -> bool:
        services_described = client.describe_services(
            cluster=CLUSTER_NAME, services=SERVICE_NAMES
        )
        all_services_ok = all(
            s["runningCount"] == task_cnt for s in services_described["services"]
        )
        return all_services_ok

    # Retries for 2 minutes every 5 seconds
    for _ in range(24):
        if check_services():
            return {
                "statusCode": 200,
            }
        logger.info("Retrying...")
        time.sleep(5)


if __name__ == "__main__":
    test_event = {
        "headers": {
            "header1": "value1",
        },
        "source": "aws.events",
        "body": '{"desired_count": 1}',
    }

    print(test_event)
    res = lambda_handler(test_event, {})
    print(res)

"""
{
  "headers": {
    "header1": "value1",
  },
  "queryStringParameters": {
    "parameter1": "value1,value2",
  },
  "requestContext": {
    "accountId": "123456789012",
    "apiId": "<urlid>",
    },
    "domainName": "<url-id>.lambda-url.us-west-2.on.aws",
    "domainPrefix": "<url-id>",
    "http": {
      "method": "POST",
      "path": "/my/path",
      "protocol": "HTTP/1.1",
      "sourceIp": "123.123.123.123",
      "userAgent": "agent"
    },
    "requestId": "id",
  },
  "body": "Hello from client!",
}

"""
