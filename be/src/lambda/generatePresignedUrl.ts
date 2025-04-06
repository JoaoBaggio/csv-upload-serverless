import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "us-east-1", // Substitua pela sua região AWS
});

const BUCKET_NAME = "csv-bucket-2-joaobaggio";

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
    console.log("gerando a Pre signed URL");
    const { fileName, fileType } = JSON.parse(event.body);

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Parâmetros inválidos" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      };
    }

    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 minutos

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, key }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    console.error("Erro ao gerar URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao gerar URL" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  }
};
