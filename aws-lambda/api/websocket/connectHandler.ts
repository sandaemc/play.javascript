import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Caveat: works only with native websocket implementation
 * @param event 
 * @returns 
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.info(JSON.stringify(event));

    return {
        statusCode: 200,
        body: JSON.stringify(event)
    }
}