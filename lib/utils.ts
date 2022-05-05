import * as cdk from 'aws-cdk-lib'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as ln from 'aws-cdk-lib/aws-lambda-nodejs'

export const lambdaHandler = (
  ...args: ConstructorParameters<typeof ln.NodejsFunction>
) =>
  new ln.NodejsFunction(args[0], args[1], {
    entry: `functions/${args[1]}.ts`,
    memorySize: 256,
    timeout: cdk.Duration.seconds(10),
    logRetention: logs.RetentionDays.ONE_DAY,
    ...args[2],
  })

export const testHandler = (
  testName: string,
  ...args: ConstructorParameters<typeof ln.NodejsFunction>
) =>
  new ln.NodejsFunction(args[0], args[1], {
    entry: `integration/test-handler.ts`,
    memorySize: 1024,
    timeout: cdk.Duration.seconds(20),
    logRetention: logs.RetentionDays.ONE_DAY,
    bundling: {
      nodeModules: ['typescript', '@types/jest', 'jest', 'ts-jest', 'axios'],
      commandHooks: {
        beforeInstall(inputDir, outputDir) {
          return [
            `cp ${inputDir}/integration/jest.config.js ${outputDir}/`,
            `cp ${inputDir}/integration/${testName}.test.ts ${outputDir}/`,
          ]
        },
        beforeBundling() {
          return []
        },
        afterBundling() {
          return []
        },
      },
    },
    ...args[2],
  })
