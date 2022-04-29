import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLocalStorage, LocalStorageItem } from '../static/LocalStorage'
import { login } from '@/services/users';
import PropTypes from 'prop-types';
import { PathName } from 'components/static/Route';
import { useRouter } from 'next/router';

interface api {
  ok: boolean;
  message: string | undefined;
}

interface User {
  id: string;
  name: string;
  email:string;
  newsInfo: boolean;
  role: string;
  type: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  requiredSigned: boolean;
  setUser(user: User): void;
  setRequiredSigned(required: boolean): void;
  token: string | null;
  signIn(user: User): Promise<api>;
  signOut(): void;
  statusRedirect(code: string): void;
}

const AuthContext = createContext<AuthContextData>({ signed: false, token: null, user: null, requiredSigned: null, setUser: null, setRequiredSigned: null, signIn: null, signOut: null, statusRedirect: null });

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [requiredSigned, _setRequiredSigned] = useState<boolean>(false);
  const [user, _setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = getLocalStorage(LocalStorageItem.user);
      const storagedToken = getLocalStorage(LocalStorageItem.token);
      if (storagedUser !== 'undefined' && storagedToken !== 'undefined') {
        _setUser(JSON.parse(storagedUser));
        setToken(storagedToken);
      }
    }
    loadStorageData();
  }, []);

  const signIn = async (user) => {
    const response = await login({ email: user.email, password: user.password });
    if (response.ok) {
      setUser(response.data.user);
      setToken(response.data.accessToken);
      localStorage.setItem(LocalStorageItem.token, response.data.accessToken);
      return { ok: true, message: undefined };
    }
    return { ok: false, message: response.data.message };
  };

  const setUser = (user) => {
    _setUser(user);
    localStorage.setItem(LocalStorageItem.user, JSON.stringify(user));
  };

  const setRequiredSigned = (required) => {
    _setRequiredSigned(required);
  };

  const signOut = () => {
    _setRequiredSigned(false);
    setUser(null);
    localStorage.clear();
  };

  const statusRedirect = (code) => {
    if (code === 401) {
      localStorage.setItem(LocalStorageItem.routeLogin, router.asPath);
      router.push(`${PathName.notAuthenticated}?routePage=true`);
    }
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, token, user, requiredSigned, setUser, setRequiredSigned, signIn, signOut, statusRedirect }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}

AuthProvider.defaultProps = {
  children: null,
};

AuthProvider.propTypes = {
  children: PropTypes.element,
};

export { AuthProvider, useAuth };