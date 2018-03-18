/**
 * User Basic informations + access token
 */
export const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id:  'string',
    accessToken: 'string',
    username: 'string',
    full_name: 'string',
    profile_picture: 'string',
    bio: 'string',
    website: 'string',
    is_business: { type: 'bool', defaiult: false },
    media: { type: 'int', default: 0 },
    follows: { type: 'int', default: 0 },
    followed_by: { type: 'int', default: 0 },
    prev_media: { type: 'int', default: 0 },
    prev_follows: { type: 'int', default: 0 },
    prev_followed_by: { type: 'int', default: 0 }
  }
};

/**
 * Lost Followers by user and by date
 */
export const LostFollowersSchema = {
    name: 'LostFollowers',
    primaryKey: 'userId',
    properties: {
        userId: 'string',
        lost: 'string[]',
        date: 'date'
    }
}

/**
 * New followers by user and by date
 */
export const NewFollowersSchema = {
    name: 'NewFollowers',
    primaryKey: 'userId',
    properties: {
        userId: 'string',
        new: 'string[]',
        date: 'date'
    }    
}
