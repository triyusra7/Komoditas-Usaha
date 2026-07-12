"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { submitLead } from "./actions";

type LeadFormProps = {
  translations: {
    successTitle: string;
    successDesc: string;
    labelName: string;
    placeholderName: string;
    labelContact: string;
    placeholderContact: string;
    labelInterest: string;
    placeholderInterest: string;
    interestBuy: string;
    interestSupply: string;
    interestPartner: string;
    interestInvest: string;
    interestOther: string;
    labelMessage: string;
    placeholderMessage: string;
    btnSubmit: string;
    btnSubmitting: string;
  };
};

export function LeadForm({ translations }: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(submitLead, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
        <p className="text-2xl" aria-hidden="true">
          ✅
        </p>
        <p className="mt-2 font-heading text-lg font-bold">{translations.successTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {translations.successDesc}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <div className="space-y-2">
        <Label htmlFor="name">{translations.labelName}</Label>
        <Input id="name" name="name" required placeholder={translations.placeholderName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">{translations.labelContact}</Label>
        <Input id="contact" name="contact" required placeholder={translations.placeholderContact} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interest">{translations.labelInterest}</Label>
        <Select name="interest">
          <SelectTrigger id="interest">
            <SelectValue placeholder={translations.placeholderInterest} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beli-produk">{translations.interestBuy}</SelectItem>
            <SelectItem value="pasokan-rutin">{translations.interestSupply}</SelectItem>
            <SelectItem value="kemitraan">{translations.interestPartner}</SelectItem>
            <SelectItem value="investasi">{translations.interestInvest}</SelectItem>
            <SelectItem value="lainnya">{translations.interestOther}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{translations.labelMessage}</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={translations.placeholderMessage}
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="xl" disabled={isPending} className="w-full">
        {isPending ? translations.btnSubmitting : translations.btnSubmit}
      </Button>
    </form>
  );
}
