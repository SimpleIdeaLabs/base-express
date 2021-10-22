import 'reflect-metadata';
import express from 'express';
import { Container } from 'typedi';
import { App } from './app';
import appLogger from './common/components/logger/app-logger';

const appContainer = Container.get(App);

(async () => {
  try {

    // Server
    const appInstance = appContainer.instance;
    appInstance.use(express.static('public'));
    appInstance.set('view engine', 'ejs');

    const PORT = appInstance.get('PORT');
    await appInstance.listen(PORT);
    appLogger.info(`Server running - ${PORT}`);
  } catch (err) {
    appLogger.error('Server failed', err);
  }
})();
