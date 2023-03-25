import boto3
import os
import urllib.parse
import json
import uuid
from trp import Document
from datetime import datetime

def lambda_handler(event, context):
    api_key = os.environ['OPEN_API_KEY']
    access_key = os.environ['ACCESS_KEY']
    secret_key = os.environ['SECRET_ACCESS_KEY']
    region = os.environ['REGION']
    bucket = os.environ['BUCKET']
    
    ImageName = event['ImageName']
    textract = boto3.client('textract',
    aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region)
    
    response = textract.analyze_document(
        Document={'S3Object': {'Bucket': bucket, 'Name': ImageName}},
        FeatureTypes=["TABLES"])
    # print(response)
    doc = Document(response)
    data = []
    cell_len = 0
    for page in doc.pages:
        for table in page.tables:
            for r, row in enumerate(table.rows):
                cell_len = len(row.cells)
                for c, cell in enumerate(row.cells):
                    data.append(format(cell.text))

    final = [data[i * cell_len:(i + 1) * cell_len] for i in
             range((len(data) + cell_len - 1) // cell_len)]
    keys = [k.strip() for k in final[1]]
    table_data = [dict(zip(keys, values)) for values in final[1:]]
    result = {
        "tableData": table_data
    }
    
    json_res = {
	"statuscode": "200",
	"status": "OK",
	"result": "Good",
	"body": []
    }
    json_res['body']=result['tableData']
    print(json_res)
    
    return json_res
