import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
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
  MapPinned,
  Turtle,
  CookingPot,
  CalendarCheck,
  LogOut,
  MapPin,
  Clock,
  Utensils,
  TramFront,
  Car,
  Plane,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  addPlaceToStay,
  addPlaceOneOptions,
  addPlaceTwoOptions,
  addPlaceOneTiming,
  addPlaceTwoTiming,
  readyToBuildItinerary,
  addBreakfastOptions,
  addLunchOptions,
  addBrunchOptions,
  addDinnerOptions,
  setDisablePlaceTab,
  setCurrentItineraryTab,
  setupDestination,
  setDirectionResponse,
} from "../../slices/plannerSlice";
import { format } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { useLogoutMutation } from "../../slices/userApiSlice";
import { useToast } from "../ui/use-toast";
import { clearPlanner } from "../../slices/plannerSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const JourneyCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const originRef = useRef();
  const destinationRef = useRef();
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    destinationDetails,
    placeToStayDetails,
    mapIsLoaded,
    foodPlanOptions,
    foodPlan,
  } = useSelector((state) => state.plannerDetails);
  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });
  const [mode, setMode] = useState(null);
  const [date, setDate] = useState();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [enableConfirm, setEnableConfirm] = useState(false);
  // const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [showJourneyCards, setShowJourneyCards] = useState(false);

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
      dispatch(setDirectionResponse(results));
      // setDirectionsResponse(results);
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
      setEnableConfirm(true);
      setShowJourneyCards(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    // setPlaceTabDisable(false);
    dispatch(setDisablePlaceTab(false));
    dispatch(setCurrentItineraryTab("place"));
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
    // navigate("/planner");
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-start bg-muted/50 pt-3 pb-3 gap-[1rem] space-y-2">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Journey
        </CardTitle>
        <CardDescription>
          Set up your journey and travel details here.
        </CardDescription>
      </CardHeader>
      <Separator className="my-4 mt-0" />
      <CardContent className="space-y-2 p-0">
        <div className="space-y-2 p-4">
          <Label htmlFor="origin" className="text-[1rem]">
            Origin
          </Label>
          {destinationDetails?.origin ? (
            <Input
              id="origin"
              placeholder="Origin"
              className="text-primary-foreground bg-primary pointer-events-none"
              value={destinationDetails?.origin}
            />
          ) : (
            mapIsLoaded && (
              <Autocomplete>
                <Input id="origin" placeholder="Origin" ref={originRef} />
              </Autocomplete>
            )
          )}
        </div>
        <Separator className="my-4 w-full" />
        <div className="space-y-2 p-4">
          <Label htmlFor="destination" className="text-[1rem]">
            Destination
          </Label>
          {destinationDetails.destination ? (
            <Input
              id="destination"
              placeholder="Destination"
              className="text-primary-foreground bg-primary pointer-events-none"
              value={destinationDetails.destination}
            />
          ) : (
            mapIsLoaded && (
              <Autocomplete>
                <Input
                  id="destination"
                  placeholder="Destination"
                  ref={destinationRef}
                />
              </Autocomplete>
            )
          )}
        </div>
        <Separator className="my-4" />

        <div className="space-y-2 p-4">
          <Label htmlFor="travelMode" className="text-[1rem]">
            Travelling By
          </Label>
          {destinationDetails.modeOfTravel ? (
            <Select
              onValueChange={(e) => {
                setMode(e);
              }}
              value={destinationDetails.modeOfTravel}
              className="text-primary-foreground bg-primary pointer-events-none"
            >
              <SelectTrigger
                id="travelMode"
                className="items-start [&_[data-description]]:hidden bg-primary text-primary travel-mode-trigger pointer-events-none"
              >
                <SelectValue placeholder="Travel Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Car className="size-5 text-primary-foreground" />
                    <div className="grid gap-0.5 text-primary-foreground">
                      <p>
                        By{" "}
                        <span className="font-medium text-primary-foreground">
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
                    <TramFront className="size-5 text-primary-foreground" />
                    <div className="grid gap-0.5 text-primary-foreground">
                      <p>
                        By{" "}
                        <span className="font-medium text-primary-foreground">
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
                    <Plane className="size-5 text-primary-foreground" />
                    <div className="grid gap-0.5 text-primary-foreground">
                      <p>
                        By{" "}
                        <span className="font-medium text-primary-foreground">
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
          ) : (
            <Select
              onValueChange={(e) => {
                setMode(e);
              }}
            >
              <SelectTrigger
                id="travelMode"
                className="items-start [&_[data-description]]:hidden travel-mode-trigger"
              >
                <SelectValue placeholder="Travel Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Car className="size-5" />
                    <div className="grid gap-0.5">
                      <p>
                        By{" "}
                        <span className="font-medium text-foreground">Car</span>
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
          )}
        </div>
        <Separator className="my-4" />

        <div className="space-y-2 flex flex-col gap-[0.5rem] p-4">
          <Label htmlFor="travelDate" className="text-[1rem]">
            Date of Travel
          </Label>
          {destinationDetails.travelDate ? (
            <Popover open={openCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal text-primary-foreground bg-primary pointer-events-none",
                    !date &&
                      "text-primary-foreground bg-primary pointer-events-none"
                  )}
                  onClick={() => setOpenCalendar(!openCalendar)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {destinationDetails.travelDate}
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
          ) : (
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
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
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
          )}
        </div>
      </CardContent>
      <Separator className="my-4 " />
      <CardFooter className="flex-col p-4 gap-[1rem]">
        <div className="flex gap-3 w-full">
          <Button className="w-full" onClick={calculateRoute}>
            Confirm
          </Button>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            className="w-full"
            onClick={(e) => handleProceed(e)}
            disabled={!enableConfirm}
          >
            Proceed
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JourneyCard;
