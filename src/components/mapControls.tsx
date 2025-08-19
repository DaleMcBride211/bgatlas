// src/components/MapControls.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const MapControls = () => {
  return (
    <div className="fixed top-4 right-4 z-10">
      <Select>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Species" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Antelope">Antelope</SelectItem>
          <SelectItem value="Bighorn Sheep">Bighorn Sheep</SelectItem>
          <SelectItem value="Bison">Bison</SelectItem>
          <SelectItem value="Black Bear">Black Bear</SelectItem>
          <SelectItem value="Deer">Deer</SelectItem>
          <SelectItem value="Elk">Elk</SelectItem>
          <SelectItem value="Gray Wolf">Gray Wolf</SelectItem>
          <SelectItem value="Grizzly Bear">Grizzly Bear</SelectItem>
          <SelectItem value="Moose">Moose</SelectItem>
          <SelectItem value="Mountain Goat">Mountain Goat</SelectItem>
          <SelectItem value="Mountain Lion">Mountain Lion</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};