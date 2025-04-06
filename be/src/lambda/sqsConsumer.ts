import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

// Função auxiliar para mapear objetos para o formato do DynamoDB
const mapObjectToDynamo = (obj: { [key: string]: any }): { [key: string]: any } => {
  const dynamoItem: { [key: string]: any } = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === "string") {
        dynamoItem[key] = { S: value };
      } else if (typeof value === "number") {
        dynamoItem[key] = { N: String(value) };  // N para números
      } else if (Array.isArray(value)) {
        dynamoItem[key] = { L: value.map(v => ({ S: String(v) })) };  // L para listas de strings
      } else if (typeof value === "object" && value !== null) {
        dynamoItem[key] = { M: mapObjectToDynamo(value) };  // M para objetos aninhados
      }
    }
  }
  
  return dynamoItem;
};

// Função para processar o batch e inserir no DynamoDB
const processBatch = async (batch: any[]) => {
  console.log("📝 Processando batch:", batch);  // Log do batch
  
  const writeRequests = batch.map(item => {
    // Mapeia o item para o formato DynamoDB
    const dynamoItem = mapObjectToDynamo(item);

    return {
      PutRequest: {
        Item: dynamoItem,
      },
    };
  });

  const batchParams = {
    RequestItems: {
      [process.env.DYNAMODB_TABLE!]: writeRequests,  // Tabela DynamoDB
    },
  };

  try {
    const result = await dynamoDB.send(new BatchWriteItemCommand(batchParams));
    console.log(`✔️ ${batch.length} registros inseridos no DynamoDB.`);
  } catch (error) {
    console.error(`❌ Erro ao inserir registros no DynamoDB: ${error}`);
  }
};

// Função principal que será executada pela Lambda
export const handler = async (event: any) => {
  for (const record of event.Records) {
    console.log("📥 Processando a mensagem da fila SQS:", record.body);
    
    const batch = JSON.parse(record.body);  // Assumindo que o corpo da mensagem é o batch JSON
    
    if (Array.isArray(batch)) {
      await processBatch(batch);
    } else {
      console.error("❌ Formato de mensagem inválido. Esperado um array de objetos.");
    }
  }
};