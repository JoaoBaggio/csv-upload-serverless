#!/bin/bash

# Define as configurações do AWS CLI para apontar para o LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566

# Criar bucket S3
aws --endpoint-url=$AWS_ENDPOINT_URL s3 mb s3://csv-bucket

# Criar fila SQS
aws --endpoint-url=$AWS_ENDPOINT_URL sqs create-queue --queue-name csv-queue

# Criar tabela DynamoDB
aws --endpoint-url=$AWS_ENDPOINT_URL dynamodb create-table \
    --table-name Users \
    --attribute-definitions AttributeName=email,AttributeType=S \
    --key-schema AttributeName=email,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

echo "Recursos criados com sucesso!"
