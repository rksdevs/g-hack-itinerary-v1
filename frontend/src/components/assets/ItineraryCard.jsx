import React from "react";
import { useToast } from "../ui/use-toast";
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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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
import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import restaurant from "../images/restaurant.jpg";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAddItineraryMutation } from "../../slices/itineraryApiSlice";
import { setItinerary } from "../../slices/itinerarySlice";
import { useNavigate } from "react-router-dom";
import { setItineraryResponseGemini } from "../../slices/plannerSlice";

const ItineraryCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Your message");
  const [reply, setReply] = useState("Awaiting Response...");
  const [topTenList, setTopTenList] = useState([]);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
    itineraryResponseGemini,
  } = useSelector((state) => state.plannerDetails);
  const { toast } = useToast();
  const itineraryLinkRef = useRef(window.location.href);

  const formatDate = (updateDate) => {
    const dateString = updateDate;
    const date = new Date(dateString);

    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const handleCopyLinkToClipboard = async (e) => {
    e.preventDefault();
    itineraryLinkRef.current.select();
    document.execCommand("copy");
    toast({
      title: "Link copied to clipboard!",
      variant: "primary",
    });
  };

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
      
      Your response should have nothing else but only one javascript JSON object, this should have a key named as "responseOne" a paragraph, and utilize these info, and make the itinerary, also note that you need to consider the timings provided, a general rule will be start the day from breakfast and proceed, this should be around 250 words but not more than 250 words.

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
      dispatch(setItineraryResponseGemini(JSON.parse(expectedJSON[0])));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("reply - ", reply);
  }, [reply]);
  return (
    <div>
      <Card
        className={`overflow-hidden w-full ${
          itineraryResponseGemini ? "h-[41vh] overflow-y-auto" : ""
        }`}
      >
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
                <Button size="icon" variant="outline" className="h-8 w-8">
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
                <span className="text-muted-foreground">Destination</span>
                <span>{destinationDetails?.destination}</span>
              </li>
            </ul>
            <Separator className="my-4" />
            <ul className="grid gap-1">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Mode of Travel</span>
                <span>
                  {destinationDetails?.modeOfTravel &&
                    destinationDetails?.modeOfTravel.charAt(0).toUpperCase() +
                      destinationDetails?.modeOfTravel.slice(1)}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Date of Travel</span>
                <span>{destinationDetails?.travelDate}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Distance</span>
                <span>{destinationDetails?.travelDistance}</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Arriving On</span>
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
                  {foodPlan?.lunch?.title ? foodPlan?.lunch?.title : "Skipped"}
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
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ItineraryCard;
