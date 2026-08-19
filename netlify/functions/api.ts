import serverless from 'serverless-http';
import { setupApp } from '../../server.ts';

// Cache the handler across warm Lambda invocations
let handlerInstance: ReturnType<typeof serverless>;

export const handler = async (event: any, context: any) => {
  if (!handlerInstance) {
    const app = await setupApp();
    handlerInstance = serverless(app);
  }
  return handlerInstance(event, context);
};
