import app from '../../src/app';

describe('authentication', () => {
  it('registered the authentication service', () => {
    expect(app.service('authentication')).toBeTruthy();
  });

  describe('local strategy', () => {
    const userInfo = {
      email: 'admin@test.com',
      password: '1234567',
      name: 'test',
      role: 'NORMAL',
      type: 'STUDENT',
      verifyToken: null,
      verifiedEmail: true,
      newsInfo: false
    };

    beforeAll(async () => {
      try {
        await app.service('iusers').create(userInfo);
      } catch (error) {
      }
    });

    it('authenticates user and creates accessToken', async () => {
      const { user, accessToken } = await app.service('authentication').create({
        strategy: 'local',
        ...userInfo
      }, {});

      expect(accessToken).toBeTruthy();
      expect(user).toBeTruthy();
    });
  });
});
