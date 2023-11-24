'use client';
import React from 'react';
// import visibleIcon from '../../../../public/svg/visible_input.svg';
// import hiddenIcon from '../../../../public/svg/hidden_input.svg';
// import { useShowPassword } from '@/app/_hooks/useShowPassword';
// import { useRouter } from 'next/router';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { zodSignup } from '../../../../_zodTypes';
// import { SignUpFormData } from '../../../../_types';
// import Image from 'next/image';

export default function Page() {
  // const router = useRouter();
  // const { showPassword, togglePasswordVisibility } = useShowPassword();

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   setError,
  //   clearErrors,
  //   setValue,
  //   formState: { errors },
  // } = useForm<SignUpFormData>({
  //   resolver: zodResolver(zodSignup),
  //   defaultValues: {
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: '',
  //   },
  // });
  return (
    <section
      id="signup-section"
      className="bg-pink-100 w-[100vw] h-[100vh] flex text-slate-700"
    >
      {/* <div
        id="form-wrapper"
        className="self-center mx-auto  h-fit w-[15vw] border border-black"
      >
        <header className="text-center text-3xl font-bold">
          <h1>Join</h1>
        </header>
        <form action="submit" className="flex flex-col">
          <label htmlFor="first-name">first name</label>
          <input type="text" />
          <label htmlFor="last-name">last name</label>
          <input type="text" />
          <label htmlFor="email">email</label>
          <input type="text" />

          <div className="w-full flex flex-col ">
            <label htmlFor="password">password</label>
            <input type="text" />
            <Image
              src={showPassword ? visibleIcon : hiddenIcon}
              width={15}
              height={15}
              alt="eye"
              onClick={togglePasswordVisibility}
              className="cursor-pointer self-end -translate-y-5 -translate-x-1"
            />
            <label htmlFor="confirm-password">confirm password</label>
            <input type="text" />
            <Image
              src={showPassword ? visibleIcon : hiddenIcon}
              width={15}
              height={15}
              alt="eye"
              onClick={togglePasswordVisibility}
              className="cursor-pointer self-end -translate-y-5 -translate-x-1"
            />
          </div>
          <button className="mt-3 w-full h-fit border border-black font-medium">
            login
          </button>
        </form>
      </div> */}
    </section>
  );
}
