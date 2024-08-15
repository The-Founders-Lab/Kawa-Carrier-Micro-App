import React from "react";
import { Switch } from "@/components/ui/switch";

export default function Header({ environmentMode, handleEnvironmentChange }) {
  return (
    <header className="bg-black text-slate-100 py-6 shadow-md">
      <div className="container mx-auto px-4 flex justify-between">
        <h1 className="text-3xl font-bold">0x Carrier Dashboard</h1>
        <div className="flex gap-x-2 items-center font-medium">
          <span>Demo</span>
          <Switch
            checked={environmentMode === "live" ? true : false}
            onCheckedChange={handleEnvironmentChange}
          />
          <span className="text-green-500">Live</span>
        </div>
      </div>
    </header>
  );
}
