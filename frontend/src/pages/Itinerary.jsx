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
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
  MapPin,
  Star,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
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
  TooltipTrigger,
  TooltipProvider,
} from "../components/ui/tooltip";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../components/ui/pagination";
import { Separator } from "../components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import restaurant from "../components/images/restaurant.jpg";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAddItineraryMutation } from "../slices/itineraryApiSlice";
import { setItinerary } from "../slices/itinerarySlice";
import { useNavigate } from "react-router-dom";

function Itinerary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Your message");
  const [reply, setReply] = useState("Awaiting Response...");
  const [topTenList, setTopTenList] = useState([]);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const [itinerary, setItinerary] = useState("123456");
  const [itineraryDetails, setItineraryDetails] = useState("");
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    foodPlanOptions,
    destinationDetails,
    placeToStayDetails,
    foodPlan,
    itineraryReadyToBuild,
  } = useSelector((state) => state.plannerDetails);

  const { userInfo } = useSelector((state) => state.auth);

  const [createItinerary, { isLoading, error }] = useAddItineraryMutation();

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    try {
      const res = await createItinerary({
        name: `${destinationDetails.origin}-${destinationDetails.destination}`,
        itineraryDetails: {
          placeOneDetails,
          placeTwoDetails,
          placeToStayDetails,
          itineraryReadyToBuild,
          foodPlan,
          destinationDetails,
          itineraryResponse: itineraryDetails?.responseOne,
        },
      }).unwrap();
      console.log({ ...res }, "132");
      dispatch(setItinerary({ ...res }));
      navigate(`/itineraryDetails/${res._id}`);
    } catch (error) {}
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const itineraryPrompt = `You are a tool that crafts itinerary for the day. You can utilize information like Breakfast, Lunch, Brunch, Dinner and their respective place/location/hotel to have the food, you can also utilize two places like place-one and place-two along with their location details and timing provided to you. You will then build an itinerary from the above information. 
      
      Below is how the sample of information provided to you looks like, it is structured like an object in Javascript: 
      {
        foodPlan: {
            breakfast: {
                "title": ${foodPlan?.breakfast?.title},
                "details": ${foodPlan?.breakfast?.details},
                "location": ${foodPlan?.breakfast?.location?.address}
              },
              lunch: {
                "title": ${foodPlan?.lunch?.title},
                "details": ${foodPlan?.lunch?.details},
                "location": ${foodPlan?.lunch?.location?.address}
              }
              brunch: {
                "title": ${foodPlan?.brunch?.title},
                "details": ${foodPlan?.brunch?.details},
                "location": ${foodPlan?.brunch?.location?.address}
              }
              dinner: {
                "title": ${foodPlan?.dinner?.title},
                "details": ${foodPlan?.dinner?.details},
                "location": ${foodPlan?.dinner?.location?.address}
              },
        },
        placeOneDetails: {
            "title": ${placeOneDetails?.name},
            "details": ${placeOneDetails?.placeInfo},
            "location": {
              "address": ${placeOneDetails?.formatted_address},
              "lng": ${placeOneDetails?.geometry?.lng},
              "lat": ${placeOneDetails?.geometry?.lat}
            },
            "timings": ${placeOneDetails?.timings}
          },
          placeTwoDetails: {
            "title": ${placeTwoDetails?.name},
            "details": ${placeTwoDetails?.placeInfo},
            "location": {
              "address": ${placeTwoDetails?.formatted_address},
              "lng": ${placeTwoDetails?.geometry?.lng},
              "lat": ${placeTwoDetails?.geometry?.lat}
            },
            "timings": ${placeTwoDetails?.timings}
          }
      }
      
      Your response should have nothing else but only one javascript JSON object, this should have a key named as "responseOne" a paragraph, and utilize these info, and make the itinerary, also note that you need to consider the timings provided, a general rule will be start the day from breakfast and proceed, this should be around 300 words but not more than 300 words.

      Use the following information to build the itinerary: ${JSON.parse(
        localStorage.getItem("plannerDetails")
      )}
      `;
      const result = await model.generateContent(itineraryPrompt);
      const response = await result.response.text();
      const regex = /\{.*\}/s;
      console.log(response);
      const expectedJSON = response.match(regex);
      console.log(expectedJSON);
      console.log(JSON.parse(expectedJSON[0]));
      //   const segments = response.text().split(/\b(?:1|2|3|4|5|6|7|8|9|10)\./);
      //   const listItems = segments
      //     .filter((segment) => segment.trim() !== "")
      //     .map((segment) => `${segment.trim()}`);
      //   setReply("Your Top 10 List Is: ");
      //   setTopTenList(listItems);
      setItineraryDetails(JSON.parse(expectedJSON[0]));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("reply - ", reply);
  }, [reply]);

  return (
    <div className="grid pl-[56px]">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 hidden">
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
          <div className="relative hidden flex-col items-start gap-8 md:flex">
            {itineraryReadyToBuild && (
              <Card className="overflow-hidden w-full">
                <CardHeader className="flex flex-row items-start bg-muted/50 pt-3 pb-3">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Itinerary
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy Order ID</span>
                      </Button>
                    </CardTitle>
                    <CardDescription className="flex">
                      Date:{" "}
                      {destinationDetails?.travelDate
                        ? destinationDetails?.travelDate
                        : "To be decided"}
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Options
                      </span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Trash</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm pt-2 pb-2">
                  <div className="grid gap-1">
                    <div className="font-semibold">Destination Details</div>
                    <ul className="grid gap-1">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Origin</span>
                        <span>{destinationDetails?.origin}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Destination
                        </span>
                        <span>{destinationDetails?.destination}</span>
                      </li>
                    </ul>
                    <Separator className="my-4" />
                    <ul className="grid gap-1">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Mode of Travel
                        </span>
                        <span>
                          {destinationDetails?.modeOfTravel &&
                            destinationDetails?.modeOfTravel
                              .charAt(0)
                              .toUpperCase() +
                              destinationDetails?.modeOfTravel.slice(1)}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Date of Travel
                        </span>
                        <span>{destinationDetails?.travelDate}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Distance</span>
                        <span>{destinationDetails?.travelDistance}</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">
                          Arriving On
                        </span>
                        <span>{destinationDetails?.travelDate}</span>
                      </li>
                    </ul>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Visiting Plans</div>
                    <div className="flex gap-2 justify-between">
                      <div className="grid gap-1 text-left">
                        <div className="font-semibold">
                          {placeOneDetails?.name?.length > 20
                            ? placeOneDetails?.name?.substring(0, 20) + "..."
                            : placeOneDetails?.name}
                        </div>
                        <div className="grid gap-0.5 not-italic text-muted-foreground">
                          {placeOneDetails?.formatted_address
                            .split(",")
                            .slice(0, 3)
                            .map((item, index) => (
                              <span key={index}>{item}</span>
                            ))}
                        </div>
                      </div>
                      <div className="grid auto-rows-max gap-1 text-right">
                        <div className="font-semibold">
                          {placeTwoDetails?.name?.length > 20
                            ? placeTwoDetails?.name?.substring(0, 20) + "..."
                            : placeTwoDetails?.name}
                        </div>
                        <div className="grid gap-0.5 not-italic text-muted-foreground">
                          {placeTwoDetails?.formatted_address
                            .split(",")
                            .slice(0, 3)
                            .map((item, index) => (
                              <span key={index}>{item}</span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-1">
                    <div className="font-semibold">Food Plans</div>
                    <dl className="grid gap-1">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Breakfast</dt>
                        <dd>
                          {foodPlan?.breakfast?.title
                            ? foodPlan?.breakfast?.title
                            : "Skipped"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Lunch</dt>
                        <dd>
                          {foodPlan?.lunch?.title
                            ? foodPlan?.lunch?.title
                            : "Skipped"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Dinner</dt>
                        <dd>
                          {foodPlan?.dinner?.title
                            ? foodPlan?.dinner?.title
                            : "Skipped"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-1">
                    <div className="font-semibold">Confirm Itinerary</div>
                    <dl className="grid gap-1">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          Build Status
                        </dt>
                        <dd>Ready to Build</dd>
                      </div>
                    </dl>
                    <Button onClick={handleMessage}>Build</Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-2">
                  <div className="text-xs text-muted-foreground">
                    Updated <time dateTime="2023-11-23">November 23, 2023</time>
                  </div>
                  <Pagination className="ml-auto mr-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span className="sr-only">Previous Order</span>
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                          <span className="sr-only">Next Order</span>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            )}
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2 gap-[1rem]">
            <div className="flex justify-center h-[40vh] items-center">
              <Carousel className="w-[90%] min-h-[316px] flex justify-between flex-col">
                <CarouselContent>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                        <CardHeader className="p-0">
                          <img
                            alt=""
                            className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                            src={restaurant}
                            style={{ height: "150px", width: "100%" }}
                          />
                        </CardHeader>
                        <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                          <div>Breakfast At</div>
                        </CardDescription>
                        <CardContent className="flex  flex-col p-2">
                          <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                            <MapPin className="w-[10px]" />
                            {foodPlan?.breakfast?.location?.address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {foodPlan?.breakfast?.title?.length > 15
                                ? foodPlan?.breakfast?.title.substring(0, 15) +
                                  "..."
                                : foodPlan?.breakfast?.title}
                            </div>
                            <div className="flex gap-5 font-bold h-[14px]">
                              <Badge className="">
                                <Star className="w-[10px] mr-[5px]" />
                                4/5
                              </Badge>
                            </div>
                          </div>
                          <div className="w-[250px]">
                            <p className="text-[10px] text-left">
                              {foodPlan?.breakfast?.details}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                        <CardHeader className="p-0">
                          <img
                            alt=""
                            className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                            src={placeOneDetails?.photos[0]}
                            style={{ height: "150px", width: "100%" }}
                          />
                        </CardHeader>
                        <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                          <div>Visiting Next</div>
                        </CardDescription>
                        <CardContent className="flex  flex-col p-2">
                          <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                            <MapPin className="w-[10px]" />
                            {placeOneDetails?.formatted_address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {placeOneDetails?.name?.length > 15
                                ? placeOneDetails?.name?.substring(0, 15) +
                                  "..."
                                : placeOneDetails?.name}
                            </div>
                            <div className="flex gap-5 font-bold h-[14px]">
                              <Badge className="">
                                <Star className="w-[10px] mr-[5px]" />
                                {placeOneDetails?.rating}/5
                              </Badge>
                            </div>
                          </div>
                          <div className="w-[250px]">
                            <p className="text-[10px] text-left">
                              {placeOneDetails?.placeInfo}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                        <CardHeader className="p-0">
                          <img
                            alt=""
                            className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                            src={restaurant}
                            style={{ height: "150px", width: "100%" }}
                          />
                        </CardHeader>
                        <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                          <div>Lunch At</div>
                        </CardDescription>
                        <CardContent className="flex  flex-col p-2">
                          <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                            <MapPin className="w-[10px]" />
                            {foodPlan?.lunch?.location?.address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {foodPlan?.lunch?.title?.length > 15
                                ? foodPlan?.lunch?.title.substring(0, 15) +
                                  "..."
                                : foodPlan?.lunch?.title}
                            </div>
                            <div className="flex gap-5 font-bold h-[14px]">
                              <Badge className="">
                                <Star className="w-[10px] mr-[5px]" />
                                4/5
                              </Badge>
                            </div>
                          </div>
                          <div className="w-[250px]">
                            <p className="text-[10px] text-left">
                              {foodPlan?.lunch?.details}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                        <CardHeader className="p-0">
                          <img
                            alt=""
                            className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                            src={placeTwoDetails?.photos[0]}
                            style={{ height: "150px", width: "100%" }}
                          />
                        </CardHeader>
                        <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                          <div>Visiting Next</div>
                        </CardDescription>
                        <CardContent className="flex  flex-col p-2">
                          <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                            <MapPin className="w-[10px]" />
                            {placeTwoDetails?.formatted_address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {placeTwoDetails?.name?.length > 15
                                ? placeTwoDetails?.name?.substring(0, 15) +
                                  "..."
                                : placeTwoDetails?.name}
                            </div>
                            <div className="flex gap-5 font-bold h-[14px]">
                              <Badge className="">
                                <Star className="w-[10px] mr-[5px]" />
                                {placeTwoDetails?.rating}/5
                              </Badge>
                            </div>
                          </div>
                          <div className="w-[250px]">
                            <p className="text-[10px] text-left">
                              {placeTwoDetails?.placeInfo}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                        <CardHeader className="p-0">
                          <img
                            alt=""
                            className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                            src={restaurant}
                            style={{ height: "150px", width: "100%" }}
                          />
                        </CardHeader>
                        <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                          <div>Dinner At</div>
                        </CardDescription>
                        <CardContent className="flex  flex-col p-2">
                          <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                            <MapPin className="w-[10px]" />
                            {foodPlan?.dinner?.location?.address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {foodPlan?.dinner?.title?.length > 15
                                ? foodPlan?.dinner?.title.substring(0, 15) +
                                  "..."
                                : foodPlan?.dinner?.title}
                            </div>
                            <div className="flex gap-5 font-bold h-[14px]">
                              <Badge className="">
                                <Star className="w-[10px] mr-[5px]" />
                                4/5
                              </Badge>
                            </div>
                          </div>
                          <div className="w-[250px]">
                            <p className="text-[10px] text-left">
                              {foodPlan?.dinner?.details}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="flex-1 pl-[3rem] pr-[3rem]">
              <Card>
                <CardHeader className="p-2 hidden">
                  <CardTitle>Your Itinerary</CardTitle>
                  <CardDescription className="hidden">
                    Here is your itinerary made with love by Gemini
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  {itineraryDetails && (
                    <div className="flex gap-2">
                      <Carousel
                        className="w-[32%] min-h-[316px] flex justify-between flex-col"
                        plugins={[
                          Autoplay({
                            delay: 2000,
                          }),
                        ]}
                      >
                        <CarouselContent>
                          <CarouselItem>
                            <div className="p-1">
                              <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                                <CardHeader className="p-0">
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={restaurant}
                                    style={{
                                      height: "150px",
                                      width: "100%",
                                    }}
                                  />
                                </CardHeader>
                                <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                                  <div>Breakfast At</div>
                                </CardDescription>
                                <CardContent className="flex  flex-col p-2">
                                  <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                    <MapPin className="w-[10px]" />
                                    {foodPlan?.breakfast?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {foodPlan?.breakfast?.title?.length > 15
                                        ? foodPlan?.breakfast?.title.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : foodPlan?.breakfast?.title}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        4/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-left">
                                      {foodPlan?.breakfast?.details}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                          <CarouselItem>
                            <div className="p-1">
                              <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                                <CardHeader className="p-0">
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={placeOneDetails?.photos[0]}
                                    style={{
                                      height: "150px",
                                      width: "100%",
                                    }}
                                  />
                                </CardHeader>
                                <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                                  <div>Visiting Next</div>
                                </CardDescription>
                                <CardContent className="flex  flex-col p-2">
                                  <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                    <MapPin className="w-[10px]" />
                                    {placeOneDetails?.formatted_address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {placeOneDetails?.name?.length > 15
                                        ? placeOneDetails?.name?.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : placeOneDetails?.name}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        {placeOneDetails?.rating}/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-left">
                                      {placeOneDetails?.placeInfo}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                          <CarouselItem>
                            <div className="p-1">
                              <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                                <CardHeader className="p-0">
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={restaurant}
                                    style={{
                                      height: "150px",
                                      width: "100%",
                                    }}
                                  />
                                </CardHeader>
                                <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                                  <div>Lunch At</div>
                                </CardDescription>
                                <CardContent className="flex  flex-col p-2">
                                  <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                    <MapPin className="w-[10px]" />
                                    {foodPlan?.lunch?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {foodPlan?.lunch?.title?.length > 15
                                        ? foodPlan?.lunch?.title.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : foodPlan?.lunch?.title}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        4/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-left">
                                      {foodPlan?.lunch?.details}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                          <CarouselItem>
                            <div className="p-1">
                              <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                                <CardHeader className="p-0">
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={placeTwoDetails?.photos[0]}
                                    style={{
                                      height: "150px",
                                      width: "100%",
                                    }}
                                  />
                                </CardHeader>
                                <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                                  <div>Visiting Next</div>
                                </CardDescription>
                                <CardContent className="flex  flex-col p-2">
                                  <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                    <MapPin className="w-[10px]" />
                                    {placeTwoDetails?.formatted_address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {placeTwoDetails?.name?.length > 15
                                        ? placeTwoDetails?.name?.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : placeTwoDetails?.name}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        {placeTwoDetails?.rating}/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-left">
                                      {placeTwoDetails?.placeInfo}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                          <CarouselItem>
                            <div className="p-1">
                              <Card className="overflow-hidden min-h-[316px] flex justify-start gap-2 flex-col">
                                <CardHeader className="p-0">
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={restaurant}
                                    style={{
                                      height: "150px",
                                      width: "100%",
                                    }}
                                  />
                                </CardHeader>
                                <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                                  <div>Dinner At</div>
                                </CardDescription>
                                <CardContent className="flex  flex-col p-2">
                                  <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                    <MapPin className="w-[10px]" />
                                    {foodPlan?.dinner?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {foodPlan?.dinner?.title?.length > 15
                                        ? foodPlan?.dinner?.title.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : foodPlan?.dinner?.title}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        4/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-left">
                                      {foodPlan?.dinner?.details}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        </CarouselContent>
                      </Carousel>
                      <div className="flex flex-col justify-between items-start gap-4">
                        <div className="text-left">
                          {itineraryDetails.responseOne}
                        </div>
                        <Button
                          className="mb-[5px]"
                          onClick={handleCreateItinerary}
                        >
                          Save Itinerary
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Itinerary;
