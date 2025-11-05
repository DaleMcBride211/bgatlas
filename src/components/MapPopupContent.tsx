// src/components/MapPopupContent.tsx (Revised UI)
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
  },
  animalName?: string;
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

export function MapPopupContent({ properties, animalName = 'antelope' }: MapPopupContentProps) {
  const [harvestData, setHarvestData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentAreaHarvestdata, setCurrentAreaHarvestData] = useState<any>(null);
  const [selectedType, setSelectedType] = useState('');

  const hangleTypeChange = (newValue: string) => {
    setSelectedType(newValue);
  }

  

  useEffect(() => {
    const fetchHarvestData = async () => {
      try {
        let response;
        
        response = await fetch(`/${animalName}/${animalName}harvestdata.json`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHarvestData(data);
        
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
        console.error(`Failed to fetch ${animalName} harvest data:`, errorMessage);
        setError(errorMessage);
      }
    };

    fetchHarvestData();
  }, [properties.HUNTAREA, animalName]);

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!harvestData) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  const selectedHarvestData = currentAreaHarvestdata?.find((element: HarvestData) => element.TYPE === selectedType);

  return (
    <div className="p-5 bg-white rounded-lg shadow-lg max-w-sm">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {properties.HUNTAREA || 'N/A'}
      </h3>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-semibold text-gray-700">Hunt Name:</span> {properties.HUNTNAME || 'N/A'}</p>
        <p><span className="font-semibold text-gray-700">Herd Name:</span> {properties.HERDNAME || 'N/A'}</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            Show Harvest Details
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{properties.HUNTAREA} Harvest Details</DialogTitle>
            <DialogDescription className="mt-1 text-gray-500">
              Harvest data for the 2024 season.
            </DialogDescription>
          </DialogHeader>

          {currentAreaHarvestdata ? (
              <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-700 font-medium">Select Type:</span>
                      <Select onValueChange={hangleTypeChange} value={selectedType}>
                          <SelectTrigger className="w-[200px] border border-gray-300 rounded-md">
                              <SelectValue placeholder="TYPE" />
                          </SelectTrigger>
                          <SelectContent>
                              {currentAreaHarvestdata.map((element: HarvestData, index: number) => (
                                  <SelectItem value={element.TYPE} key={index}>{element.TYPE}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>

                  {animalName === 'blackbear' || animalName === 'grizzlybear' || animalName === 'mountainlion' || animalName === 'wolf' ? (
                    <>
                          <p><strong>Total Harvest:</strong> {selectedHarvestData.TOTAL ?? 'N/A'}</p>
                          <p><strong>Days per Harvest:</strong> {selectedHarvestData.DAYS_HARVEST ?? 'N/A'}</p>
                          <p><strong>Hunter Success:</strong> {selectedHarvestData.HUNTER_SUCCESS ? (selectedHarvestData.HUNTER_SUCCESS * 100).toFixed(0) + '%' : 'N/A'}</p>
                          <p><strong>Active Licenses:</strong> {selectedHarvestData.ACTIVE_LICS_HTRS ?? 'N/A'}</p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                  
                  }

                  {selectedHarvestData ? (
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                          <p><strong>Total Harvest:</strong> {selectedHarvestData.TOTAL ?? 'N/A'}</p>
                          <p><strong>Days per Harvest:</strong> {selectedHarvestData.DAYS_HARVEST ?? 'N/A'}</p>
                          <p><strong>Hunter Success:</strong> {selectedHarvestData.HUNTER_SUCCESS ? (selectedHarvestData.HUNTER_SUCCESS * 100).toFixed(0) + '%' : 'N/A'}</p>
                          <p><strong>Active Licenses:</strong> {selectedHarvestData.ACTIVE_LICS_HTRS ?? 'N/A'}</p>
                          {animalName === 'elk' ? (
                              <>
                                  <p><strong>Bull:</strong> {selectedHarvestData.BULL ?? 'N/A'}</p>
                                  <p><strong>Spike:</strong> {selectedHarvestData.SPIKE ?? 'N/A'}</p>
                                  <p><strong>Cow:</strong> {selectedHarvestData.COW ?? 'N/A'}</p>
                                  <p><strong>Calf:</strong> {selectedHarvestData.CALF ?? 'N/A'}</p>
                              </>
                          ) : animalName === 'whitetail' || animalName === 'muledeer' || animalName === 'antelope' ? (
                              <>
                                  <p><strong>Buck:</strong> {selectedHarvestData.BUCK ?? 'N/A'}</p>
                                  <p><strong>Doe:</strong> {selectedHarvestData.DOE ?? 'N/A'}</p>
                                  <p><strong>Fawn:</strong> {selectedHarvestData.FAWN ?? 'N/A'}</p>
                              </>
                          ) : animalName === 'bighornsheep' ? (
                              <>
                                  <p><strong>Ram:</strong> {selectedHarvestData.RAM ?? 'N/A'}</p>
                                  <p><strong>Ewe:</strong> {selectedHarvestData.EWE ?? 'N/A'}</p>
                                  <p><strong>Lamb:</strong> {selectedHarvestData.LAMB ?? 'N/A'}</p>
                              </>
                          ) : animalName === 'bison' || animalName === 'moose' ? (
                            <>
                                  <p><strong>Bull:</strong> {selectedHarvestData.BULL ?? 'N/A'}</p>
                                  <p><strong>Cow:</strong> {selectedHarvestData.COW ?? 'N/A'}</p>
                                  <p><strong>Calf:</strong> {selectedHarvestData.CALF ?? 'N/A'}</p>
                            </>
                          ) : animalName === 'mountaingoat' ? (
                            <>
                                  <p><strong>Billy:</strong> {selectedHarvestData.BILLY ?? 'N/A'}</p>
                                  <p><strong>Nanny:</strong> {selectedHarvestData.NANNY ?? 'N/A'}</p>
                                  <p><strong>Kid:</strong> {selectedHarvestData.KID ?? 'N/A'}</p>
                            </>
                          ) : (
                            <>
                                  <p><strong>No Data Found</strong></p>
                            </>
                          )}
                          
                      </div>
                  ) : (
                      <p className="text-gray-500 text-center mt-6">No data found for the selected type.</p>
                  )}
              </div>
          ) : (
              <p className="text-gray-500 text-center mt-6">No harvest data found for this area.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}