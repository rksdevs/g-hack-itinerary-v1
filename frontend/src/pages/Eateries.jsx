import { useEffect, useState } from "react";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
  MapPin,
  RefreshCw,
  Clock,
  Utensils,
  Search,
} from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

import { GoogleGenerativeAI } from "@google/generative-ai";
import PlaceOneAccordions from "../components/assets/PlaceOneAccordions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlaceOne,
  addPlaceTwo,
  addPlaceOneOptions,
  clearPlanner,
  addPlaceTwoOptions,
  addPlaceOneTiming,
  addPlaceTwoTiming,
  addBreakfast,
  addBreakfastOptions,
  addLunchOptions,
  addBrunchOptions,
  addDinnerOptions,
  skipBreakfast,
  chooseBreakfast,
  chooseLunch,
  skipLunch,
  skipBrunch,
  chooseBrunch,
  chooseDinner,
  skipDinner,
  readyToBuildItinerary,
} from "../slices/plannerSlice";
import PlaceTwoAccordions from "../components/assets/PlaceTwoAccordions";
import BreakfastAccordion from "../components/assets/BreakfastAccordion";
import LunchAccordion from "../components/assets/LunchAccordion";
import BrunchAccordion from "../components/assets/BrunchAccordion";
import DinnerAccordion from "../components/assets/DinnerAccordion";
import { useNavigate } from "react-router-dom";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

