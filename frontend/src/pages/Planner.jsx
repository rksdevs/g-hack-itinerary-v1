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
} from "../slices/plannerSlice";
import PlaceTwoAccordions from "../components/assets/PlaceTwoAccordions";

function Planner() {
  const dispatch = useDispatch();
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    destinationDetails,
  } = useSelector((state) => state.plannerDetails);
  const [placeOne, setPlaceOne] = useState("Religious");
  const [topTenList, setTopTenList] = useState([]);
  const [currentPlace, setCurrentPlace] = useState("Bangalore, India");
  const [openPlaceTwoSelect, setOpenPlaceTwoSelect] = useState(false);

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

  const generatePlaceOptions = async (e, placeType) => {
    // e.preventDefault();
    console.log("triggered generating options");
    // setPlaceOne();
    try {
      const placeOnePrompt = `top 3 ${e} places to visit in ${destinationDetails?.destination}, send the response as a Javascript JSON array of objects, each object is a place, each object has three properties first is a "title" property and its value is a string of the Name of the place, second is the "details" property and its value is a string of details about the place and third is "location" property which has the location information of the place, the value of location is an object with three properties first "address" which has the value of the full address of the place, second is "lng" which is the longitude coordinates of the place and third is "lat" which is the latitude coorinates of the place`;
      const result = await model.generateContent(placeOnePrompt);
      const response = result.response.text();
      console.log(response, "seg");
      const regex = /(\[.*?\])/s;
      const expectedJSON = response.match(regex);
      console.log(JSON.parse(expectedJSON[0]));
      setTopTenList(JSON.parse(expectedJSON[0]));
      if (placeType === "placeOne") {
        dispatch(addPlaceOneOptions(JSON.parse(expectedJSON[0])));
      } else {
        dispatch(addPlaceTwoOptions(JSON.parse(expectedJSON[0])));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(topTenList, "top 10");
  }, [topTenList]);

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
                  Plan your day
                </legend>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="place-one">Select Place One</Label>
                    <Select
                      onValueChange={(e) => generatePlaceOptions(e, "placeOne")}
                    >
                      <SelectTrigger
                        id="place-one"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a type of place you wish to visit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Religious">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Heritages{" "}
                                <span className="font-medium text-foreground">
                                  Religious & Cultural Gatherings
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Places that best describes the culture &
                                heritage of the city.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Nature">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Nature{" "}
                                <span className="font-medium text-foreground">
                                  Get close to Nature
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Get closer to nature in places like mountains,
                                beaches, forests, zoo etc.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Shopping">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Lifestyle{" "}
                                <span className="font-medium text-foreground">
                                  Shopping, Malls & Lifestyle
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Explore the city's biggest and best places for
                                shopaholic
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="popular">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Something Else{" "}
                                <span className="font-medium text-foreground">
                                  Nothing particular, let the app decide
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Populates the best places in the city for you to
                                choose
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={!placeOneDetails ? "hidden" : ""}>
                    <div className="grid gap-3 mb-[5px]">
                      <Label htmlFor="top-p">
                        Select time to vist place one
                      </Label>
                    </div>
                    <div className="grid gap-3">
                      {/* <Label htmlFor="top-k">Top K</Label> */}
                      <Select
                        onValueChange={(e) =>
                          // generatePlaceOneOptions(e, "placeOne")
                          dispatch(addPlaceOneTiming(e))
                        }
                      >
                        <SelectTrigger
                          id="place-one-time"
                          className="items-start [&_[data-description]]:hidden"
                        >
                          <SelectValue placeholder="Select a time to visit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6 AM to 8 AM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Early Morning{" "}
                                  <span className="font-medium text-foreground">
                                    6 AM to 8 AM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Want to start your day early with
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="9 AM to 12 PM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  First half{" "}
                                  <span className="font-medium text-foreground">
                                    9 AM to 12 PM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Want to schedule it for first half of the day
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="3 PM to 5 PM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Second half{" "}
                                  <span className="font-medium text-foreground">
                                    3 PM to 5 PM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Want to schedule it for first half of the day
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="7 PM to 9 PM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Evening hours{" "}
                                  <span className="font-medium text-foreground">
                                    7 PM to 9 PM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Schedule your evening
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className={!openPlaceTwoSelect ? "hidden" : "grid gap-3"}>
                  <div>
                    <Label htmlFor="place-one">Select Place Two</Label>
                    <Select
                      onValueChange={(e) => generatePlaceOptions(e, "placeTwo")}
                    >
                      <SelectTrigger
                        id="place-two"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a type of place you wish to visit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Religious">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Heritages{" "}
                                <span className="font-medium text-foreground">
                                  Religious & Cultural Gatherings
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Places that best describes the culture &
                                heritage of the city.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Nature">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Nature{" "}
                                <span className="font-medium text-foreground">
                                  Get close to Nature
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Get closer to nature in places like mountains,
                                beaches, forests, zoo etc.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="Shopping">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Lifestyle{" "}
                                <span className="font-medium text-foreground">
                                  Shopping, Malls & Lifestyle
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Explore the city's biggest and best places for
                                shopaholic
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="popular">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Something Else{" "}
                                <span className="font-medium text-foreground">
                                  Nothing particular, let the app decide
                                </span>
                              </p>
                              <p className="text-xs" data-description>
                                Populates the best places in the city for you to
                                choose
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={!placeTwoDetails ? "hidden" : ""}>
                    <div className="grid gap-3 mb-[5px]">
                      <Label htmlFor="top-p">
                        Select time to vist place two
                      </Label>
                    </div>
                    <div className="grid gap-3">
                      {/* <Label htmlFor="top-k">Top K</Label> */}
                      <Select
                        onValueChange={(e) =>
                          // generatePlaceOneOptions(e, "placeOne")
                          dispatch(addPlaceTwoTiming(e))
                        }
                      >
                        <SelectTrigger
                          id="place-one-time"
                          className="items-start [&_[data-description]]:hidden"
                        >
                          <SelectValue placeholder="Select a time to visit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6 AM to 8 AM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Early Morning{" "}
                                  <span className="font-medium text-foreground">
                                    6 AM to 8 AM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Want to start your day early with
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="9 AM to 12 PM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  First half{" "}
                                  <span className="font-medium text-foreground">
                                    9 AM to 12 PM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Want to schedule it for first half of the day
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="3 PM to 5 PM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Second half{" "}
                                  <span className="font-medium text-foreground">
                                    3 PM to 5 PM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Want to schedule it for first half of the day
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="7 PM to 9 PM">
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <Clock className="size-5" />
                              <div className="grid gap-0.5">
                                <p>
                                  Evening hours{" "}
                                  <span className="font-medium text-foreground">
                                    7 PM to 9 PM
                                  </span>
                                </p>
                                <p className="text-xs" data-description>
                                  Schedule your evening
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
              {placeOneOptions.length > 1 && <PlaceOneAccordions />}
              {placeTwoOptions.length > 1 && <PlaceTwoAccordions />}
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

export default Planner;
