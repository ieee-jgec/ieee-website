"use client";

import clsx from "clsx";
import React from "react";
import { FullLogoComponent } from "./navBar";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const pathName = usePathname();

  if (pathName?.includes("/admin")) {
    return null;
  }
  return (
    <div className="h-fit w-full bg-gray-800 p-6 py-12 text-white">
      <div className="mb-15 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <FullLogoComponent size={300} />
        </div>
        <div>
          <h3 className="mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-white transition-colors"
              >
                Events
              </Link>
            </li>
            <li>
              <Link href="/team" className="hover:text-white transition-colors">
                Team
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4">Connect With Us</h3>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.instagram.com/ieee_jgec"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/company/ieee-student-branch-jgec"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </a>
          </div>
          <p className="text-sm text-gray-400">
            Follow us for updates on events, news, and opportunities.
          </p>
        </div>

        <div className="">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1854.661167753566!2d88.7024545341968!3d26.545891844637556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e47bce687f169d%3A0x4152036d0d736d37!2sJalpaiguri%20Government%20Engineering%20College!5e0!3m2!1sen!2sin!4v1761029430201!5m2!1sen!2sin"
            className="w-full h-[200px]"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="text-center w-full border-t-1 border-gray-700 pt-12">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} IEEE Student Branch JGEC. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};
