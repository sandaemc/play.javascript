import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.info(JSON.stringify(event));
    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }
}