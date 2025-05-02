"use client"; // ضروري تحط use client عشان الـ Provider لازم يبقى Client Component

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/redux/store";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
