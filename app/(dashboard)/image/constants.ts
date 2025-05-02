import { z } from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  amount: z.string().min(1, "Amount is required"),
});

export const amountOptions = [
  {
    value: "1",
    label: "1 Photo",
  },
  {
    value: "2",
    label: "2 Photos",
  },
  {
    value: "3",
    label: "3 Photos",
  },
  {
    value: "4",
    label: "4 Photos",
  },
  {
    value: "5",
    label: "5 Photos",
  },
];
