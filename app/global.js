import InstaFacadeClass from './managers/InstaFacade';
import ServiceManagerClass from './services/ServiceManager';
import UserManagerClass from './managers/UserManager';
import HashtagManagerClass from './managers/HashtagManager';

global.instaFacade = new InstaFacadeClass();
global.serviceManager = new ServiceManagerClass(global.instaFacade);
global.userManager = new UserManagerClass();
global.hashtagManager = new HashtagManagerClass();

// Editor modes
global.CREATE_MODE = 'create';
global.UPDATE_MODE = 'update';

global.LIST_SELECTION_MODE = 'selection';
global.LIST_EDITION_MODE = 'edition';

global.SINGLE_SELECTION = 'singleSelection';
global.MULTI_SELECTION = 'multiSelection';


// Generate unique identifier as guid
global.uniqueID = () => {

    function chr4(){
      return Math.random().toString(16).slice(-4);
    }

    return chr4() + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() + chr4() + chr4();
}