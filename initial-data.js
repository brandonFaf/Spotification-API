const crypto = require('crypto');
const randomString = () => crypto.randomBytes(6).hexSlice();

module.exports = async keystone => {
  // Count existing users
  const {
    data: {
      _allAdminsMeta: { count }
    }
  } = await keystone.executeQuery(
    `query {
      _allAdminsMeta {
        count
      }
    }`
  );

  console.log(count);
  if (count === 0) {
    const password = randomString();
    const email = 'admin@example.com';

    await keystone.executeQuery(
      `mutation initialAdmin($password: String, $email: String) {
            createAdmin(data: {name: "Admin", email: $email, isAdmin: true, password: $password}) {
              id
            }
          }`,
      {
        variables: {
          password,
          email
        }
      }
    );

    console.log(`

Admin created:
  email: ${email}
  password: ${password}
Please change these details after initial login.
`);
  }
};
