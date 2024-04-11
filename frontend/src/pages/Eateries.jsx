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
} from "../slices/plannerSlice";
import PlaceTwoAccordions from "../components/assets/PlaceTwoAccordions";
import BreakfastAccordion from "../components/assets/BreakfastAccordion";
import LunchAccordion from "../components/assets/LunchAccordion";
import BrunchAccordion from "../components/assets/BrunchAccordion";
import DinnerAccordion from "../components/assets/DinnerAccordion";

function Eateries() {
  const dispatch = useDispatch();
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    foodPlanOptions,
    foodPlan,
  } = useSelector((state) => state.plannerDetails);
  const [placeOne, setPlaceOne] = useState("Religious");
  const [topTenList, setTopTenList] = useState([]);
  const [currentPlace, setCurrentPlace] = useState("Bangalore, India");
  const [openPlaceTwoSelect, setOpenPlaceTwoSelect] = useState(false);

  //for eateries
  const [openBreakfast, setOpenBreakfast] = useState(true);
  const [openLunch, setOpenLunch] = useState(true);
  const [openBrunch, setOpenBrunch] = useState(true);
  const [openDinner, setOpenDinner] = useState(true);
  const [breakfastCuisine, setBreakfastCuisine] = useState("");
  const [lunchCuisine, setLunchCuisine] = useState("");
  const [brunchCuisine, setBrunchCuisine] = useState("");
  const [dinnerCuisine, setDinnerCuisine] = useState("");

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
    event.preventDefault();
    console.log("triggered generating options");
    // setPlaceOne();
    try {
      const foodOptionsPrompt = `top 3 places to have ${foodPlanType} with ${cuisine} cuisines, in ${currentPlace}, send the response as a Javascript JSON array of objects, each object is a place, each object has three properties first is a "title" property and its value is a string of the Name of the place, second is the "details" property and its value is a string of details about the place and third is "location" property which has the location information of the place`;
      const result = await model.generateContent(foodOptionsPrompt);
      const response = result.response.text();
      console.log(response, "seg");
      const regex = /(\[.*?\])/s;
      const expectedJSON = response.match(regex);
      console.log(JSON.parse(expectedJSON[0]));
      // setTopTenList(JSON.parse(expectedJSON[0]));
      if (foodPlanType === "breakfast") {
        dispatch(addBreakfastOptions(JSON.parse(expectedJSON[0])));
      } else if (foodPlanType === "lunch") {
        dispatch(addLunchOptions(JSON.parse(expectedJSON[0])));
      } else if (foodPlanType === "brunch") {
        dispatch(addBrunchOptions(JSON.parse(expectedJSON[0])));
      } else {
        dispatch(addDinnerOptions(JSON.parse(expectedJSON[0])));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(topTenList, "top 10");
  }, [topTenList]);

  const openBreakfastInput = (e) => {
    e.preventDefault();
    //clear breakfast.skip from state and localstorage
    setOpenBreakfast(true);
  };

  const skipBreakfastHandler = (event) => {
    event.preventDefault();
    dispatch(skipBreakfast());
    setOpenBreakfast(false);
  };

  const openLunchInput = (e) => {
    e.preventDefault();
    setOpenLunch(!openLunch);
  };

  const openBrunchInput = (e) => {
    e.preventDefault();
    setOpenBrunch(!openBrunch);
  };

  const openDinnerInput = (e) => {
    e.preventDefault();
    setOpenDinner(!openDinner);
  };

  return (
    <div className="grid w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Planner</h1>
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
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Plan for your tastebuds!
                </legend>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="breakfast">Breakfast</Label>
                    <div className="flex my-2 gap-3">
                      <Button
                        onClick={openBreakfastInput}
                        className={!openBreakfast ? "w-[80px]" : "hidden"}
                      >
                        {/* {openBreakfast ? "Skip" : "Choose"} */}
                        Choose
                      </Button>
                      <Button
                        onClick={(event) => skipBreakfastHandler(event)}
                        className={openBreakfast ? "w-[80px]" : "hidden"}
                      >
                        {/* {openBreakfast ? "Skip" : "Choose"} */}
                        Skip
                      </Button>
                      <div className="relative">
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
                            generateFoodOptions(
                              event,
                              breakfastCuisine,
                              "breakfast"
                            )
                          }
                        >
                          Go
                        </Button>
                      </div>
                      {/* <Button>Skip</Button> */}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="place-one">Lunch</Label>
                    <div className="flex my-2 gap-3">
                      <Button onClick={openLunchInput} className="w-[80px]">
                        {openLunch ? "Skip" : "Choose"}
                      </Button>
                      <div className="relative">
                        <Search
                          className={
                            !openLunch
                              ? "hidden"
                              : "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                          }
                        />
                        <Input
                          type="search"
                          placeholder={
                            !openLunch
                              ? "Skipped lunch, carry food with you!"
                              : "Enter preferred cuisines"
                          }
                          className={
                            !openLunch
                              ? "sm:w-[300px] md:w-[200px] lg:w-[300px]"
                              : "pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                          }
                          disabled={!openLunch}
                          value={lunchCuisine}
                          onChange={(e) => setLunchCuisine(e.target.value)}
                        />
                        <Button
                          className={
                            !openLunch
                              ? "hidden"
                              : "absolute right-[5px] top-[3px] h-[29px] w-10"
                          }
                          onClick={(event) =>
                            generateFoodOptions(event, lunchCuisine, "lunch")
                          }
                        >
                          Go
                        </Button>
                      </div>
                      {/* <Button>Skip</Button> */}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="place-one">Brunch</Label>
                    <div className="flex my-2 gap-3">
                      <Button onClick={openBrunchInput} className="w-[80px]">
                        {openBrunch ? "Skip" : "Choose"}
                      </Button>
                      <div className="relative">
                        <Search
                          className={
                            !openBrunch
                              ? "hidden"
                              : "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                          }
                          value={brunchCuisine}
                          onChange={(e) => setBrunchCuisine(e.target.value)}
                        />
                        <Input
                          type="search"
                          placeholder={
                            !openBrunch
                              ? "Skipped brunch, try some desserts!"
                              : "Enter preferred cuisines"
                          }
                          className={
                            !openBrunch
                              ? "sm:w-[300px] md:w-[200px] lg:w-[300px]"
                              : "pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                          }
                          disabled={!openBrunch}
                        />
                        <Button
                          className={
                            !openBrunch
                              ? "hidden"
                              : "absolute right-[5px] top-[3px] h-[29px] w-10"
                          }
                          onClick={(event) =>
                            generateFoodOptions(event, brunchCuisine, "brunch")
                          }
                        >
                          Go
                        </Button>
                      </div>
                      {/* <Button>Skip</Button> */}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="place-one">Dinner</Label>
                    <div className="flex my-2 gap-3">
                      <Button onClick={openDinnerInput} className="w-[80px]">
                        {openDinner ? "Skip" : "Choose"}
                      </Button>
                      <div className="relative">
                        <Search
                          className={
                            !openDinner
                              ? "hidden"
                              : "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                          }
                        />
                        <Input
                          type="search"
                          placeholder={
                            !openDinner
                              ? "Skipped dinner, where's the party!"
                              : "Enter preferred cuisines"
                          }
                          className={
                            !openDinner
                              ? "sm:w-[300px] md:w-[200px] lg:w-[300px]"
                              : "pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                          }
                          disabled={!openDinner}
                          value={dinnerCuisine}
                          onChange={(e) => setDinnerCuisine(e.target.value)}
                        />
                        <Button
                          className={
                            !openDinner
                              ? "hidden"
                              : "absolute right-[5px] top-[3px] h-[29px] w-10"
                          }
                          onClick={(event) =>
                            generateFoodOptions(event, dinnerCuisine, "dinner")
                          }
                        >
                          Go
                        </Button>
                      </div>
                      {/* <Button>Skip</Button> */}
                    </div>
                  </div>
                </div>
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input id="top-p" type="number" placeholder="0.7" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input id="top-k" type="number" placeholder="0.0" />
                  </div>
                </div> */}
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
                  <Textarea
                    id="content"
                    placeholder="You are a..."
                    className="min-h-[9.5rem]"
                  />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge
              variant="outline"
              className="absolute right-20 top-1 h-[30px]"
            >
              Gemini's Suggestions
              {/* <RefreshCw
                className="w-[14px] ml-[10px] cursor-pointer"
                onClick={() => {
                  dispatch(clearPlanner());
                }}
              /> */}
            </Badge>
            <Badge
              variant="outline"
              className="absolute right-3 top-1 cursor-pointer"
            >
              <RefreshCw
                className="w-[14px]"
                onClick={() => {
                  dispatch(clearPlanner());
                }}
              />
            </Badge>

            <div className="flex-1 pt-2">
              {foodPlanOptions?.breakfastOptions?.length > 1 && (
                <BreakfastAccordion />
              )}
              {foodPlanOptions?.lunchOptions?.length > 1 && <LunchAccordion />}
              {foodPlanOptions?.brunchOptions?.length > 1 && (
                <BrunchAccordion />
              )}
              {foodPlanOptions?.dinnerOptions?.length > 1 && (
                <DinnerAccordion />
              )}
              {/* {placeTwoOptions.length > 1 && <PlaceTwoAccordions />} */}
            </div>
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Mic className="size-4" />
                        <span className="sr-only">Use Microphone</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Use Microphone</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Eateries;
