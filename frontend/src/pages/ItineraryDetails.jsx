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
import { useEffect, useRef, useState } from "react";
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
import { useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import restaurant from "../components/images/restaurant.jpg";
import { useToast } from "../components/ui/use-toast";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  useGetOneItineraryQuery,
  useShortenItineraryLinkMutation,
} from "../slices/itineraryApiSlice";
import { useLocation, useParams } from "react-router-dom";

function ItineraryDetails() {
  const { id: itineraryId } = useParams();
  const [itineraryLink, setItineraryLink] = useState(window.location.href);
  const { toast } = useToast();
  const itineraryLinkRef = useRef(window.location.href);
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    foodPlanOptions,
    destinationDetails,
    foodPlan,
    itineraryReadyToBuild,
  } = useSelector((state) => state.plannerDetails);

  const {
    data: itinerary,
    isLoading,
    isError,
  } = useGetOneItineraryQuery(itineraryId);

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
            {isLoading ? (
              <>Loading...</>
            ) : (
              <Card className="overflow-hidden w-full">
                <CardHeader className="flex flex-row items-start bg-muted/50 pt-3 pb-3">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      {itinerary?.name?.length > 20
                        ? itinerary?.name?.substring(0, 20) + "..."
                        : itinerary?.name}
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
                      {itinerary.destinationDetails?.travelDate
                        ? itinerary.destinationDetails?.travelDate
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
                        <DropdownMenuItem>Share</DropdownMenuItem>
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
                        <span>{itinerary.destinationDetails?.origin}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Destination
                        </span>
                        <span>{itinerary.destinationDetails?.destination}</span>
                      </li>
                    </ul>
                    <Separator className="my-4" />
                    <ul className="grid gap-1">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Mode of Travel
                        </span>
                        <span>
                          {itinerary?.destinationDetails?.modeOfTravel &&
                            itinerary?.destinationDetails?.modeOfTravel
                              .charAt(0)
                              .toUpperCase() +
                              itinerary?.destinationDetails?.modeOfTravel.slice(
                                1
                              )}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Date of Travel
                        </span>
                        <span>{itinerary.destinationDetails?.travelDate}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Distance</span>
                        <span>
                          {itinerary.destinationDetails?.travelDistance}
                        </span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">
                          Arriving On
                        </span>
                        <span>{itinerary.destinationDetails?.travelDate}</span>
                      </li>
                    </ul>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">Visiting Plans</div>
                    <div className="flex gap-2 justify-between">
                      <div className="grid gap-1 text-left">
                        <div className="font-semibold">
                          {itinerary.placeOneDetails?.name?.length > 20
                            ? itinerary.placeOneDetails?.name?.substring(
                                0,
                                20
                              ) + "..."
                            : itinerary.placeOneDetails?.name}
                        </div>
                        <div className="grid gap-0.5 not-italic text-muted-foreground">
                          {itinerary.placeOneDetails?.formatted_address
                            .split(",")
                            .slice(0, 3)
                            .map((item, index) => (
                              <span key={index}>{item}</span>
                            ))}
                        </div>
                      </div>
                      <div className="grid auto-rows-max gap-1 text-right">
                        <div className="font-semibold">
                          {itinerary.placeTwoDetails?.name?.length > 20
                            ? itinerary.placeTwoDetails?.name?.substring(
                                0,
                                20
                              ) + "..."
                            : itinerary.placeTwoDetails?.name}
                        </div>
                        <div className="grid gap-0.5 not-italic text-muted-foreground">
                          {itinerary.placeTwoDetails?.formatted_address
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
                          {itinerary?.foodPlan?.breakfast?.title
                            ? itinerary?.foodPlan?.breakfast?.title
                            : "Skipped"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Lunch</dt>
                        <dd>
                          {itinerary?.foodPlan?.lunch?.title
                            ? itinerary?.foodPlan?.lunch?.title
                            : "Skipped"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Dinner</dt>
                        <dd>
                          {itinerary?.foodPlan?.dinner?.title
                            ? itinerary?.foodPlan?.dinner?.title
                            : "Skipped"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-1">
                    <div className="font-semibold">Share Itinerary</div>
                    {/* <dl className="grid gap-1">
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          Build Status
                        </dt>
                        <dd>
                          {itinerary?.itineraryReadyToBuild
                            ? "Confirmed Itinerary"
                            : "Not Confirmed"}
                        </dd>
                      </div>
                    </dl> */}
                    <div>
                      <Input
                        value={window.location.href}
                        ref={itineraryLinkRef}
                        className="pointer-events-none bg-primary text-primary-foreground"
                      />
                    </div>
                    <Button
                      onClick={(e) => handleCopyLinkToClipboard(e)}
                      variant="outline"
                    >
                      Share
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-2">
                  <div className="text-xs text-muted-foreground">
                    Updated {formatDate(itinerary?.updatedAt)}
                  </div>
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
                            {itinerary?.foodPlan?.breakfast?.location?.address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {itinerary?.foodPlan?.breakfast?.title?.length >
                              15
                                ? itinerary?.foodPlan?.breakfast?.title.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itinerary?.foodPlan?.breakfast?.title}
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
                              {itinerary?.foodPlan?.breakfast?.details}
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
                            src={itinerary?.placeOneDetails?.photos[0]}
                            style={{ height: "150px", width: "100%" }}
                          />
                        </CardHeader>
                        <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                          <div>Visiting Next</div>
                        </CardDescription>
                        <CardContent className="flex  flex-col p-2">
                          <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                            <MapPin className="w-[10px]" />
                            {itinerary?.placeOneDetails?.formatted_address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {itinerary?.placeOneDetails?.name?.length > 15
                                ? itinerary?.placeOneDetails?.name?.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itinerary?.placeOneDetails?.name}
                            </div>
                            <div className="flex gap-5 font-bold h-[14px]">
                              <Badge className="">
                                <Star className="w-[10px] mr-[5px]" />
                                {itinerary?.placeOneDetails?.rating}/5
                              </Badge>
                            </div>
                          </div>
                          <div className="w-[250px]">
                            <p className="text-[10px] text-left">
                              {itinerary?.placeOneDetails?.placeInfo}
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
                            {itinerary?.foodPlan?.lunch?.location?.address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {itinerary?.foodPlan?.lunch?.title?.length > 15
                                ? itinerary?.foodPlan?.lunch?.title.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itinerary?.foodPlan?.lunch?.title}
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
                              {itinerary?.foodPlan?.lunch?.details}
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
                            src={itinerary?.placeTwoDetails?.photos[0]}
                            style={{ height: "150px", width: "100%" }}
                          />
                        </CardHeader>
                        <CardDescription className="font-bold text-primary flex items-start p-2 pb-0">
                          <div>Visiting Next</div>
                        </CardDescription>
                        <CardContent className="flex  flex-col p-2">
                          <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                            <MapPin className="w-[10px]" />
                            {itinerary?.placeTwoDetails?.formatted_address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {itinerary?.placeTwoDetails?.name?.length > 15
                                ? itinerary?.placeTwoDetails?.name?.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itinerary?.placeTwoDetails?.name}
                            </div>
                            <div className="flex gap-5 font-bold h-[14px]">
                              <Badge className="">
                                <Star className="w-[10px] mr-[5px]" />
                                {itinerary?.placeTwoDetails?.rating}/5
                              </Badge>
                            </div>
                          </div>
                          <div className="w-[250px]">
                            <p className="text-[10px] text-left">
                              {itinerary?.placeTwoDetails?.placeInfo}
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
                            {itinerary?.foodPlan?.dinner?.location?.address
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                          </div>
                          <div className="flex font-bold mb-3 justify-between items-center">
                            <div>
                              {itinerary?.foodPlan?.dinner?.title?.length > 15
                                ? itinerary?.foodPlan?.dinner?.title.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itinerary?.foodPlan?.dinner?.title}
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
                              {itinerary?.foodPlan?.dinner?.details}
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
                  <CardTitle>Your Itinerary By Gemini</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  {itinerary && (
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
                                    {itinerary?.foodPlan?.breakfast?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {itinerary?.foodPlan?.breakfast?.title
                                        ?.length > 15
                                        ? itinerary?.foodPlan?.breakfast?.title.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : itinerary?.foodPlan?.breakfast?.title}
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
                                      {itinerary?.foodPlan?.breakfast?.details}
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
                                    src={itinerary?.placeOneDetails?.photos[0]}
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
                                    {itinerary?.placeOneDetails?.formatted_address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {itinerary?.placeOneDetails?.name
                                        ?.length > 15
                                        ? itinerary?.placeOneDetails?.name?.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : itinerary?.placeOneDetails?.name}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        {itinerary?.placeOneDetails?.rating}/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-left">
                                      {itinerary?.placeOneDetails?.placeInfo}
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
                                    {itinerary?.foodPlan?.lunch?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {itinerary?.foodPlan?.lunch?.title
                                        ?.length > 15
                                        ? itinerary?.foodPlan?.lunch?.title.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : itinerary?.foodPlan?.lunch?.title}
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
                                      {itinerary?.foodPlan?.lunch?.details}
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
                                    src={itinerary?.placeTwoDetails?.photos[0]}
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
                                    {itinerary?.placeTwoDetails?.formatted_address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {itinerary?.placeTwoDetails?.name
                                        ?.length > 15
                                        ? itinerary?.placeTwoDetails?.name?.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : itinerary?.placeTwoDetails?.name}
                                    </div>
                                    <div className="flex gap-5 font-bold h-[14px]">
                                      <Badge className="">
                                        <Star className="w-[10px] mr-[5px]" />
                                        {itinerary?.placeTwoDetails?.rating}/5
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-[250px]">
                                    <p className="text-[10px] text-left">
                                      {itinerary?.placeTwoDetails?.placeInfo}
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
                                    {itinerary?.foodPlan?.dinner?.location?.address
                                      .split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                  </div>
                                  <div className="flex font-bold mb-3 justify-between items-center">
                                    <div>
                                      {itinerary?.foodPlan?.dinner?.title
                                        ?.length > 15
                                        ? itinerary?.foodPlan?.dinner?.title.substring(
                                            0,
                                            15
                                          ) + "..."
                                        : itinerary?.foodPlan?.dinner?.title}
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
                                      {itinerary?.foodPlan?.dinner?.details}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        </CarouselContent>
                      </Carousel>
                      <div className="flex flex-col justify-start items-start gap-2 bg-[#f9f9fa] rounded rounded-[10px] p-2">
                        <div className="text-center self-center font-bold w-full">
                          Your Itinerary By Gemini with love
                        </div>
                        <Separator className="my-4" />
                        <div className="text-justify">
                          {itinerary?.itineraryResponse}
                        </div>
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

export default ItineraryDetails;
