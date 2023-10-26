import app from './app';
import { config } from './env';
import { appLogger } from './logger';

(async () => {
  try {
    app.listen(config.PORT, () => appLogger.info(`${config.PORT} - App`));
  } catch (error) {
    appLogger.error('Unable to start server', {
      error
    });
  }
})();
