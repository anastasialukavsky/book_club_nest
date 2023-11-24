import { useState } from 'react';

export default function useShowPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return { showPassword, togglePasswordVisibility };
}
