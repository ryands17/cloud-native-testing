import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as api from '@aws-cdk/aws-apigatewayv2-alpha'
import * as apiIntegration from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { apiHandler, testHandler } from './utils'

export class CloudNativeTestingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // API endpoint
    const httpApi = new api.HttpApi(this, 'http-api', {
      description: 'HTTP API',
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

    const api1 = apiHandler(this, 'api1')
    const api2 = apiHandler(this, 'api2')

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

    testHandler('api1', this, 'test-handler', {
      environment: { API_URL: httpApi.url! },
    })

    testHandler('api2', this, 'test-handler', {
      environment: { API_URL: httpApi.url! },
    })

    new cdk.CfnOutput(this, 'api-url', { value: httpApi.url! })
  }
}
