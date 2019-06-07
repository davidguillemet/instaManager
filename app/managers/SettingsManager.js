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
    maximumNumberOfTags: 30
}

const settingsStorageKeyName = '@TagManager:settings';

export default class SettingsManager {

    /* Returns a Promise */
    initialize() {
        return AsyncStorage.getItem(settingsStorageKeyName).then(serializedSettingsFromStorage => {
            if (serializedSettingsFromStorage == null) {
                this.settings = defaultSettings;
            } else {
                this.settings = JSON.parse(serializedSettingsFromStorage);
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
}