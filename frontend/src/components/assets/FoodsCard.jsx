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
  Star,
  Utensils,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
  addBreakfast,
  addLunch,
  addDinner,
  setCurrentItineraryTab,
  setDisableItineraryTab,
} from "../../slices/plannerSlice";
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
import restaurant from "../images/restaurant.jpg";

const FoodsCard = ({ map }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const placeOfStay = useRef();
  //   const { isLoaded } = useJsApiLoader({
  //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
  //     libraries,
  //   });
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
    // googleMapInstance,
  } = useSelector((state) => state.plannerDetails);
  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });
  //for eateries
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
  const [openBreakfast, setOpenBreakfast] = useState(true);
  const [openLunch, setOpenLunch] = useState(true);
  const [openBrunch, setOpenBrunch] = useState(true);
  const [openDinner, setOpenDinner] = useState(true);
  const [breakfastCuisine, setBreakfastCuisine] = useState("");
  const [lunchCuisine, setLunchCuisine] = useState("");
  const [brunchCuisine, setBrunchCuisine] = useState("");
  const [dinnerCuisine, setDinnerCuisine] = useState("");
  const [currentPlaceOfStay, setCurrentPlaceOfStay] = useState(null);
  const [showPlaceOneInput, setShowPlaceOneInput] = useState(false);
  const [openPlaceTwoSelect, setOpenPlaceTwoSelect] = useState(false);
  const [openBreakfastDialog, setOpenBreakfastDialog] = useState(false);
  const [openLunchDialog, setOpenLunchDialog] = useState(false);
  const [openDinnerDialog, setOpenDinnerDialog] = useState(false);

  //to generate food options
  const generateFoodOptions = async (cuisine, foodPlanType) => {
    console.log("triggered generating options", cuisine);
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

  //to unwrapp the array of the promises returned by generateFoodOptions func above
  const processFoodResultArray = async (cuisine, foodPlanType) => {
    console.log(foodPlanType, "triggered");
    // event.preventDefault();
    try {
      const myArr = await generateFoodOptions(cuisine, foodPlanType);
      // const promisesArr = myArr.map((item) => generateRestaurantDetails(item));
      // const result = await Promise.all(promisesArr);
      if (foodPlanType === "breakfast") {
        dispatch(addBreakfastOptions(myArr));
        setOpenBreakfastDialog(true);
      } else if (foodPlanType === "lunch") {
        dispatch(addLunchOptions(myArr));
        setOpenLunchDialog(true);
      } else if (foodPlanType === "brunch") {
        dispatch(addBrunchOptions(myArr));
      } else {
        dispatch(addDinnerOptions(myArr));
        setOpenDinnerDialog(true);
      }
      console.log(myArr, "247");
    } catch (error) {}
  };

  const handleContinueToItinerary = (event) => {
    event.preventDefault();
    dispatch(readyToBuildItinerary());
    dispatch(setDisableItineraryTab(false));
    dispatch(setCurrentItineraryTab("itinerary"));

    // navigate("/itinerary");
  };

  const handleBreakfastSelection = (item) => {
    dispatch(addBreakfast(item));
    setOpenBreakfastDialog(false);
  };

  const handleLunchSelection = (item) => {
    dispatch(addLunch(item));
    setOpenLunchDialog(false);
  };

  const handleDinnerSelection = (item) => {
    dispatch(addDinner(item));
    setOpenDinnerDialog(false);
  };

  useEffect(() => {
    if (placeOneDetails && placeOneDetails?.timings) {
      setOpenPlaceTwoSelect(true);
    }

    if (placeTwoDetails) {
      //do something
    }
  }, [placeOneDetails, placeTwoDetails]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-start bg-muted/50 pt-3 pb-3 gap-[1rem] space-y-2">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Foods
        </CardTitle>
        <CardDescription className="text-left">
          Choose from various cuisines and top restaurants suggested by Gemini.
        </CardDescription>
      </CardHeader>
      <Separator className="my-4 mt-0" />
      <CardContent className="space-y-2 p-0">
        <div className="space-y-2 p-4 flex flex-col">
          <Label htmlFor="breakfast" className="text-[1rem]">
            Breakfast
          </Label>
          {foodPlan?.breakfast?.title ? (
            <Button className="text-primary-foreground bg-primary pointer-events-none h-[32px]">
              {foodPlan?.breakfast?.title}
            </Button>
          ) : (
            <Select
              className="h-[32px] flex items-center"
              onValueChange={(e) => processFoodResultArray(e, "breakfast")}
            >
              <SelectTrigger
                id="breakfast"
                className="items-start [&_[data-description]]:hidden h-[32px]  flex items-center"
              >
                <SelectValue placeholder="Choose cuisine" className="" />
              </SelectTrigger>
              <SelectContent className="">
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
          )}
          <div>
            <div>
              <Dialog
                open={openBreakfastDialog}
                onOpenChange={setOpenBreakfastDialog}
              >
                <DialogTrigger asChild className="hidden">
                  <Button variant="outline">Breakfast Recommendation</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] justify-center">
                  <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                    <CarouselContent>
                      {foodPlanOptions?.breakfastOptions?.map(
                        (placeItem, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card className="overflow-hidden">
                                <CardHeader className="p-0">
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={restaurant}
                                    style={{ height: "150px", width: "100%" }}
                                  />
                                </CardHeader>
                                <CardContent className="flex  flex-col p-2">
                                  <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                    <MapPin className="w-[10px]" />
                                    {placeItem?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {placeItem.title.length > 15
                                        ? placeItem.title.substring(0, 15) +
                                          "..."
                                        : placeItem.title}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        4/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-justify">
                                      {placeItem.details}
                                    </p>
                                  </div>
                                </CardContent>
                                <CardFooter className="p-2 pt-0">
                                  <Button
                                    className="w-full"
                                    onClick={() =>
                                      handleBreakfastSelection(placeItem)
                                    }
                                  >
                                    Add to Itinerary
                                  </Button>
                                </CardFooter>
                              </Card>
                            </div>
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <Separator className="my-4 w-full" />
        <div className="space-y-2 p-4 flex flex-col">
          <Label htmlFor="lunch" className="text-[1rem]">
            Lunch
          </Label>
          {foodPlan?.lunch?.title ? (
            <Button className=" text-primary-foreground bg-primary pointer-events-none h-[32px]">
              {foodPlan?.lunch?.title}
            </Button>
          ) : (
            <Select
              className="h-[32px]  flex items-center"
              onValueChange={(e) => processFoodResultArray(e, "lunch")}
            >
              <SelectTrigger
                id="breakfast"
                className="items-start [&_[data-description]]:hidden h-[32px]  flex items-center"
              >
                <SelectValue placeholder="Choose cuisine" className="" />
              </SelectTrigger>
              <SelectContent className="">
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
          )}
          <div>
            <div>
              <Dialog open={openLunchDialog} onOpenChange={setOpenLunchDialog}>
                <DialogTrigger asChild className="hidden">
                  <Button variant="outline">Lunch Recommendation</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] justify-center">
                  <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                    <CarouselContent>
                      {foodPlanOptions?.lunchOptions?.map(
                        (placeItem, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card className="overflow-hidden">
                                <CardHeader className="p-0">
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={restaurant}
                                    style={{ height: "150px", width: "100%" }}
                                  />
                                </CardHeader>
                                <CardContent className="flex  flex-col p-2">
                                  <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                    <MapPin className="w-[10px]" />
                                    {placeItem?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {placeItem.title.length > 15
                                        ? placeItem.title.substring(0, 15) +
                                          "..."
                                        : placeItem.title}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        4/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-justify">
                                      {placeItem.details}
                                    </p>
                                  </div>
                                </CardContent>
                                <CardFooter className="p-2 pt-0">
                                  <Button
                                    className="w-full"
                                    onClick={() =>
                                      handleLunchSelection(placeItem)
                                    }
                                  >
                                    Add to Itinerary
                                  </Button>
                                </CardFooter>
                              </Card>
                            </div>
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className={`space-y-2 p-4 pb-0 flex flex-col`}>
          <Label htmlFor="dinner" className="text-[1rem]">
            Dinner
          </Label>
          {foodPlan?.dinner?.title ? (
            <Button className=" text-primary-foreground bg-primary pointer-events-none h-[32px]">
              {foodPlan?.dinner?.title}
            </Button>
          ) : (
            <Select
              className="h-[32px]  flex items-center"
              onValueChange={(e) => processFoodResultArray(e, "dinner")}
            >
              <SelectTrigger
                id="dinner"
                className="items-start [&_[data-description]]:hidden h-[32px]  flex items-center"
              >
                <SelectValue placeholder="Choose cuisine" className="" />
              </SelectTrigger>
              <SelectContent className="">
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
          )}
          <div>
            <Dialog open={openDinnerDialog} onOpenChange={setOpenDinnerDialog}>
              <DialogTrigger asChild className="hidden">
                <Button variant="outline">Dinner Recommendation</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] justify-center">
                <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                  <CarouselContent>
                    {foodPlanOptions?.dinnerOptions?.map((placeItem, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card className="overflow-hidden">
                            <CardHeader className="p-0">
                              <img
                                alt=""
                                className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                src={restaurant}
                                style={{ height: "150px", width: "100%" }}
                              />
                            </CardHeader>
                            <CardContent className="flex  flex-col p-2">
                              <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                <MapPin className="w-[10px]" />
                                {placeItem?.location?.address
                                  .split(",")
                                  .slice(0, 3)
                                  .join(", ")}
                              </div>
                              <div className="flex font-bold mb-3 justify-between items-center">
                                <div>
                                  {placeItem.title.length > 15
                                    ? placeItem.title.substring(0, 15) + "..."
                                    : placeItem.title}
                                </div>
                                <div className="flex gap-5 font-bold h-[14px]">
                                  <Badge className="">
                                    <Star className="w-[10px] mr-[5px]" />
                                    4/5
                                  </Badge>
                                </div>
                              </div>
                              <div className="w-[250px]">
                                <p className="text-[10px] text-justify">
                                  {placeItem.details}
                                </p>
                              </div>
                            </CardContent>
                            <CardFooter className="p-2 pt-0">
                              <Button
                                className="w-full"
                                onClick={() => handleDinnerSelection(placeItem)}
                              >
                                Add to Itinerary
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
      <Separator className="my-4 mb-[14rem]" />
      <div className="p-4 pt-0">
        <Button
          className="h-[32px] w-full"
          onClick={handleContinueToItinerary}
          disabled={
            !foodPlan?.breakfast?.title &&
            !foodPlan?.lunch?.title &&
            !foodPlan?.dinner?.title
          }
        >
          Proceed
        </Button>
      </div>
    </Card>
  );
};

export default FoodsCard;
