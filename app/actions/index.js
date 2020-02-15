export * from './categories';
export * from './tags';
export * from './control';
export * from './publications';
export * from './settings';
export * from './profiles';
export const MULTI_UPDATE = 'MULTI_UPDATE';

export function createMultiUpdateAction(updates) {
    return {
        type: MULTI_UPDATE,
        updates: updates // contains updatedTags / updatedCats / deletedCats
    }
}
