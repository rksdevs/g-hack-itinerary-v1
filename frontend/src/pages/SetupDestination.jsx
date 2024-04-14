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
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  Navigation,
  ArrowRightLeft,
  TramFront,
  Car,
  Plane,
  Bike,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { cn } from "../lib/utils";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
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
  TooltipTrigger,
  TooltipProvider,
} from "../components/ui/tooltip";
import { useRef, useEffect, useState } from "react";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useDispatch } from "react-redux";
import { setupDestination } from "../slices/plannerSlice";

function SetupDestination() {
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries,
  });
  // const center = { lat: 43.45, lng: -80.49 };
  // const [origin, setOrigin] = useState({ lat: 43.45, lng: -80.49 });
  // const [destination, setDestination] = useState({ lat: 50.45, lng: 80.49 });
  const [map, setMap] = useState(/**@type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("Total Distance");
  const [duration, setDuration] = useState("Total Duration");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mode, setMode] = useState(null);
  const [date, setDate] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCalendar, setOpenCalendar] = useState(false);

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

  // useEffect(() => {
  //   if (date) {
  //     const dateObj = new Date(date);

  //     const year = dateObj.getFullYear();
  //     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  //     const day = String(dateObj.getDate()).padStart(2, "0");
  //     const formattedDate = `${year}-${month}-${day}`;
  //     setDate(formattedDate);
  //   }
  // }, [date]);

  const originRef = useRef();

  const destinationRef = useRef();

  const calculateRoute = async (e) => {
    e.preventDefault();
    console.log("triggered");
    try {
      if (
        originRef.current.value === "" ||
        destinationRef.current.value === ""
      ) {
        return;
      }

      //eslint-disable-next-line no-undef
      const directionService = new google.maps.DirectionsService();
      const results = await directionService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        //eslint-disable-next-line no-undef
        travelMode:
          mode === "car"
            ? //eslint-disable-next-line no-undef
              google.maps.TravelMode.DRIVING
            : //eslint-disable-next-line no-undef
              google.maps.TravelMode.TRANSIT,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      if (mode === "car") {
        setDuration(results.routes[0].legs[0].duration.text);
      } else if (mode === "plane") {
        setDuration(
          `${(
            parseInt(
              results.routes[0].legs[0].distance.text
                .split(" ")[0]
                .replace(/,/g, ""),
              10
            ) / 800
          ).toFixed(2)} hours`
        );
      } else if (mode === "train") {
        setDuration(
          `${(
            parseInt(
              results.routes[0].legs[0].distance.text
                .split(" ")[0]
                .replace(/,/g, ""),
              10
            ) / 70
          ).toFixed(2)} hours`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearSelection = () => {
    setDirectionsResponse(null);
    setDistance("Total Distance");
    setDuration("Total Duration");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  const handleDateSelection = (date) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate();
    const formattedDate = `${month} ${day}, ${year}`;
    setDate(formattedDate);
    setOpenCalendar(false);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    dispatch(
      setupDestination({
        origin: originRef?.current?.value
          ? `${originRef.current.value.split(",")[0]}`
          : "Origin",
        destination: destinationRef?.current?.value
          ? `${destinationRef.current.value.split(",")[0]}, ${
              destinationRef.current.value.split(",")[1]
            }`
          : "Destination",
        travelDate: date,
        modeOfTravel: mode,
        travelDuration: duration,
        travelDistance: distance,
      })
    );
    navigate("/planner");
  };

  return (
    <div className="grid">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Begin your journey</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Setup destination & stay</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Setup Destination & Stay</DrawerTitle>
                <DrawerDescription>
                  Setup your origin, destination, travel & stay below.
                </DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Setup
                  </legend>
                  <div className="grid gap-3">
                    <Label
                      htmlFor="origin"
                      className="float-left my-2 pl-[2px]"
                    >
                      Origin{" "}
                      <Navigation
                        style={{ float: "right", width: "1em" }}
                        onClick={() => map.panTo(currentLocation)}
                      />
                    </Label>

                    {isLoaded && (
                      <Autocomplete>
                        <Input
                          id="origin"
                          placeholder="Choose a location"
                          ref={originRef}
                        />
                      </Autocomplete>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label
                      htmlFor="origin"
                      className="float-left my-2 pl-[2px]"
                    >
                      Destination{" "}
                      <Navigation
                        style={{ float: "right", width: "1em" }}
                        onClick={() => map.panTo(currentLocation)}
                      />
                    </Label>

                    {isLoaded && (
                      <Autocomplete>
                        <Input
                          id="destination"
                          placeholder="Choose a location"
                          ref={destinationRef}
                        />
                      </Autocomplete>
                    )}
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
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
            disabled
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Setup
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="origin" className="float-left my-2 pl-[2px]">
                    Origin{" "}
                    <Navigation
                      style={{ float: "right", width: "1em" }}
                      onClick={() => map.panTo(currentLocation)}
                    />
                  </Label>

                  {isLoaded && (
                    <Autocomplete>
                      <Input
                        id="origin"
                        placeholder="Choose a location"
                        ref={originRef}
                      />
                    </Autocomplete>
                  )}
                  {/* <Input
                    id="origin"
                    placeholder="Choose a location"
                    ref={originRef}
                  /> */}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="origin" className="float-left my-2 pl-[2px]">
                    Destination{" "}
                    <Navigation
                      style={{ float: "right", width: "1em" }}
                      onClick={() => map.panTo(currentLocation)}
                    />
                  </Label>

                  {isLoaded && (
                    <Autocomplete>
                      <Input
                        id="destination"
                        placeholder="Choose a location"
                        ref={destinationRef}
                      />
                    </Autocomplete>
                  )}
                  {/* <Input
                    id="origin"
                    placeholder="Choose a location"
                    ref={destinationRef}
                  /> */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="travelMode">Travel Mode</Label>
                    <Select
                      onValueChange={(e) => {
                        setMode(e);
                      }}
                    >
                      <SelectTrigger
                        id="travelMode"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="How are you travelling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Car className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                By{" "}
                                <span className="font-medium text-foreground">
                                  Car
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                On road by car or bike
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="train">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <TramFront className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                By{" "}
                                <span className="font-medium text-foreground">
                                  Train
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Comfy journey by train.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="plane">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Plane className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                By{" "}
                                <span className="font-medium text-foreground">
                                  Flight
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                By flight, super fast & super comfy!
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="date">Date</Label>
                    <Popover open={openCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                          onClick={() => setOpenCalendar(!openCalendar)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => {
                            handleDateSelection(date);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Confirm Journey
                </legend>
                <div className="grid gap-3">
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={clearSelection}
                  >
                    Clear Selection
                  </Button>
                  <Button className="w-full" onClick={calculateRoute}>
                    Confirm
                  </Button>
                  <Button className="w-full" onClick={(e) => handleProceed(e)}>
                    Proceed
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="content">Journey Details</Label>
                  <Card>
                    <CardHeader>Your Journey</CardHeader>
                    <CardContent className="flex flex-col">
                      <p>
                        You are travelling from{" "}
                        {`${
                          originRef?.current?.value
                            ? `${originRef.current.value.split(",")[0]}`
                            : "Origin"
                        } `}{" "}
                        to{" "}
                        {destinationRef?.current?.value
                          ? `${destinationRef.current.value.split(",")[0]}`
                          : "Destination"}
                      </p>
                      <p>Your travel date is {date}</p>
                      <p>
                        You're about to cover {distance} by {mode} in
                        approximately {duration}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            {isLoaded && (
              <GoogleMap
                center={currentLocation}
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
                <MarkerF position={currentLocation} />
                {directionsResponse && (
                  <DirectionsRenderer directions={directionsResponse} />
                )}
              </GoogleMap>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SetupDestination;
