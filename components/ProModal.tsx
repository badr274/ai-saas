"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { onClose, onOpen } from "@/redux/features/ProModalSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Badge } from "@/components/ui/badge";
import { tools } from "@/data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

const ProModal = () => {
  const isOpen = useAppSelector((state) => state.proModalSlice.isOpen);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onSubscripe = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/stripe");

      window.location.href = res.data.url;
    } catch (error) {
      console.log(error, "STRIPE_CLIENT_ERROR");
    } finally {
      setLoading(false);
    }
  };

  const renderProModalTools = tools.map((tool) => {
    const { bgColor, color, icon: Icon, label } = tool;
    return (
      <Card
        key={label}
        className="p-3 border-black/5 flex flex-row items-center justify-between"
      >
        <div className="flex items-center gap-x-4">
          <div className={cn("p-2 w-fit rounded-md", bgColor)}>
            <Icon className={cn("w-6 h-6", color)} />
          </div>
          <div className="font-semibold text-sm">{label}</div>
        </div>
        <Check />
      </Card>
    );
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? dispatch(onOpen()) : dispatch(onClose()))}
    >
      <DialogContent className="z-[100]">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to NyroAI
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
              {renderProModalTools}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={loading}
            size="lg"
            variant="premium"
            className="w-full"
            onClick={onSubscripe}
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
