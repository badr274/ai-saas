import { Card } from "@/components/ui/card";
import { tools } from "@/data";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  const renderDashboardTools = tools.map((tool) => {
    const { label, href, icon: Icon, color, bgColor } = tool;

    return (
      <Link key={href} href={href} className="block">
        <Card className="p-4 border-black/5 flex flex-row items-center justify-between hover:shadow-md transition">
          <div className="flex items-center gap-x-1">
            <div className={cn("p-2 w-fit rounded-md", bgColor)}>
              <Icon className={cn("w-8 h-8", color)} />
            </div>
            <div className="font-semibold">{label}</div>
          </div>
          <ArrowRight />
        </Card>
      </Link>
    );
  });
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className=" text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {renderDashboardTools}
      </div>
    </div>
  );
};

export default DashboardPage;
