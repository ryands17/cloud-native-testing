import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as api from '@aws-cdk/aws-apigatewayv2-alpha'
import * as apiIntegration from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as sfn from 'aws-cdk-lib/aws-stepfunctions'
import * as sfnTasks from 'aws-cdk-lib/aws-stepfunctions-tasks'
import { lambdaHandler, testHandler } from './utils'

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

    const api1 = lambdaHandler(this, 'api1')
    const api2 = lambdaHandler(this, 'api2')

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

    const testApi1 = new sfnTasks.LambdaInvoke(this, 'test-api1', {
      lambdaFunction: testHandler('api1', this, 'test-handler1', {
        environment: { API_URL: httpApi.url! },
      }),
      resultPath: '$.result',
      outputPath: '$.result.Payload',
    })

    const testApi2 = new sfnTasks.LambdaInvoke(this, 'test-api2', {
      lambdaFunction: testHandler('api2', this, 'test-handler2', {
        environment: { API_URL: httpApi.url! },
      }),
      resultPath: '$.result',
      outputPath: '$.result.Payload',
    })

    const sendToGHActions = new sfnTasks.LambdaInvoke(this, 'sendToGHActions', {
      lambdaFunction: lambdaHandler(this, 'mapResults'),
    })

    const definition = new sfn.Parallel(this, 'run-tests')
    definition.branch(testApi1)
    definition.branch(testApi2)
    definition.next(sendToGHActions).next(new sfn.Succeed(this, 'end-tests'))

    new sfn.StateMachine(this, 'cloud-tests', {
      definition,
      timeout: cdk.Duration.minutes(5),
    })

    new cdk.CfnOutput(this, 'apiURL', { value: httpApi.url! })
  }
}
