'use client';
import React from 'react';
import visibleIcon from '../../../../public/svg/visible_input.svg';
import hiddenIcon from '../../../../public/svg/hidden_input.svg';
export default function Page() {
  // const [showPassword, setShowPassword]
  return (
    <section
      id="signup-section"
      className="bg-pink-100 w-[100vw] h-[100vh] flex text-slate-700"
    >
      <div
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
            <label htmlFor="confirm-password">confirm password</label>
            <input type="text" />
          </div>
        </form>
      </div>
    </section>
  );
}
