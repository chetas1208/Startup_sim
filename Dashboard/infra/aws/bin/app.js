#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { StartupSimStack } = require('../lib/stack');

const app = new cdk.App();

new StartupSimStack(app, 'StartupSimStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});

app.synth();
