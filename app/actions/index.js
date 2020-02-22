export * from './categories';
export * from './tags';
export * from './control';
export * from './publications';
export * from './settings';
export * from './profiles';
export const MULTI_UPDATE = 'MULTI_UPDATE';
export const OPEN_EDITOR = 'OPEN_EDITOR';
export const CLOSE_EDITOR = 'CLOSE_EDITOR';

export function createMultiUpdateAction(updates) {
    return {
        type: MULTI_UPDATE,
        updates: updates // contains updatedTags / updatedCats / deletedCats
    }
}

export function createOpenEditorAction(itemId) {
    return {
        type: OPEN_EDITOR,
        id: itemId
    }
}

export function createCloseEditorAction(itemId) {
    return {
        type: CLOSE_EDITOR,
        id: itemId
    }
}
