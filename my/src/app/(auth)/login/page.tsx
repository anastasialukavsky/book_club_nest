'use client';

import React, { useEffect } from 'react';
import { zodLogin } from '../../../../_zodTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData } from '../../../../_types';
import { emailCheck } from '../../../../_utilHelpers';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import visibleIcon from '../../../../public/svg/visible_input.svg';
import hiddenIcon from '../../../../public/svg/hidden_input.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useShowPassword } from '@/app/_hooks/useShowPassword';
const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Page() {
  const router = useRouter();
  const { togglePasswordVisibility, showPassword } = useShowPassword();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(zodLogin),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    for (const err in errors) {
      if (err === 'password') {
        setValue('password', '');
      }
    }
  }, [errors.password]);

  const emailChecker = async (email: string) => {
    try {
      if (!(await emailCheck(email))) {
        reset({
          email: '',
        });
        setError('email', {
          type: 'custom',
          message: 'email does not exist',
        });
      } else {
        clearErrors('email');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitData = async (data: LoginFormData) => {
    try {
      const payload = await axios.post(`${HTTP_ENDPOINT}/auth/login`, data, {
        withCredentials: true,
      });

      console.log({ payload });

      if (payload.status === 200) router.push('/workspace');
      return payload;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          reset({
            password: '',
          });
          setError('password', {
            type: 'custom',
            message: 'invalid password',
          });
        }
      } else {
        throw err;
      }
    }
  };

  return (
    <section
      id="login-section"
      className="bg-pink-100 w-[100vw] h-[100vh] flex text-slate-700"
    >
      <div id="form-wrapper" className="self-center mx-auto  h-[20vh] w-[15vw]">
        <header className="text-center text-3xl font-bold">
          <h1>LOGIN</h1>
        </header>
        <form
          action="submit"
          onSubmit={handleSubmit(submitData)}
          className="flex flex-col"
        >
          <label htmlFor="email">email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder={errors.email?.message || ''}
            {...register('email', {
              onBlur: (e) => emailChecker(e.target.value),
            })}
            className="border border-slate-700"
          />
          <div className="w-full flex flex-col">
            <label htmlFor="password">password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={errors.password?.message || ''}
              {...register('password')}
              className="border border-slate-700"
            />
            <Image
              src={showPassword ? visibleIcon : hiddenIcon}
              width={15}
              height={15}
              alt="eye"
              onClick={togglePasswordVisibility}
              className="cursor-pointer self-end -translate-y-5 -translate-x-1"
            />
            <Link href="/" className="self-end text-xs -translate-y-3">
              forgot password?
            </Link>
          </div>
          <button className="mt-3 w-full h-fit border border-black font-medium">
            login
          </button>
        </form>
      </div>
    </section>
  );
}