'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MapControlsProps {
  animalChange: (value: string) => void;
}

export const MapControls = ({ animalChange }: MapControlsProps) => {

  const defaultAnimal = "Antelope";

  return (
    <div className="fixed top-4 right-12 z-10">
      <Select onValueChange={animalChange} defaultValue={defaultAnimal}>
        <SelectTrigger className="w-[120px] bg-white border-2 border-slate-700 text-slate-800 font-semibold shadow-lg hover:bg-slate-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-slate-700 text-slate-800 shadow-lg">
          <SelectItem value="Antelope">Antelope</SelectItem>
          <SelectItem value="Bighorn Sheep">Bighorn Sheep</SelectItem>
          <SelectItem value="Bison">Bison</SelectItem>
          <SelectItem value="Black Bear">Black Bear</SelectItem>
          <SelectItem value="Mule Deer">Mule Deer</SelectItem>
          <SelectItem value="Whitetail">Whitetail</SelectItem>
          <SelectItem value="Elk">Elk</SelectItem>
          <SelectItem value="Gray Wolf">Wolf</SelectItem>
          <SelectItem value="Grizzly Bear">Grizzly Bear</SelectItem>
          <SelectItem value="Moose">Moose</SelectItem>
          <SelectItem value="Mountain Goat">Mountain Goat</SelectItem>
          <SelectItem value="Mountain Lion">Mountain Lion</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};