import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import breakfastImg from "../images/breakfast.jpg";
import lunchImg from "../images/lunch.jpg";
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
import { Skeleton } from "../ui/skeleton";
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
    itineraryResponseGemini,
    // googleMapInstance,
  } = useSelector((state) => state.plannerDetails);
  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });
  const { toast } = useToast();
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
  const [enableProceed, setEnableProceed] = useState(true);

  //to generate food options
  const generateFoodOptions = async (cuisine, foodPlanType) => {
    try {
      const foodOptionsPrompt = `top 3 places to have ${foodPlanType} with ${cuisine} cuisines, in ${destinationDetails.destination}, send the response as a Javascript JSON array of objects, each object is a place, each object has three properties first is a "title" property and its value is a string of the Name of the place, second is the "details" property and its value is a string of details about the place in not more than 20 words and third is "location" property which has the location information of the place, the value of location is an object with three properties first "address" which is a string of the full address of the place, including state and country and zip code, second is "lng" which is the longitude coordinates of the place and third is "lat" which is the latitude coorinates of the place`;
      const result = await model.generateContent(foodOptionsPrompt);
      const response = result.response.text();
      const regex = /(\[.*?\])/s;
      const expectedJSON = response.match(regex);
      console.log(JSON.parse(expectedJSON[0]));
      if (expectedJSON) {
        return JSON.parse(expectedJSON[0]);
      } else {
        toast({
          title: "Couldn't format Gemini Response, please try again!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error,
        variant: "destructive",
      });
    }
  };

  //to unwrapp the array of the promises returned by generateFoodOptions func above
  const processFoodResultArray = async (cuisine, foodPlanType) => {
    if (foodPlanType === "breakfast") {
      setOpenBreakfastDialog(true);
      try {
        const myArr = await generateFoodOptions(cuisine, foodPlanType);
        dispatch(addBreakfastOptions(myArr));
        // const promisesArr = myArr.map((item) => generateRestaurantDetails(item));
        // const result = await Promise.all(promisesArr);
      } catch (error) {
        console.log(error);
        toast({
          title: error,
          variant: "destructive",
        });
      }
    } else if (foodPlanType === "lunch") {
      setOpenLunchDialog(true);
      try {
        const myArr = await generateFoodOptions(cuisine, foodPlanType);
        dispatch(addLunchOptions(myArr));
        // const promisesArr = myArr.map((item) => generateRestaurantDetails(item));
        // const result = await Promise.all(promisesArr);
      } catch (error) {
        console.log(error);
        toast({
          title: error,
          variant: "destructive",
        });
      }
    } else if (foodPlanType === "brunch") {
      // dispatch(addBrunchOptions(myArr));
      console.log("Brunch to be configured");
    } else {
      setOpenDinnerDialog(true);
      try {
        const myArr = await generateFoodOptions(cuisine, foodPlanType);
        dispatch(addDinnerOptions(myArr));
        // const promisesArr = myArr.map((item) => generateRestaurantDetails(item));
        // const result = await Promise.all(promisesArr);
      } catch (error) {
        console.log(error);
        toast({
          title: error,
          variant: "destructive",
        });
      }
    }
  };

  const handleContinueToItinerary = (event) => {
    event.preventDefault();
    dispatch(readyToBuildItinerary("readyToBuild"));
    dispatch(setDisableItineraryTab(false));
    dispatch(setCurrentItineraryTab("itinerary"));
  };

  const handleBreakfastSelection = (item) => {
    if (item.location.lat && item.location.lng) {
      map.panTo({ lat: item?.location?.lat, lng: item?.location?.lng });
    }
    dispatch(addBreakfast(item));
    setOpenBreakfastDialog(false);
  };

  const handleLunchSelection = (item) => {
    if (item.location.lat && item.location.lng) {
      map.panTo({ lat: item?.location?.lat, lng: item?.location?.lng });
    }
    dispatch(addLunch(item));
    setOpenLunchDialog(false);
  };

  const handleDinnerSelection = (item) => {
    if (item.location.lat && item.location.lng) {
      map.panTo({ lat: item?.location?.lat, lng: item?.location?.lng });
    }
    dispatch(addDinner(item));
    setOpenDinnerDialog(false);
  };

  //enable proceed button when all food plans are set up
  useEffect(() => {
    if (foodPlan.breakfast && foodPlan.lunch && foodPlan.dinner) {
      setEnableProceed(false);
    }
  }, [foodPlan]);

  return (
    <Card
      className={`overflow-hidden w-full ${
        itineraryResponseGemini ? "h-[41vh] overflow-y-auto" : ""
      }`}
    >
      <CardHeader className="flex flex-col items-start bg-muted/50 pt-2 pb-4 gap-2 space-y-2">
        <CardTitle className="group flex items-center text-lg">Foods</CardTitle>
        <CardDescription className="text-left">
          Choose from various cuisines and top restaurants suggested by Gemini.
        </CardDescription>
      </CardHeader>
      <Separator className="my-4 mt-0" />
      <CardContent className="space-y-2 p-0">
        <div className="space-y-2 p-4 flex flex-col">
          <Label htmlFor="breakfast" className="text-[12px]">
            Breakfast
          </Label>
          {foodPlan?.breakfast?.title ? (
            <Button className="text-primary-foreground bg-primary pointer-events-none h-[32px] text-[12px]">
              {foodPlan?.breakfast?.title}
            </Button>
          ) : (
            <Select
              className="h-[32px] flex items-center text-[12px]"
              onValueChange={(e) => processFoodResultArray(e, "breakfast")}
            >
              <SelectTrigger
                id="breakfast"
                className="items-start [&_[data-description]]:hidden h-[32px]  flex items-center text-[12px]"
              >
                <SelectValue
                  placeholder="Choose cuisine"
                  className="text-[12px]"
                />
              </SelectTrigger>
              <SelectContent className="">
                {allCuisines.map((item, index) => (
                  <SelectItem value={item} key={index}>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Utensils className="w-[12px]" />
                      <div className="grid gap-0.5 mt-[2px] text-[12px]">
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
                  {foodPlanOptions?.breakfastOptions.length > 1 ? (
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
                                      src={breakfastImg}
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
                  ) : (
                    <div>
                      <DialogHeader>
                        <DialogTitle>
                          Asking Gemini For Suggestions...
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center space-x-4 h-[18vh]">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[280px]" />
                          <Skeleton className="h-4 w-[280px]" />
                          <Skeleton className="h-4 w-[280px]" />
                          <Skeleton className="h-4 w-[250px]" />
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <Separator className="my-4 w-full" />
        <div className="space-y-2 p-4 flex flex-col">
          <Label htmlFor="lunch" className="text-[12px]">
            Lunch
          </Label>
          {foodPlan?.lunch?.title ? (
            <Button className=" text-primary-foreground bg-primary pointer-events-none h-[32px] text-[12px]">
              {foodPlan?.lunch?.title}
            </Button>
          ) : (
            <Select
              className="h-[32px] flex items-center"
              onValueChange={(e) => processFoodResultArray(e, "lunch")}
            >
              <SelectTrigger
                id="breakfast"
                className="items-start [&_[data-description]]:hidden h-[32px]  flex items-center text-[12px]"
              >
                <SelectValue
                  placeholder="Choose cuisine"
                  className="text-[12px]"
                />
              </SelectTrigger>
              <SelectContent className="">
                {allCuisines.map((item, index) => (
                  <SelectItem value={item} key={index}>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Utensils className="w-[12px]" />
                      <div className="grid gap-0.5 mt-[2px] text-[12px]">
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
                  {foodPlanOptions?.lunchOptions.length > 1 ? (
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
                                      src={lunchImg}
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
                  ) : (
                    <div>
                      <DialogHeader>
                        <DialogTitle>Asking Gemini For Suggestions</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center space-x-4 h-[18vh]">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[280px]" />
                          <Skeleton className="h-4 w-[280px]" />
                          <Skeleton className="h-4 w-[280px]" />
                          <Skeleton className="h-4 w-[250px]" />
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className={`space-y-2 p-4 flex flex-col`}>
          <Label htmlFor="dinner" className="text-[12px]">
            Dinner
          </Label>
          {foodPlan?.dinner?.title ? (
            <Button className=" text-primary-foreground bg-primary pointer-events-none h-[32px] text-[12px]">
              {foodPlan?.dinner?.title}
            </Button>
          ) : (
            <Select
              className="h-[32px] flex items-center"
              onValueChange={(e) => processFoodResultArray(e, "dinner")}
            >
              <SelectTrigger
                id="dinner"
                className="items-start [&_[data-description]]:hidden h-[32px]  flex items-center text-[12px]"
              >
                <SelectValue
                  placeholder="Choose cuisine"
                  className="text-[12px]"
                />
              </SelectTrigger>
              <SelectContent className="">
                {allCuisines.map((item, index) => (
                  <SelectItem value={item} key={index}>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Utensils className="w-[12px]" />
                      <div className="grid gap-0.5 mt-[2px] text-[12px]">
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
                {foodPlanOptions?.dinnerOptions.length > 1 ? (
                  <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                    <CarouselContent>
                      {foodPlanOptions?.dinnerOptions?.map(
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
                                      handleDinnerSelection(placeItem)
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
                ) : (
                  <div>
                    <DialogHeader>
                      <DialogTitle>
                        Asking Gemini For Suggestions...
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-4 h-[18vh]">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[280px]" />
                        <Skeleton className="h-4 w-[280px]" />
                        <Skeleton className="h-4 w-[280px]" />
                        <Skeleton className="h-4 w-[250px]" />
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
      <Separator
        className={`my-4 h-[0.5px] ${
          itineraryResponseGemini ? " mb-[2rem]" : "mt-[8.5rem]"
        }`}
      />
      <div className="p-4 pb-6">
        <Button
          className="h-[32px] w-full"
          onClick={handleContinueToItinerary}
          disabled={enableProceed}
        >
          Proceed
        </Button>
      </div>
    </Card>
  );
};

export default FoodsCard;
