// components/MapPopupContent.tsx
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MapPopupContentProps {
  properties: {
    HUNTAREA: string;
    HUNTNAME: string;
    HERDNAME: string;
    [key: string]: any; // Allow for other properties
  };
}

interface HarvestData {
  "TYPE": string;
  "ACTIVE_LICS_HTRS": number;
  "BULL": number;
  "SPIKE": number;
  "COW": number;
  "CALF": number;
  "TOTAL": number;
  "HUNTER_SUCCESS": number;
  "DAYS_HARVEST": number;
  "HUNTER_DAYS": number;
  "LICENSES_SOLD_(CROSS_HUNT_INCL)": number;
}

export function MapPopupContent({ properties }: MapPopupContentProps) {
  const [elkHarvestData, setElkHarvestData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const [currentAreaHarvestdata, setCurrentAreaHarvestData] = useState<any>(null);
  const [ selectedType, setSelectedType ] = useState('');

  const hangleTypeChange = (newValue: string) => {
    setSelectedType(newValue);
    console.log(newValue);
  }

  useEffect(() => {
    const fetchElkData = async () => {
      try {
        const response = await fetch('/elk/elkharvestdata2024.json');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setElkHarvestData(data);

        const foundArea = data.areas.find((unit: any) => unit.Area === properties.HUNTAREA);

        if (foundArea?.data && foundArea.data.length > 0) {
          setCurrentAreaHarvestData(foundArea.data);
          setSelectedType(foundArea.data[0].TYPE);
        } else {
          setCurrentAreaHarvestData(null);
          setSelectedType('');
        }

      } catch (e) {
        const errorMessage = (e as Error).message;
        console.error("Failed to fetch elk harvest data:", errorMessage);
        setError(errorMessage);
      }
    };

    fetchElkData();
  }, [properties.HUNTAREA]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!elkHarvestData) {
    return <div>Loading...</div>;
  }
  
  const selectedHarvestData = currentAreaHarvestdata?.find((element: HarvestData) => element.TYPE === selectedType);

  return (
    <div className="p-4">
      <h3 className="text-xl font-extrabold text-gray-800 mb-2">
        Hunt Area: {properties.HUNTAREA || 'N/A'}
      </h3>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-semibold text-gray-700">Hunt Name:</span> {properties.HUNTNAME || 'N/A'}</p>
        <p><span className="font-semibold text-gray-700">Herd Name:</span> {properties.HERDNAME || 'N/A'}</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Show Harvest Details
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{properties.HUNTAREA} Harvest Details</DialogTitle>
            <DialogDescription>
              Harvest data for the 2024 season.
            </DialogDescription>
          </DialogHeader>
          
          {currentAreaHarvestdata ? (
              <div>
                  <Select onValueChange={hangleTypeChange} value={selectedType}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="TYPE" />
                      </SelectTrigger>
                      <SelectContent>
                          {currentAreaHarvestdata.map((element: HarvestData, index: number) => (
                                <SelectItem value={element.TYPE} key={index}>{element.TYPE}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>

                  {selectedHarvestData ? (
                      <div className="mt-4 space-y-2">
                          <p><strong>Type:</strong> {selectedHarvestData.TYPE ?? 'N/A'}</p>
                          <p><strong>Total Harvest:</strong> {selectedHarvestData.TOTAL ?? 'N/A'}</p>
                          <p><strong>Days per Harvest:</strong> {selectedHarvestData.DAYS_HARVEST ?? 'N/A'}</p>
                          <p><strong>Hunter Success:</strong> {(selectedHarvestData.HUNTER_SUCCESS * 100).toFixed(0) ?? 'N/A'}%</p>
                          <p><strong>Bull:</strong> {selectedHarvestData.BULL ?? 'N/A'}</p>
                          <p><strong>Spike:</strong> {selectedHarvestData.SPIKE ?? 'N/A'}</p>
                          <p><strong>Cow:</strong> {selectedHarvestData.COW ?? 'N/A'}</p>
                          <p><strong>Calf:</strong> {selectedHarvestData.CALF ?? 'N/A'}</p>
                      </div>
                  ) : (
                      <p>No data found for the selected type.</p>
                  )}
              </div>
          ) : (
              <p>No harvest data found for this area.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}