'use client';

import React from 'react';
import { useAuthContext } from '../_hooks/useAuthProvider';

export default function Page() {
  const { user } = useAuthContext();

  console.log('user', user);
  return <div>workspace</div>;
}
