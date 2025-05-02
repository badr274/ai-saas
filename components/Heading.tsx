import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeadingProp {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}
const Heading = ({
  description,
  icon: Icon,
  title,
  bgColor,
  iconColor,
}: HeadingProp) => {
  return (
    <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
      <div className={cn("p-2 w-fit rounded-md", bgColor)}>
        <Icon className={cn("w-8 h-8 md:w-10 md:h-10", iconColor)} />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-[13px] md:text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Heading;
