import { useState, useEffect, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  Triangle,
  TramFront,
  Plane,
  Car,
  Calendar as CalendarIcon,
  Turtle,
  Bird,
  Rabbit,
  MapPin,
  Star,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Calendar } from "../components/ui/calendar";
import { cn } from "../lib/utils";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../components/ui/pagination";
import { Separator } from "../components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Textarea } from "../components/ui/textarea";
import restaurant from "../components/images/restaurant.jpg";
import { Label } from "../components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/userApiSlice";
import {
  clearPlanner,
  setCurrentItineraryTab,
  setDisablePlaceTab,
  setGoogleMapInstance,
  setMapIsLoaded,
} from "../slices/plannerSlice";
import { logout } from "../slices/authSlice";
import { useToast } from "../components/ui/use-toast";
import { setupDestination } from "../slices/plannerSlice";
import {
  useAddItineraryMutation,
  useGetOneItineraryQuery,
} from "../slices/itineraryApiSlice";
import PlacesCard from "../components/assets/PlacesCard";
import FoodsCard from "../components/assets/FoodsCard";
import ItineraryCard from "../components/assets/ItineraryCard";
import JourneyCard from "../components/assets/JourneyCard";
import { setItinerary } from "../slices/itinerarySlice";

function Journey() {
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries,
  });
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    destinationDetails,
    placeToStayDetails,
    currentItineraryTab,
    disablePlaceTab,
    disableFoodTab,
    disableItineraryTab,
    foodPlan,
    itineraryReadyToBuild,
    itineraryResponseGemini,
  } = useSelector((state) => state.plannerDetails);
  const [map, setMap] = useState(/**@type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mode, setMode] = useState(null);
  const [date, setDate] = useState();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [enableConfirm, setEnableConfirm] = useState(false);
  const [showJourneyCards, setShowJourneyCards] = useState(false);
  const [itineraryLink, setItineraryLink] = useState(window.location.href);
  const { toast } = useToast();
  const itineraryLinkRef = useRef(window.location.href);
  const [updatedAddress, setUpdatedAddress] = useState("");
  const [foodTabDisable, setFoodTabDisable] = useState(
    placeOneDetails && placeTwoDetails ? false : true
  );
  // const [placeTabDisable, setPlaceTabDisable] = useState(
  //   destinationDetails?.destination ? false : true
  // );
  // const [placeTabState, setPlaceTabState] = useState(false);
  // const [tab, setTab] = useState("journey");

  const {
    data: itinerary,
    isLoading,
    isError,
  } = useGetOneItineraryQuery("6630ddc6d323aab6f557e2e2");

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

  //setup isloaded in globalState
  useEffect(() => {
    if (isLoaded) {
      dispatch(setMapIsLoaded(true));
      console.log("dispatched map-loaded");
    }
  }, [isLoaded, dispatch, map]);

  useEffect(() => {
    if (placeToStayDetails) {
      let result = placeToStayDetails.formatted_address.split(",");
      result.length = 1;
      result.push(destinationDetails.destination);
      setUpdatedAddress(result.join(", "));
    }
  }, [placeToStayDetails, destinationDetails]);

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
      setEnableConfirm(true);
      setShowJourneyCards(true);
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
    // setPlaceTabDisable(false);
    // dispatch(setDisablePlaceTab(false));
    // dispatch(setCurrentItineraryTab("place"));
    dispatch(setDisablePlaceTab(false));
    dispatch(setCurrentItineraryTab("place"));
    // onTabChange("places");
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
  };

  const onTabChange = (tabName) => {
    dispatch(setCurrentItineraryTab(tabName));
  };

  const [createItinerary, { isLoading: loadingCreateItinerary, error }] =
    useAddItineraryMutation();

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
          itineraryResponse: itineraryResponseGemini?.responseOne,
        },
      }).unwrap();
      console.log({ ...res }, "132");
      dispatch(setItinerary({ ...res }));
      // navigate(`/itineraryDetails/${res._id}`);
    } catch (error) {
      console.log(error);
      toast({
        title: error,
        variant: "destructive",
      });
    }
  };

  const logoutHandler = async (e) => {
    // e.preventDefault();
    await logoutApiCall().unwrap();
    dispatch(clearPlanner());
    dispatch(logout());
    toast({
      title: "Logout successful!",
    });
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Select
            onValueChange={(e) => {
              e === "Profile" ? navigate("/profile") : logoutHandler();
            }}
          >
            <SelectTrigger
              id="status"
              aria-label="Select status"
              className="w-[280px]"
            >
              <SelectValue placeholder={userInfo?.name || "User"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Profile">Profile</SelectItem>
              <SelectItem value="Logout">Logout</SelectItem>
            </SelectContent>
          </Select>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3 hide-sheet-svg">
            <Card x-chunk="dashboard-05-chunk-3" className="w-full h-[70vh]">
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
            </Card>
            <div className="grid gap-4 md:grid-col-span-4 lg:grid-col-span-4 xl:grid-col-span-4">
              <Card x-chunk="dashboard-05-chunk-0" className="hidden">
                <CardHeader className="pb-3 text-left">
                  <CardTitle className="mb-3">Setup Journey</CardTitle>
                  {destinationDetails?.destination ? (
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                      <div className="flex gap-4 justify-between">
                        <div className="font-bold text-[1rem]">Origin</div>
                        <div className="text-[1rem]">
                          {destinationDetails?.origin}
                        </div>
                      </div>
                      <div className="flex gap-4 justify-between">
                        <div className="font-bold text-[1rem]">Destination</div>
                        <div className="text-[1rem]">
                          {destinationDetails?.destination}
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex gap-4 justify-between">
                        <div className="font-bold text-[1rem]">
                          Travelling By
                        </div>
                        <div className="text-[1rem]">
                          {destinationDetails?.modeOfTravel}
                        </div>
                      </div>
                      <div className="flex gap-4 justify-between">
                        <div className="font-bold text-[1rem]">
                          Travelling On
                        </div>
                        <div className="text-[1rem]">
                          {destinationDetails?.travelDate}
                        </div>
                      </div>
                    </CardDescription>
                  ) : (
                    <>Skeleton</>
                  )}
                </CardHeader>
                <CardFooter></CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1" className="hidden">
                <CardHeader className="pb-3 text-left">
                  <CardTitle>Place of Stay</CardTitle>
                </CardHeader>
                {placeToStayDetails?.placeInfo ? (
                  <Card className="overflow-hidden">
                    <CardHeader className="p-0">
                      <img
                        alt=""
                        className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                        src={placeToStayDetails?.photos[0]}
                        style={{ height: "150px", width: "275px" }}
                      />
                    </CardHeader>
                    <CardContent className="flex  flex-col p-2">
                      <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                        <MapPin className="w-[10px]" />
                        {updatedAddress}
                      </div>
                      <div className="flex font-bold mb-3 justify-between items-center">
                        <div>
                          {placeToStayDetails?.name.length > 15
                            ? placeToStayDetails?.name.substring(0, 15) + "..."
                            : placeToStayDetails?.name}
                        </div>
                        <div className="flex gap-5 font-bold h-[14px]">
                          <Badge className="">
                            <Star className="w-[10px] mr-[5px]" />
                            {placeToStayDetails?.rating}/5
                          </Badge>
                        </div>
                      </div>
                      <div className="w-[250px]">
                        <p className="text-[10px] text-justify">
                          {placeToStayDetails?.placeInfo}
                        </p>
                      </div>
                      {/* <div className="flex gap-5 font-bold">
                <Badge>
                  <Star className="w-[10px]" />
                  {placeToStayDetails.rating}/5
                </Badge>
              </div> */}
                    </CardContent>
                    <CardFooter className="p-2 pt-0">
                      <Button className="w-full">Change</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <>Skeleton</>
                )}
              </Card>
              <Card x-chunk="dashboard-05-chunk-1" className="hidden">
                <CardHeader className="pb-3 text-left">
                  <CardTitle>First Place To Visit</CardTitle>
                </CardHeader>
                {placeOneDetails?.placeInfo ? (
                  <Card className="overflow-hidden">
                    <CardHeader className="p-0">
                      <img
                        alt=""
                        className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                        src={placeOneDetails?.photos[0]}
                        style={{ height: "150px", width: "275px" }}
                      />
                    </CardHeader>
                    <CardContent className="flex  flex-col p-2">
                      <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                        <MapPin className="w-[10px]" />
                        {updatedAddress}
                      </div>
                      <div className="flex font-bold mb-3 justify-between items-center">
                        <div>
                          {placeOneDetails?.name.length > 15
                            ? placeOneDetails?.name.substring(0, 15) + "..."
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
                        <p className="text-[10px] text-justify">
                          {placeOneDetails?.placeInfo}
                        </p>
                      </div>
                      {/* <div className="flex gap-5 font-bold">
                <Badge>
                  <Star className="w-[10px]" />
                  {placeToStayDetails.rating}/5
                </Badge>
              </div> */}
                    </CardContent>
                    <CardFooter className="p-2 pt-0">
                      <Button className="w-full">Change</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <>Skeleton</>
                )}
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="hidden">
                <CardHeader className="pb-3 text-left">
                  <CardTitle>Second Place To Visit</CardTitle>
                </CardHeader>
                {placeTwoDetails?.placeInfo ? (
                  <Card className="overflow-hidden">
                    <CardHeader className="p-0">
                      <img
                        alt=""
                        className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                        src={placeTwoDetails?.photos[0]}
                        style={{ height: "150px", width: "275px" }}
                      />
                    </CardHeader>
                    <CardContent className="flex  flex-col p-2">
                      <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                        <MapPin className="w-[10px]" />
                        {updatedAddress}
                      </div>
                      <div className="flex font-bold mb-3 justify-between items-center">
                        <div>
                          {placeTwoDetails?.name.length > 15
                            ? placeTwoDetails?.name.substring(0, 15) + "..."
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
                        <p className="text-[10px] text-justify">
                          {placeTwoDetails?.placeInfo}
                        </p>
                      </div>
                      {/* <div className="flex gap-5 font-bold">
                <Badge>
                  <Star className="w-[10px]" />
                  {placeToStayDetails.rating}/5
                </Badge>
              </div> */}
                    </CardContent>
                    <CardFooter className="p-2 pt-0">
                      <Button className="w-full">Change</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <>Skeleton</>
                )}
                {/* <CardFooter>
                  <Button>Create New Order</Button>
                </CardFooter> */}
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="hidden">
                <CardHeader className="pb-3 text-left">
                  <CardTitle>Eating Plans</CardTitle>
                </CardHeader>
                {foodPlan?.breakfast && foodPlan?.lunch && foodPlan?.dinner ? (
                  //     <Card className="overflow-hidden">
                  //       <CardHeader className="p-0">
                  //         <img
                  //           alt=""
                  //           className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                  //           src={placeTwoDetails?.photos[0]}
                  //           style={{ height: "150px", width: "275px" }}
                  //         />
                  //       </CardHeader>
                  //       <CardContent className="flex  flex-col p-2">
                  //         <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                  //           <MapPin className="w-[10px]" />
                  //           {updatedAddress}
                  //         </div>
                  //         <div className="flex font-bold mb-3 justify-between items-center">
                  //           <div>
                  //             {placeTwoDetails?.name.length > 15
                  //               ? placeTwoDetails?.name.substring(0, 15) + "..."
                  //               : placeTwoDetails?.name}
                  //           </div>
                  //           <div className="flex gap-5 font-bold h-[14px]">
                  //             <Badge className="">
                  //               <Star className="w-[10px] mr-[5px]" />
                  //               {placeTwoDetails?.rating}/5
                  //             </Badge>
                  //           </div>
                  //         </div>
                  //         <div className="w-[250px]">
                  //           <p className="text-[10px] text-justify">
                  //             {placeTwoDetails?.placeInfo}
                  //           </p>
                  //         </div>
                  //         {/* <div className="flex gap-5 font-bold">
                  //   <Badge>
                  //     <Star className="w-[10px]" />
                  //     {placeToStayDetails.rating}/5
                  //   </Badge>
                  // </div> */}
                  //       </CardContent>
                  //       <CardFooter className="p-2 pt-0">
                  //         <Button className="w-full">Change</Button>
                  //       </CardFooter>
                  //     </Card>
                  <Carousel
                    className="min-h-[316px] flex justify-between flex-col"
                    // plugins={[
                    //   Autoplay({
                    //     delay: 200000,
                    //   }),
                    // ]}
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
                  </Carousel>
                ) : (
                  <>Skeleton</>
                )}
              </Card>
              <Card
                x-chunk="dashboard-05-chunk-2"
                className="lg:grid-cols-4 xl:grid-cols-4 flex justify-center"
              >
                {itineraryReadyToBuild ? (
                  <Carousel
                    className="flex justify-center items-center flex-col w-[40%]"
                    plugins={[
                      Autoplay({
                        delay: 2000,
                      }),
                    ]}
                  >
                    <CarouselContent>
                      <CarouselItem className="flex justify-center">
                        <div className="p-1 w-[70%]">
                          <Card className="overflow-hidden flex justify-start gap-2">
                            <CardHeader className="p-0 block">
                              <img
                                alt=""
                                className="aspect-square w-full rounded rounded-[10px] object-cover"
                                src={restaurant}
                                style={{
                                  height: "200px",
                                  width: "100%",
                                }}
                              />
                            </CardHeader>
                            <CardContent className="flex  flex-col p-2 w-[60%]">
                              <div className="font-bold text-primary flex items-start p-2 pl-0">
                                Breakfast At
                              </div>
                              <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center">
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
                              <div>
                                <p className="text-left">
                                  {foodPlan?.breakfast?.details}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="flex justify-center">
                        <div className="p-1 w-[70%]">
                          <Card className="overflow-hidden flex justify-start gap-2">
                            <CardHeader className="p-0 block">
                              <img
                                alt=""
                                className="aspect-square w-full rounded rounded-[10px] object-cover"
                                src={placeOneDetails?.photos[0]}
                                style={{
                                  height: "200px",
                                  width: "100%",
                                }}
                              />
                            </CardHeader>
                            <CardContent className="flex  flex-col p-2 w-[60%]">
                              <div className="font-bold text-primary flex items-start p-2 pl-0">
                                Visiting Next
                              </div>
                              <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center">
                                <MapPin className="w-[10px]" />
                                {placeOneDetails?.formatted_address
                                  .split(",")
                                  .slice(0, 3)
                                  .join(", ")}
                              </div>
                              <div className="flex font-bold mb-3 justify-between items-center">
                                <div>
                                  {placeOneDetails?.name?.length > 15
                                    ? placeOneDetails?.name.substring(0, 15) +
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
                              <div>
                                <p className="text-left">
                                  {placeOneDetails?.placeInfo}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="flex justify-center">
                        <div className="p-1 w-[70%]">
                          <Card className="overflow-hidden flex justify-start gap-2">
                            <CardHeader className="p-0 block">
                              <img
                                alt=""
                                className="aspect-square w-full rounded rounded-[10px] object-cover"
                                src={restaurant}
                                style={{
                                  height: "200px",
                                  width: "100%",
                                }}
                              />
                            </CardHeader>
                            <CardContent className="flex  flex-col p-2 w-[60%]">
                              <div className="font-bold text-primary flex items-start p-2 pl-0">
                                Lunch At
                              </div>
                              <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center">
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
                              <div>
                                <p className="text-left">
                                  {foodPlan?.lunch?.details}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="flex justify-center">
                        <div className="p-1 w-[70%]">
                          <Card className="overflow-hidden flex justify-start gap-2">
                            <CardHeader className="p-0 block">
                              <img
                                alt=""
                                className="aspect-square w-full rounded rounded-[10px] object-cover"
                                src={placeTwoDetails?.photos[0]}
                                style={{
                                  height: "200px",
                                  width: "100%",
                                }}
                              />
                            </CardHeader>
                            <CardContent className="flex  flex-col p-2 w-[60%]">
                              <div className="font-bold text-primary flex items-start p-2 pl-0">
                                Visiting Next
                              </div>
                              <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center">
                                <MapPin className="w-[10px]" />
                                {placeTwoDetails?.formatted_address
                                  .split(",")
                                  .slice(0, 3)
                                  .join(", ")}
                              </div>
                              <div className="flex font-bold mb-3 justify-between items-center">
                                <div>
                                  {placeTwoDetails?.name?.length > 15
                                    ? placeTwoDetails?.name.substring(0, 15) +
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
                              <div>
                                <p className="text-left">
                                  {placeTwoDetails?.placeInfo}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="flex justify-center">
                        <div className="p-1 w-[70%]">
                          <Card className="overflow-hidden flex justify-start gap-2">
                            <CardHeader className="p-0 block">
                              <img
                                alt=""
                                className="aspect-square w-full rounded rounded-[10px] object-cover"
                                src={restaurant}
                                style={{
                                  height: "200px",
                                  width: "100%",
                                }}
                              />
                            </CardHeader>
                            <CardContent className="flex  flex-col p-2 w-[60%]">
                              <div className="font-bold text-primary flex items-start p-2 pl-0">
                                Dinner At
                              </div>
                              <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center">
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
                              <div>
                                <p className="text-left">
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
                ) : (
                  <div className="flex gap-8">
                    <div className="flex items-center space-x-4 h-[18vh]">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 h-[18vh]">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 h-[18vh]">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
          <div className="flex flex-col gap-[1.5rem]">
            <Tabs
              defaultValue="journey"
              className="w-full"
              value={currentItineraryTab}
              onValueChange={onTabChange}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="journey">Journey</TabsTrigger>
                <TabsTrigger value="place" disabled={disablePlaceTab}>
                  Places
                </TabsTrigger>
                <TabsTrigger value="food" disabled={disableFoodTab}>
                  Food
                </TabsTrigger>
                <TabsTrigger value="itinerary" disabled={disableItineraryTab}>
                  Itinerary
                </TabsTrigger>
              </TabsList>
              <TabsContent value="journey">
                {/* <JourneyCard /> */}
                <Card
                  className={`${
                    itineraryResponseGemini ? "h-[41vh] overflow-y-auto" : ""
                  }`}
                >
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
                      {destinationDetails.origin ? (
                        <Input
                          id="origin"
                          placeholder="Origin"
                          className="text-primary-foreground bg-primary pointer-events-none"
                          value={destinationDetails.origin}
                        />
                      ) : (
                        isLoaded && (
                          <Autocomplete>
                            <Input
                              id="origin"
                              placeholder="Origin"
                              ref={originRef}
                            />
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
                        isLoaded && (
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
              </TabsContent>
              <TabsContent value="place">
                <PlacesCard map={map} />
              </TabsContent>
              <TabsContent value="food">
                <FoodsCard />
              </TabsContent>
              <TabsContent value="itinerary">
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <ItineraryCard itinerary={itinerary} />
                )}
              </TabsContent>
            </Tabs>
            <div>
              {itineraryResponseGemini ? (
                <Card className="h-[44.5vh] relative">
                  <CardHeader className="flex flex-col items-start bg-muted/50 pt-3 pb-3 gap-[0.5rem] space-y-2">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Your Itinerary
                    </CardTitle>
                    <CardDescription>
                      Made with love powered by Gemini AI ❤️
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col justify-between items-start gap-8">
                      <div className="text-left">
                        {itineraryResponseGemini.responseOne}
                      </div>
                      <Button
                        className="mb-[5px] w-full absolute bottom-[10px] w-[90%]"
                        onClick={handleCreateItinerary}
                      >
                        Save Itinerary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center space-x-4 h-[18vh]">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[280px]" />
                    <Skeleton className="h-4 w-[280px]" />
                    <Skeleton className="h-4 w-[280px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Journey;
