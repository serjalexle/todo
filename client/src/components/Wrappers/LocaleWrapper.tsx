"use client";
import React, { useState } from "react";
import { NextIntlClientProvider } from "next-intl";

interface IProps {
  children: React.ReactNode;
}

const messages: {
  [key: string]: Record<string, string>;
} = {
  en: require("../../locales/en.json"),
  ua: require("../../locales/ua.json"),
};

const LocaleWrapper = ({ children }: IProps) => {
  const [locale, setLocale] = useState("ua");

  return (
    <NextIntlClientProvider locale={locale} messages={messages[`${locale}`]}>
      {children}
    </NextIntlClientProvider>
  );
};

export default LocaleWrapper;
