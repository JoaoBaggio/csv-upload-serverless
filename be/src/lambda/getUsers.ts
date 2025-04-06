import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

export const handler = async (event: any) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      console.log("Options");

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: "",
      };
    }
    // Recuperando os parâmetros da query string
    const { email, first_name, last_name, limit = 10, lastKey } = event.queryStringParameters || {};

    // Verificando se os parâmetros estão corretos
    if (limit && isNaN(Number(limit))) {
      throw new Error("O parâmetro 'limit' deve ser um número válido.");
    }

    const params: any = {
      TableName: process.env.DYNAMODB_TABLE!,
      Limit: Number(limit),
      ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined,
    };

    // Configurando os filtros
    if (email || first_name || last_name) {
      params.FilterExpression = [];
      params.ExpressionAttributeValues = {};

      if (email) {
        params.FilterExpression.push("email = :email");
        params.ExpressionAttributeValues[":email"] = { S: email };
      }
      if (first_name) {
        params.FilterExpression.push("first_name = :first_name");
        params.ExpressionAttributeValues[":first_name"] = { S: first_name };
      }
      if (last_name) {
        params.FilterExpression.push("last_name = :last_name");
        params.ExpressionAttributeValues[":last_name"] = { S: last_name };
      }

      params.FilterExpression = params.FilterExpression.join(" AND ");
    }

    console.log("📋 Parâmetros da consulta DynamoDB:", params);

    // Enviando a consulta para o DynamoDB
    const result = await dynamoDB.send(new ScanCommand(params));

    // Verificando se há resultados
    if (!result.Items) {
      throw new Error("Nenhum item encontrado no DynamoDB.");
    }

    // Mapeando os dados para um formato mais amigável
    const items = result.Items.map(item => ({
      first_name: item.first_name?.S,
      last_name: item.last_name?.S,
      email: item.email?.S,
    }));

    // Retornando os resultados
    return {
      statusCode: 200,
      body: JSON.stringify({
        items,
        lastKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    console.error("❌ Erro no processamento:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Erro interno no servidor",
        error: error || "Desconhecido",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};
