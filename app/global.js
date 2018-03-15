import ConnectionManagerClass from './managers/ConnectionManager';
import InstaFacadeClass from './managers/InstaFacade';

global.connectionManager = new ConnectionManagerClass();
global.instaFacade = new InstaFacadeClass();