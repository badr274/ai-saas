"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch } from "@/redux/hooks";
import { onOpen } from "@/redux/features/ProModalSlice";

interface FreeCounterProps {
  apiLimitCount: number;
  isPro: boolean;
}
const FreeCounter = ({ apiLimitCount, isPro = false }: FreeCounterProps) => {
  const dispatch = useAppDispatch();
  if (isPro) return;
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-4">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generation
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>
          <Button
            className="w-full"
            variant="premium"
            onClick={() => dispatch(onOpen())}
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
