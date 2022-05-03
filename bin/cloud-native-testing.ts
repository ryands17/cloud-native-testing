#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CloudNativeTestingStack } from '../lib/cloud-native-testing-stack'

const app = new cdk.App()
new CloudNativeTestingStack(app, 'CloudNativeTestingStack', {
  env: { region: app.node.tryGetContext('region') || 'us-east-2' },
})
