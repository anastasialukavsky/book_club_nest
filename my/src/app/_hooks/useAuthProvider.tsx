import { useContext } from 'react';
import {
  AuthContext,
  IGlobalContextProps as AuthContextProps,
} from '../_stores/authContext';

export const useAuthContext = () =>
  useContext(AuthContext as React.Context<AuthContextProps>);
