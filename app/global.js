import { Platform, NativeModules } from "react-native";

import InstaFacadeClass from './managers/InstaFacade';
import ServiceManagerClass from './services/ServiceManager';
import UserManagerClass from './managers/UserManager';
import HashtagPersistenceManagerClass from './managers/HashtagPersistenceManager';
import SettingsManager from './managers/SettingsManager';

global.instaFacade = new InstaFacadeClass();
global.serviceManager = new ServiceManagerClass(global.instaFacade);
global.userManager = new UserManagerClass();
global.hashtagPersistenceManager = new HashtagPersistenceManagerClass();
global.settingsManager = new SettingsManager();

// Editor modes
global.CREATE_MODE = 'create';
global.UPDATE_MODE = 'update';

// The type of the item which is edited in HashtagCategoryEditScreen
global.TAG_ITEM = 'tag';
global.CATEGORY_ITEM = 'category';
global.PUBLICATION_ITEM = 'publication';

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

global._getLocale = () => {

  let langRegionLocale = "en_US";

  // If we have an Android phone
  if (Platform.OS === "android") {
    langRegionLocale = NativeModules.I18nManager.localeIdentifier || "";
  } else if (Platform.OS === "ios") {
    langRegionLocale = NativeModules.SettingsManager.settings.AppleLocale || "";
  }
  langRegionLocale = langRegionLocale.replace('_', '-');
  return langRegionLocale;
}

global.locale = global._getLocale();