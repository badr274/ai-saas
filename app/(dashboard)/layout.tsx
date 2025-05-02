import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TawkTo from "@/components/TawkTo";
import { getApiLimitCount } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import React, { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:w-72 md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      </div>

      <main className="md:pl-72">
        <TawkTo />
        <Navbar apiLimitCount={apiLimitCount} />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
