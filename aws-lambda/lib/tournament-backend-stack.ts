import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2-alpha';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

export class TournamentBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webhookOneFn = new NodejsFunction(this, `${id}-webhook-one-fn`, {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      handler: 'handler',
      runtime: Runtime.NODEJS_16_X,
      entry: path.join(__dirname, '../api/webhook-one/index.ts'),
    });

    const api = new LambdaRestApi(this, `${id}-webhook-one-api`, {
      proxy: false,
      handler: webhookOneFn
    });

    api.root.addResource('webhook-one').addMethod('POST');

    const wsConnectHandlerFn = new NodejsFunction(this, `${id}-ws-connect-handler-fn`, {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      handler: 'handler',
      runtime: Runtime.NODEJS_16_X,
      entry: path.join(__dirname, '../api/websocket/connectHandler.ts'),
    });

    const wsDisconnectHandlerFn = new NodejsFunction(this, `${id}-ws-disconnect-handler-fn`, {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      handler: 'handler',
      runtime: Runtime.NODEJS_16_X,
      entry: path.join(__dirname, '../api/websocket/disconnectHandler.ts'),
    })

    const webSocketApi = new WebSocketApi(this, `${id}-ws-api`, {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration('connectIntegration', wsConnectHandlerFn),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration('disconnectIntegration', wsDisconnectHandlerFn),
      }
    });

    new WebSocketStage(this, `${id}-ws-stage`, {
      webSocketApi,
      stageName: 'dev',
      autoDeploy: true
    });
  }
}
