import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as Joi from 'joi';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const schema = Joi.object({
        success: Joi.boolean().required(),
        code: Joi.array().items(Joi.number()).required(),
        data: Joi.object({
            tournamentId: Joi.number().required(),
            registeredPlayers: Joi.array().items(Joi.object({
                walletAddress: Joi.string().required(),
                botIds: Joi.array().items(Joi.number()).required(),
            })).required(),
            finalPlayers: Joi.array().items(Joi.object({
                walletAddress: Joi.string().required(),
                botIds: Joi.array().items(Joi.number()).required(),
            })).required(),
            handHistoryUrl: Joi.string().required(),
            timeStamp: Joi.string().required()
        }).required()
    });

    try {
        const data = await schema.validateAsync(JSON.parse(event.body as string));

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }

    } catch (err: unknown) {

        if (err instanceof Joi.ValidationError) {
            return {
                statusCode: 400,
                body: err.details.map(c => c.message).join('\n')
            }
        }

        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
}