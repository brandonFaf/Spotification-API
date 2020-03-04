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
      name: { type: Text, isRequired: true },
      email: {
        type: Text,
        isUnique: true,
        isRequired: true
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
      name: { type: Text, isRequired: true },
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
      snapshotId: { type: Text, isRequired: true },
      name: { type: Text, isRequired: true },
      users: { type: Relationship, ref: 'User', many: true },
      spotifyId: { type: Text, isRequired: true },
      lastUpdated: {
        type: DateTime,
        format: 'YYYY-MM-DDThh:mm:ssZ',
        isRequired: true
      }
    }
  });
};
module.exports = { createLists };
