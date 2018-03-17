import InstaFacadeClass from './managers/InstaFacade';
import ServiceManagerClass from './services/ServiceManager';
import UserManagerClass from './managers/UserManager';

global.instaFacade = new InstaFacadeClass();
global.serviceManager = new ServiceManagerClass(global.instaFacade);
global.userManager = new UserManagerClass();