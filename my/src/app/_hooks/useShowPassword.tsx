import { useState } from 'react';

export const useShowPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return { showPassword, togglePasswordVisibility };
};
