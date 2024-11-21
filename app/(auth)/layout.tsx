import React from 'react';
import Image from 'next/image';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5 ">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo.png"
            alt="logo"
            width={250}
            height={250}
          />
          <div className="space-y-5 text-white">
            <h1 className="text-6xl space">Manage Your Files, Your Way</h1>
            <p className="">
              Take control of your documents with <em>AlloStore</em>. Effortless
              file management and sharing at your fingertips.
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            height={342}
            width={342}
            alt="illustration"
            className="hover:rotate-2 hover:scale-105 transition-all"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg:white p-4py-10 lg:justify-center lg:py-0 lg:p-10">
        <div>
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        {children}
      </section>
    </div>
  );
};

export default Layout;
