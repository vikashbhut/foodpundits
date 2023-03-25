import json
import os
import boto3
from trp import Document
import openai

def lambda_handler(event, context):
    openai.api_key = os.environ['OPEN_API_KEY']
    
    # ImageName = event['ImageName']
    name = event['name']
    age = event['age']
    sex = event['sex']
    weight = event['weight']
    low_bp = event['low_bp']
    high_bp = event['high_bp']
    diabetes = event['diabetes']
    thyroid = event['thyroid']
    physical_activity = event['physical_activity']
    ingredients = event['ingredients']

    model_id = "gpt-3.5-turbo"
    completion = openai.ChatCompletion.create(
        model=model_id,
        messages=[
        {"role": "user", "content": "how much {} is good for health with {}  low blood pressure, {} high blood pressure, {} diabetes, {} thyroid, sex is {} , and age is {} , weight is {}kg, and {} physical activity? answer in one line".format(ingredients, low_bp , high_bp , diabetes , thyroid , sex , age , weight ,physical_activity)}
        ]
        )
    print("Hey "+name+", "+completion.choices[0].message.content)
    json_res = {
        "statuscode": "200",
        "status": "OK",
        "body": ""
    }
    json_res['body']="Hey "+name+", "+completion.choices[0].message.content
    print(json_res)
    
    return json_res
