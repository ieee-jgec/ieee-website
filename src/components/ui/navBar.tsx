"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { Playwrite_US_Modern } from "next/font/google";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const playwriteUSModern = Playwrite_US_Modern({
  variable: "--font-playwrite-us-modern",
});

export const FullLogoComponent = ({ size = 100 }: { size?: Number }) => {
  return <img src={"/ieee-transparent.png"} style={{ width: `${size}px` }} />;
};

type NavBarProps = {
  navOpts?: Record<string, string>[];
  className?: string;
  isVisible?: boolean;
};

export default function NavBar({
  navOpts,
  className,
  isVisible = true,
}: NavBarProps) {
  const router = useRouter();
  const path = usePathname();
  const currentPage = path.split("/")[1];

  const handleLinkClick = (path: string) => {
    router.push(path);
  };

  // Mock data
  const navOpt = [
    {
      key: "",
      label: "Home",
    },
    {
      key: "about",
      label: "About",
    },
    {
      key: "events",
      label: "Events",
    },
    {
      key: "team",
      label: "Team",
    },
    {
      key: "notices",
      label: "Notices",
    },
    {
      key: "contact",
      label: "Contact",
    },
    {
      key: "alumni",
      label: "Alumni",
    },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div
        className={clsx(
          "w-full flex items-center justify-between px-2 py-1 bg-white/50 backdrop-blur-2xl text-[var(--foreground)] border-b-2 border-[var(--primary)] transition-transform duration-300",
          className,
        )}
      >
        {/* IEEE logo and name */}
        <Link href={"/"}>
          <FullLogoComponent size={185} />
        </Link>
        {/* other navigation options */}
        <div className="flex items-center justify-center gap-1 max-md:hidden">
          {navOpt.map((opt) => (
            <div
              className="flex flex-col justify-end items-center"
              key={opt.key}
            >
              <Button
                variant="nav"
                key={opt.key}
                className={clsx(
                  "p-2 text-gray-600",
                  currentPage === opt.key && "!text-foreground",
                )}
                onClick={() => handleLinkClick(`/${opt.key}`)}
              >
                {opt.label}
              </Button>
              <div
                className={clsx(
                  "overflow-hidden flex items-center gap-[1px] w-0 h-1 absolute transition-all duration-400 rounded-t-2xl",
                  currentPage === opt.key && "w-17",
                )}
              >
                <div className="flex-1 bg-blue-600 w-full h-full" />
                <div className="flex-4 bg-blue-600 w-full h-full" />
                <div className="flex-1 bg-blue-600 w-full h-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden">
          <Button
            variant="outline"
            onClick={(e) => {
              setIsMenuOpen((prev) => !prev);
            }}
          >
            {!isMenuOpen ? <Menu /> : <X />}
          </Button>
        </div>
        <NavDropDown
          options={navOpt}
          openState={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}

// DropDown
const NavDropDown = ({
  options,
  openState,
  onClose,
  currentPage,
}: {
  options: Record<string, any>[] | undefined;
  openState: boolean;
  onClose: () => void;
  currentPage: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(openState);
  }, [openState]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleBackClose = (e: MouseEvent) => {
      if (
        isOpen &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setTimeout(() => onClose(), 200);
      }
    };

    document.addEventListener("mousedown", handleBackClose);
    return () => document.removeEventListener("mousedown", handleBackClose);
  });

  useEffect(() => {
    document.addEventListener("scroll", onClose);
    return () => document.removeEventListener("scroll", onClose);
  });

  const handleLinkClick = (path: string) => {
    router.push(path);
    onClose();
  };
  return (
    <div
      className={clsx(
        "transition-all duration-200 absolute z-50 w-full left-0 top-[60px] overflow-hidden",
        isOpen ? "max-h-100" : "max-h-0",
      )}
      ref={listRef}
    >
      <div className="bg-[var(--background)] p-2 shadow-2xl">
        {options?.map((opt) => (
          <div key={opt.key}>
            <Button
              variant="nav"
              key={opt.key}
              className={clsx(
                "p-2 text-gray-600 w-full",
                currentPage === opt.key && "!text-foreground",
              )}
              onClick={() => handleLinkClick(`/${opt.key}`)}
            >
              {opt.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
