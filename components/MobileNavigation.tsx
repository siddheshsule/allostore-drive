'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import { navItems } from '@/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import FileUploader from './FileUploader';
import { Button } from './ui/button';

interface Props {
  email: string;
  avatar: string;
  accountId: string;
  fullName: string;
}

const MobileNavigation = ({ accountId, fullName, avatar, email }: Props) => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="more"
            width={24}
            height={24}
            className="h-auto"
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 mt-2 bg-light-200/20" />
          </SheetTitle>

          <nav>
            <ul>
              {navItems.map(({ url, name, icon }) => (
                <Link key={name} href={url} className="lg:w-full">
                  <li
                    className={cn(
                      'mobile-nav-item',
                      pathName === url && 'shad-active'
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        'nav-icon',
                        pathName === url && 'nav-icon-active'
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Separator className="mb-4 mt-2 bg-light-200/20" />
          <div className="flex flex-col justify-betweengap-5">
            <FileUploader />
            <Button
              type="submit"
              className="mobile-sign-out-button"
              onClick={() => {}}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logo"
                width={24}
                height={24}
                className="w-6"
              />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
