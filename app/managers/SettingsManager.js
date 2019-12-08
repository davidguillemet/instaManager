import AsyncStorage from '@react-native-community/async-storage';

const defaultSettings = {
    publicationFilter: {
        type: 'period',         // 'all', 'period' 
        periodUnit: 'month',    // 'year', 'month', 'day'
        periodCount: 3,
        referenceDate: null     // today...if not provided        
    },
    publicationHeader: '',
    publicationFooter: '',
    maximumNumberOfTags: 30,
    mediaCountRefreshPeriod: {
        periodCount: 1,
        periodUnit: 'week'      // 'day', 'week', 'month', 'year'
    },
    displayErrors: true,
    newLineSeparator: true
}

const settingsStorageKeyName = '@TagManager:settings';

export default class SettingsManager {

    /* Returns a Promise */
    initialize() {
        return AsyncStorage.getItem(settingsStorageKeyName).then(serializedSettingsFromStorage => {
            if (serializedSettingsFromStorage == null) {
                this.settings = defaultSettings;
            } else {
                const storedSettings = JSON.parse(serializedSettingsFromStorage);
                this.settings = { ...defaultSettings, ...storedSettings };
            }    
        })
    }

    getSettings() {
        return this.settings;
    }

    /* Returns a Promise */
    async setSettings(settingsKey, newSetting) {
        this.settings = { ...this.settings, [settingsKey]: newSetting };
        const settingsSerialized = JSON.stringify(this.settings);
        await AsyncStorage.setItem(settingsStorageKeyName, settingsSerialized);
    }

    getMaxNumberOfTags() {
        return this.settings.maximumNumberOfTags;
    }

    getHeader() {
        return this.settings.publicationHeader;
    }

    getFooter() {
        return this.settings.publicationFooter;
    }

    getPublicationFilter() {
        return this.settings.publicationFilter;
    }

    getMediaCountRefreshPeriod() {
        return this.settings.mediaCountRefreshPeriod;
    }

    getDisplayErrors() {
        return this.settings.displayErrors;
    }

    getNewLineSeparator() {
        return this.settings.newLineSeparator;
    }

    setPublicationFilter(filter) {
        this.setSettings('publicationFilter', filter);
    }
    setPublicationHeader(header) {
        this.setSettings('publicationHeader', header);
    }
    setPublicationFooter(footer) {
        this.setSettings('publicationFooter', footer);
    }
    setMaximumNumberOfTags(value) {
        this.setSettings('maximumNumberOfTags', value);
    }
    setDisplayErrors(value) {
        this.setSettings('displayErrors', value);
    }
    setNewLineSeparator(value) {
        this.setSettings('newLineSeparator', value);
    }
}