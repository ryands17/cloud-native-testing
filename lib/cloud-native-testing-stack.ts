import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as api from '@aws-cdk/aws-apigatewayv2-alpha'
import * as apiIntegration from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as ln from 'aws-cdk-lib/aws-lambda-nodejs'

export class CloudNativeTestingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // API endpoint
    const httpApi = new api.HttpApi(this, 'http-api-example', {
      description: 'HTTP API example',
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: [api.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
    })

    const api1 = new ln.NodejsFunction(this, 'api-1', {
      entry: 'functions/api1.ts',
    })

    const api2 = new ln.NodejsFunction(this, 'api-2', {
      entry: 'functions/api2.ts',
    })

    httpApi.addRoutes({
      path: '/',
      methods: [api.HttpMethod.GET],
      integration: new apiIntegration.HttpLambdaIntegration(
        'api1-integration',
        api1.currentVersion
      ),
    })

    httpApi.addRoutes({
      path: '/another',
      methods: [api.HttpMethod.GET],
      integration: new apiIntegration.HttpLambdaIntegration(
        'api2-integration',
        api2.currentVersion
      ),
    })

    new cdk.CfnOutput(this, 'api-url', { value: httpApi.url! })
  }
}
