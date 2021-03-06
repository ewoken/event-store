import enableDestroy from 'server-destroy';

import buildEnvironment from './environment';
import initServices from './services';
import buildBusInterface from './bus';
import buildApi from './api';

async function launchApp() {
  const environment = await buildEnvironment();
  const services = await initServices(environment);
  await buildBusInterface(environment, services);
  const app = await buildApi(environment, services);

  const { logger } = environment;
  const server = app.listen(3001, () => {
    logger.info('Server is listening on', { port: 3001 });
  });
  enableDestroy(server);

  server.on('close', () => {
    environment.close();
    logger.info('Server closed');
  });

  process.on('SIGINT', () => server.close());
  process.on('SIGTERM', () => server.close());
  process.on('unhandledRejection', (reason, p) => {
    logger.error(`Unhandled Rejection at: ${p} reason: ${reason}`);
    server.close();
    process.exit(1);
  });

  return server;
}

if (require.main === module) {
  launchApp();
}

export default launchApp;