function Eateries() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    foodPlanOptions,
    foodPlan,
    destinationDetails,
    placeToStayDetails,
  } = useSelector((state) => state.plannerDetails);
  const [libraries] = useState(["places"]);
  const [placeOne, setPlaceOne] = useState("Religious");
  const [topTenList, setTopTenList] = useState([]);
  const [currentPlace, setCurrentPlace] = useState("Bangalore, India");
  const [openPlaceTwoSelect, setOpenPlaceTwoSelect] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(/**@type google.maps.Map */ (null));

  //for eateries
  const [openBreakfast, setOpenBreakfast] = useState(true);
  const [openLunch, setOpenLunch] = useState(true);
  const [openBrunch, setOpenBrunch] = useState(true);
  const [openDinner, setOpenDinner] = useState(true);
  const [breakfastCuisine, setBreakfastCuisine] = useState("");
  const [lunchCuisine, setLunchCuisine] = useState("");
  const [brunchCuisine, setBrunchCuisine] = useState("");
  const [dinnerCuisine, setDinnerCuisine] = useState("");
  const [allCuisines, setAllCuisines] = useState([
    "Italian",
    "Chinese",
    "Indian",
    "Japanese",
    "French",
    "Mexican",
    "Thai",
    "Mediterranean",
    "Korean",
    "Mixed",
  ]);

  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    if (placeOneDetails && placeOneDetails.timings) {
      setOpenPlaceTwoSelect(true);
    }

    if (placeTwoDetails) {
      //do something
    }
  }, [placeOneDetails, placeTwoDetails]);

  const testFunc = () => {};

  const generateFoodOptions = async (event, cuisine, foodPlanType) => {
    // event.preventDefault();
    console.log("triggered generating options");
    // setPlaceOne();
    try {
      const foodOptionsPrompt = `top 3 places to have ${foodPlanType} with ${cuisine} cuisines, in ${destinationDetails.destination}, send the response as a Javascript JSON array of objects, each object is a place, each object has three properties first is a "title" property and its value is a string of the Name of the place, second is the "details" property and its value is a string of details about the place in not more than 20 words and third is "location" property which has the location information of the place, the value of location is an object with three properties first "address" which is a string of the full address of the place, including state and country and zip code, second is "lng" which is the longitude coordinates of the place and third is "lat" which is the latitude coorinates of the place`;
      const result = await model.generateContent(foodOptionsPrompt);
      const response = result.response.text();
      console.log(response, "seg");
      const regex = /(\[.*?\])/s;
      const expectedJSON = response.match(regex);
      console.log(JSON.parse(expectedJSON[0]));
      return JSON.parse(expectedJSON[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const testFoo = (place) => {
    //eslint-disable-next-line no-undef
    const placesService = new google.maps.places.PlacesService(map);
    const findPlaceRequest = {
      query: `${place.title}, ${place.location.address}`,
      fields: ["place_id"],
    };

    // Send the request to find place ID
    placesService.findPlaceFromQuery(findPlaceRequest, (results, status) => {
      if (
        //eslint-disable-next-line no-undef
        status === google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results.length > 0
      ) {
        const placeId = results[0].place_id;

        // Define the request to get details using the place_id
        const detailsRequest = {
          placeId: placeId,
          fields: ["name", "rating", "reviews", "photos"],
        };

        // Send the request for details
        placesService.getDetails(detailsRequest, (place, status) => {
          //eslint-disable-next-line no-undef
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Extract the desired details from the response
            console.log(place);
          } else {
            console.error("Error fetching restaurant details:", status);
          }
        });
      } else {
        console.error("Error finding place ID:", status);
      }
    });
  };

  const testgeofiapi = () => {
    // Define the latitude and longitude coordinates of the place
    const latitude = 40.7128; // Example latitude (New York City)
    const longitude = -74.006; // Example longitude (New York City)

    // Define your Geoapify API key
    // const apiKey = "YOUR_API_KEY"; // Replace 'YOUR_API_KEY' with your actual API key

    // Construct the URL for the Geoapify Place Details API
    const apiUrl = `https://api.geoapify.com/v1/place-details?lat=${latitude}&lon=${longitude}&apiKey=${process.env.REACT_APP_GEOFYAPI_DETAILS_KEY}`;

    // Make a GET request to the Geoapify Place Details API
    fetch(apiUrl)
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse the JSON response
        return response.json();
      })
      .then((data) => {
        // Handle the data returned from the API
        console.log("Place Details:", data);
        // Here you can access the specific details you need from the 'data' object
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch operation
        console.error("Error fetching place details:", error);
      });
  };

  //to generate the place details for every individual places suggested by gemini
  const generateRestaurantDetails = async (place) => {
    try {
      //eslint-disable-next-line no-undef
      const placesService = new google.maps.places.PlacesService(map);
      //eslint-disable-next-line no-undef
      const latlng = new google.maps.Geocoder();
      const resultsLatLang = await latlng.geocode({
        address: `${place.title}, ${place.location.address}`,
        // location: `${place.location.lat},${place.location.lng}`
      });
      const placeId = resultsLatLang.results[0].place_id;
      const request = {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "place_id",
          "geometry",
          "photos",
          "rating",
          "user_ratings_total",
        ],
      };
      // Wrapping the callback-based API in a promise
      const getRestaurantPromise = () => {
        return new Promise((resolve, reject) => {
          placesService.getDetails(request, (results, status) => {
            //eslint-disable-next-line no-undef
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              console.log(results);
              resolve(results);
            } else {
              reject(new Error("Place details not found"));
            }
          });
        });
      };
      // Await the promise
      const returningRestaurantDetails = await getRestaurantPromise();
      return returningRestaurantDetails;
    } catch (error) {
      console.log(error);
    }
  };

  //to unwrapp the array of the promises returned by generateVisitPlaceDetails func above
  const processPlaceResultArray = async (event, cuisine, foodPlanType) => {
    console.log(foodPlanType, "triggered");
    // event.preventDefault();
    try {
      const myArr = await generateFoodOptions(event, cuisine, foodPlanType);
      // const promisesArr = myArr.map((item) => generateRestaurantDetails(item));
      // const result = await Promise.all(promisesArr);
      if (foodPlanType === "breakfast") {
        dispatch(addBreakfastOptions(myArr));
      } else if (foodPlanType === "lunch") {
        dispatch(addLunchOptions(myArr));
      } else if (foodPlanType === "brunch") {
        dispatch(addBrunchOptions(myArr));
      } else {
        dispatch(addDinnerOptions(myArr));
      }
      console.log(myArr, "247");
    } catch (error) {}
  };

  useEffect(() => {
    console.log(topTenList, "top 10");
  }, [topTenList]);

  useEffect(() => {
    // Fetch user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const openBreakfastInput = (e) => {
    e.preventDefault();
    dispatch(chooseBreakfast());
    setOpenBreakfast(true);
  };

  const skipBreakfastHandler = (event) => {
    event.preventDefault();
    dispatch(skipBreakfast());
    setOpenBreakfast(false);
  };

  const openLunchInput = (e) => {
    e.preventDefault();
    dispatch(chooseLunch());
    setOpenLunch(true);
  };

  const skipLunchHandler = (event) => {
    event.preventDefault();
    dispatch(skipLunch());
    setOpenLunch(false);
  };

  const openBrunchInput = (e) => {
    e.preventDefault();
    dispatch(chooseBrunch());
    setOpenBrunch(true);
  };

  const skipBrunchHandler = (event) => {
    event.preventDefault();
    dispatch(skipBrunch());
    setOpenBrunch(false);
  };

  const openDinnerInput = (e) => {
    e.preventDefault();
    dispatch(chooseDinner());
    setOpenDinner(true);
  };

  const skipDinnerHandler = (event) => {
    event.preventDefault();
    dispatch(skipDinner());
    setOpenDinner(false);
  };

  const handleContinueToItinerary = (event) => {
    event.preventDefault();
    dispatch(readyToBuildItinerary());
    navigate("/itinerary");
  };

  return (
    <div className="grid pl-[56px]">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background justify-between px-2">
          <div className="flex gap-1 w-[25%]">
            <div className="flex items-center gap-4">
              <Label htmlFor="breakfast" className="text-[10px] font-bold">
                Breakfast
              </Label>
              <div className="flex my-2 gap-3">
                {/* <Button
                  onClick={openBreakfastInput}
                  className={!openBreakfast ? "w-[80px]" : "hidden"}
                >
                  Choose
                </Button>
                <Button
                  onClick={(event) => skipBreakfastHandler(event)}
                  className={openBreakfast ? "w-[80px]" : "hidden"}
                >
                  Skip
                </Button> */}
                {/* <div className="relative">
                  <Search
                    className={
                      !openBreakfast
                        ? "hidden"
                        : "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                    }
                  />
                  <Input
                    type="search"
                    placeholder={
                      !openBreakfast
                        ? "Skipped breakfast, carry snacks with you!"
                        : "Enter preferred cuisines"
                    }
                    className={
                      !openBreakfast
                        ? "sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        : "pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    }
                    disabled={!openBreakfast}
                    value={breakfastCuisine}
                    onChange={(e) => setBreakfastCuisine(e.target.value)}
                  />
                  <Button
                    className={
                      !openBreakfast
                        ? "hidden"
                        : "absolute right-[5px] top-[3px] h-[29px] w-10"
                    }
                    onClick={(event) =>
                      processPlaceResultArray(
                        event,
                        breakfastCuisine,
                        "breakfast"
                      )
                    }
                  >
                    Go
                  </Button>
                </div> */}
                {/* <Button>Skip</Button> */}
                <Select
                  className="h-[32px] text-[10px] flex items-center"
                  onValueChange={(e) =>
                    processPlaceResultArray(e, breakfastCuisine, "breakfast")
                  }
                >
                  <SelectTrigger
                    id="breakfast"
                    className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
                  >
                    <SelectValue
                      placeholder="Choose cuisine"
                      className="text-[10px]"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-[10px]">
                    {allCuisines.map((item, index) => (
                      <SelectItem value={item} key={index}>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Utensils className="w-[10px]" />
                          <div className="grid gap-0.5 mt-[2px]">
                            <p>
                              {item}{" "}
                              <span className="font-medium text-foreground">
                                Cuisine
                              </span>
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-1 w-[25%]">
            <div className="flex items-center gap-4">
              <Label htmlFor="breakfast" className="text-[10px] font-bold">
                Lunch
              </Label>
              <div className="flex my-2 gap-3">
                <Select
                  className="h-[32px] text-[10px] flex items-center"
                  onValueChange={(e) =>
                    processPlaceResultArray(e, lunchCuisine, "lunch")
                  }
                >
                  <SelectTrigger
                    id="breakfast"
                    className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
                  >
                    <SelectValue
                      placeholder="Choose cuisine"
                      className="text-[10px]"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-[10px]">
                    {allCuisines.map((item, index) => (
                      <SelectItem value={item} key={index}>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Utensils className="w-[10px]" />
                          <div className="grid gap-0.5 mt-[2px]">
                            <p>
                              {item}{" "}
                              <span className="font-medium text-foreground">
                                Cuisine
                              </span>
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-1 w-[25%]">
            <div className="flex items-center gap-4">
              <Label htmlFor="breakfast" className="text-[10px] font-bold">
                Dinner
              </Label>
              <div className="flex my-2 gap-3">
                <Select
                  className="h-[32px] text-[10px] flex items-center"
                  onValueChange={(e) =>
                    processPlaceResultArray(e, dinnerCuisine, "dinner")
                  }
                >
                  <SelectTrigger
                    id="dinner"
                    className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
                  >
                    <SelectValue
                      placeholder="Choose cuisine"
                      className="text-[10px]"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-[10px]">
                    {allCuisines.map((item, index) => (
                      <SelectItem value={item} key={index}>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Utensils className="w-[10px]" />
                          <div className="grid gap-0.5 mt-[2px]">
                            <p>
                              {item}{" "}
                              <span className="font-medium text-foreground">
                                Cuisine
                              </span>
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Configuration</DrawerTitle>
                <DrawerDescription>
                  Configure the settings for the model and messages.
                </DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Model</Label>
                    <Select>
                      <SelectTrigger
                        id="model"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genesis">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Rabbit className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Genesis
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Our fastest model for general use cases.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="explorer">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Bird className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Explorer
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Performance and speed for efficiency.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="quantum">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Turtle className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Quantum
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                The most powerful model for complex
                                computations.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input id="temperature" type="number" placeholder="0.4" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input id="top-p" type="number" placeholder="0.7" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input id="top-k" type="number" placeholder="0.0" />
                  </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Messages
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="You are a..." />
                  </div>
                </fieldset>
              </form>
            </DrawerContent>
          </Drawer>
        </header>
        <main className="flex flex-col gap-2 overflow-auto p-2">
          <div
            className={`relative flex h-full min-h-[40vh] rounded-xl bg-muted/50 p-4`}
          >
            {isLoaded && destinationDetails.destination && (
              <>
                <GoogleMap
                  center={placeToStayDetails.geometry}
                  zoom={15}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={(map) => setMap(map)}
                >
                  {placeToStayDetails && (
                    <MarkerF position={placeToStayDetails.geometry} />
                  )}
                </GoogleMap>
              </>
            )}
          </div>
          <div
            className={`relative flex gap-[5rem] h-full rounded-xl bg-muted/50 p-4 justify-around min-h-[316px]`}
          >
            <div>
              {foodPlanOptions?.breakfastOptions?.length > 1 && (
                <BreakfastAccordion />
              )}
            </div>
            <div>
              {foodPlanOptions?.lunchOptions?.length > 1 && <LunchAccordion />}
            </div>
            <div>
              {foodPlanOptions?.dinnerOptions?.length > 1 && (
                <DinnerAccordion />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Eateries;
