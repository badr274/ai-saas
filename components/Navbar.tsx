import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./MobileSidebar";
import { checkSubscription } from "@/lib/subscription";

interface NavbarProps {
  apiLimitCount: number;
}
const Navbar = async ({ apiLimitCount }: NavbarProps) => {
  const isPro = await checkSubscription();
  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      <div className="flex w-full justify-end">
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
