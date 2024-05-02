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
import { MAP_URL } from "../../constants";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
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
import {
  setItineraryResponseGemini,
  setStaticMapUrl,
} from "../../slices/plannerSlice";

const ItineraryCard = ({ showItineraryCard }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    itineraryRouteDetails,
  } = useSelector((state) => state.plannerDetails);

  const { toast } = useToast();
  const [shrinkCard, setShrinkCard] = useState(false);
  const [loadingBuild, setLoadingBuild] = useState(false);

  const handleMessage = async (e) => {
    // e.preventDefault();
    setShrinkCard(true);
    showItineraryCard();
    setLoadingBuild(true);
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
      console.log(JSON.parse(expectedJSON[0]));
      if (expectedJSON) {
        setItineraryDetails(JSON.parse(expectedJSON[0]));
        dispatch(setItineraryResponseGemini(JSON.parse(expectedJSON[0])));
        setLoadingBuild(false);
      } else {
        setLoadingBuild(false);
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
      setLoadingBuild(false);
    }
  };
  return (
    <div>
      <Card
        className={`overflow-hidden w-full ${
          shrinkCard || itineraryResponseGemini
            ? "h-[41vh] overflow-y-auto"
            : ""
        }`}
      >
        <CardHeader className="flex flex-col items-start bg-muted/50 pt-2 pb-4 gap-2 space-y-2">
          <CardTitle className="group flex items-center text-lg">
            Itinerary
          </CardTitle>
          <CardDescription className="text-left">
            Your itinerary suggested by Gemini AI 💞
          </CardDescription>
        </CardHeader>
        <Separator className="my-4 mt-0" />
        <CardContent className="p-6 text-sm pt-2 pb-2">
          <div className="grid gap-1">
            <div className="font-semibold text-[12px]">Destination Details</div>
            <ul
              className={`grid gap-1 text-[12px] ${
                itineraryRouteDetails?.destination ? "" : "pt-[5px]"
              }`}
            >
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Origin</span>
                {itineraryRouteDetails?.origin ? (
                  <span>{itineraryRouteDetails?.origin}</span>
                ) : (
                  <span>{placeToStayDetails?.name}</span>
                )}
              </li>
              <li
                className={`flex items-center justify-between ${
                  itineraryRouteDetails?.destination ? "" : "hidden"
                }`}
              >
                <span className="text-muted-foreground">Destination</span>
                {itineraryRouteDetails?.destination ? (
                  <span>{itineraryRouteDetails?.destination}</span>
                ) : (
                  <Skeleton className="h-4 w-[100px]" />
                )}
              </li>
            </ul>
            <Separator className="my-4" />
            {/* <ul
              className={`grid gap-1 text-[12px] ${
                itineraryRouteDetails ? "" : "hidden"
              }`}
            >
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Mode of Travel</span>
                {itineraryRouteDetails?.mode ? (
                  <span>
                    {itineraryRouteDetails?.mode &&
                      itineraryRouteDetails?.mode.charAt(0).toUpperCase() +
                        itineraryRouteDetails?.mode.slice(1)}
                  </span>
                ) : (
                  <Skeleton className="h-4 w-[100px]" />
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Distance</span>
                {itineraryRouteDetails?.distance ? (
                  <span>{itineraryRouteDetails?.distance}</span>
                ) : (
                  <Skeleton className="h-4 w-[100px]" />
                )}
              </li>
            </ul> */}
          </div>
          {/* <Separator
            className={`my-4 ${itineraryRouteDetails ? "" : "hidden"}`}
          /> */}
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-[12px]">Visiting Plans</div>
            <div className="flex gap-2 justify-between">
              <div className="grid gap-1 text-left">
                <div className="font-semibold text-[12px]">
                  {placeOneDetails?.name?.length > 20
                    ? placeOneDetails?.name?.substring(0, 20) + "..."
                    : placeOneDetails?.name}
                </div>
                <div className="grid gap-0.5 not-italic text-muted-foreground text-[12px]">
                  {placeOneDetails?.formatted_address
                    .split(",")
                    .slice(0, 3)
                    .map((item, index) => (
                      <span key={index}>{item}</span>
                    ))}
                </div>
              </div>
              <div className="grid auto-rows-max gap-1 text-right text-[12px]">
                <div className="font-semibold text-[12px]">
                  {placeTwoDetails?.name?.length > 20
                    ? placeTwoDetails?.name?.substring(0, 20) + "..."
                    : placeTwoDetails?.name}
                </div>
                <div className="grid gap-0.5 not-italic text-muted-foreground text-[12px]">
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
            <div className="font-semibold text-[12px]">Food Plans</div>
            <dl className="grid gap-1">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground text-[12px]">Breakfast</dt>
                <dd className="text-[12px]">
                  {foodPlan?.breakfast?.title
                    ? foodPlan?.breakfast?.title
                    : "Skipped"}
                </dd>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <dt className="text-muted-foreground">Lunch</dt>
                <dd>
                  {foodPlan?.lunch?.title ? foodPlan?.lunch?.title : "Skipped"}
                </dd>
              </div>
              <div className="flex items-center justify-between text-[12px]">
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
            <div className="font-semibold text-[12px]">Confirm Itinerary</div>
            <dl className="grid gap-1">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground text-[12px]">
                  <CreditCard className="h-4 w-4 " />
                  Build Status
                </dt>
                <dd className="text-[12px]">{itineraryReadyToBuild === "readyToBuild" ? "Ready To Build" : itineraryReadyToBuild === "completed" ? "Completed" : "Build In Progress"}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <Separator
          className={`my-4 h-[0.5px] mt-[3rem] ${
            itineraryResponseGemini && "mt-[2rem]"
          }`}
        />
        <div className="p-4 pb-6">
          <Button onClick={handleMessage} className="w-full text-[12px]">
            {itineraryResponseGemini ? "Build Again" : "Build"}
          </Button>
        </div>
      </Card>
      {/* <Card
        className={`flex items-center space-x-4 h-[40vh] w-[21.7vw] bottom-[22px] absolute z-10 p-6 ${
          loadingBuild ? "" : "hidden"
        }`}
      >
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[280px]" />
          <Skeleton className="h-4 w-[280px]" />
          <Skeleton className="h-4 w-[280px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </Card> */}
    </div>
  );
};

export default ItineraryCard;
