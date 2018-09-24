export * from './categories';
export * from './tags';
export * from './control';
export const MULTI_UPDATE = 'MULTI_UPDATE';

export function createMultiUpdateAction(updates) {
    return {
        type: MULTI_UPDATE,
        updates: updates // contains updatedTags / updatedCats / deletedCats
    }
}
