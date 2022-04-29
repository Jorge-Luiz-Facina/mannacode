import {post, patch, get } from './base'

export const register = async (user) => {
  const value = await post('users',
    {
      name: user.name,
      email: user.email,
      password: user.password,
      license: user.license,
      type: user.type,
      confirmPassword: user.confirmPassword,
      newsInfo: user.newsInfo
    },
    null
  );
  return value
}

export const editProfile = async (user, token) => {
  const value = await patch('users',
    {
      name: user.name,
      type: user.type,
      newsInfo: user.newsInfo
    },
    token
  );
  return value
}

export const getPlan = async (token) => {
  const value = await get('plans/0',
    token
  );
  return value
}

export const login = async (user) => {
  const value = await post('authentication',
    {
      email: user.email,
      password: user.password,
      strategy: 'local'
    },
    null
  );
  return value
}

export const validateEmail = async (token) => {
  const value = await post('verify',
    {
      token: token,
    },
    null
  );
  return value
}

export const sendEmailConfirm = async (email) => {
  const value = await post('sendemailconfirm',
    {
      emailConfirm: email,
    },
    null
  );
  return value
}

export const newPassword = async (email) => {
  const value = await post('password',
    {
      email:email,
    },
    null);
  return value;
};

export const changePassword = async (data, token) => {
  const value = await patch(`password/${token}`,
    {
      password:data.password,
      confirmPassword:data.confirmPassword,
    },
    null);
  return value;
};