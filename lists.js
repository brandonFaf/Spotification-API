const {
  DateTime,
  Text,
  Checkbox,
  Password,
  Relationship
} = require('@keystonejs/fields');
// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return { id: user.id };
};
const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };
const createLists = keystone => {
  keystone.createList('Admin', {
    fields: {
      name: { type: Text },
      email: {
        type: Text,
        isUnique: true
      },
      isAdmin: { type: Checkbox },
      password: {
        type: Password
      }
    },
    access: {
      read: access.userIsAdminOrOwner,
      update: access.userIsAdminOrOwner,
      create: access.userIsAdmin,
      delete: access.userIsAdmin,
      auth: true
    }
  });
  keystone.createList('User', {
    fields: {
      name: { type: Text },
      email: {
        type: Text,
        isUnique: true
      },
      phoneNumber: {
        type: Text,
        isUnique: true
      }
    },
    access: {
      read: access.userIsAdminOrOwner,
      update: access.userIsAdminOrOwner,
      create: access.userIsAdmin,
      delete: access.userIsAdmin,
      auth: true
    }
  });
  keystone.createList('Playlist', {
    fields: {
      snapshotId: { type: Text },
      name: { type: Text },
      users: { type: Relationship, ref: 'User', many: true },
      spotifyId: { type: Text },
      lastUpdated: { type: DateTime, format: 'YYYY-MM-DDThh:mm:ssZ' }
    }
  });
};
module.exports = { createLists };
