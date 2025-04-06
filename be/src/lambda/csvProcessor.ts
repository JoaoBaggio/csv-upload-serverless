import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import readline from "readline";
import { Readable } from "stream";

// Variáveis de ambiente
const isLocal = process.env.LOCALSTACK === "true";
const region = process.env.AWS_REGION || "us-east-1";
const queueName = process.env.CSV_QUEUE_NAME || "csv-queue";

// Usa "localstack" ao invés de "localhost" para rodar corretamente no Docker
const endpoint = isLocal ? "http://localstack:4566" : undefined;

// Instância do S3
const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

// Instância do SQS
const sqs = new SQSClient({
  region,
  endpoint,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

// URL completa da fila
const queueUrl = process.env.SQS_QUEUE_URL; // produção pode definir URL completa

// Função que processa o CSV
const processCSV = async (bucket: string, key: string) => {
  console.log(`📥 Processando CSV: ${key}`);
  console.log(`📦 Bucket: ${bucket}`);
  console.log(`🧪 isLocal: ${isLocal}`);
  console.log(`🌍 endpoint: ${endpoint}`);
  console.log(`📬 SQS URL: ${queueUrl}`);
  console.log(`📦 SQS Name: ${process.env.CSV_QUEUE_NAME}`);
  console.log(`📦 SQS ENV: ${process.env.SQS_QUEUE_URL}`);

  const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!Body) throw new Error("❌ Erro ao obter o arquivo do S3");

  const stream = Body as Readable;
  const rl = readline.createInterface({ input: stream });

  let headers: string[] = [];
  let batch: Record<string, string>[] = [];
  let isFirstLine = true;

  for await (const line of rl) {
    const values = line.split(",");

    if (isFirstLine) {
      headers = values.map((v) => v.trim());
      isFirstLine = false;
      continue;
    }

    const item: Record<string, string> = {};
    headers.forEach((header, index) => {
      item[header] = values[index]?.trim() ?? "";
    });

    batch.push(item);

    if (batch.length === 100) {
      await sendBatchToSQS(batch);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await sendBatchToSQS(batch);
  }
};


// Envia lote para o SQS
const sendBatchToSQS = async (batch: Record<string, string>[]) => {
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(batch),
    })
  );
};

// Handler principal
export const handler = async (event: any) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    await processCSV(bucket, key);
  }
};
