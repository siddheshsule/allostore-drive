import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hiddenh-auto lg:block"
        ></Image>
      </Link>
    </aside>
  );
};

export default Sidebar;
