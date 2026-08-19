import serverless from 'serverless-http';
import { setupApp } from '../../server.ts';
import type { Handler } from '@netlify/functions';

let handlerInstance: serverless.Handler;

export const handler: Handler = async (event, context) => {
  if (!handlerInstance) {
    const initializedApp = await setupApp();
    handlerInstance = serverless(initializedApp);
  }
  return handlerInstance(event, context);
};
