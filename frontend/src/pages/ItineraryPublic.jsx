import { useState, useEffect, useRef } from "react";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import { Link, useNavigate } from "react-router-dom";
import {
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
  Clock,
  Eye,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import placeImg from "../components/images/placeImg.jpg";
import breakfastImg from "../components/images/breakfast.jpg";
import lunchImg from "../components/images/lunch.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import restaurant from "../components/images/restaurant.jpg";
import { Label } from "../components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/userApiSlice";
import { clearPlanner } from "../slices/plannerSlice";
import { logout } from "../slices/authSlice";
import { useToast } from "../components/ui/use-toast";
import {
  useAddItineraryMutation,
  useGetOneItineraryQuery,
} from "../slices/itineraryApiSlice";
import { useParams } from "react-router-dom";

function ItineraryPublic() {
  const { userInfo } = useSelector((state) => state.auth);
  const { id: itineraryId } = useParams();
  const { data: itineraryInfo, isLoading: isLoadingItinerary } =
    useGetOneItineraryQuery(itineraryId);
  const [logoutApiCall] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries,
  });
  const { placeOneDetails, placeTwoDetails } = useSelector(
    (state) => state.plannerDetails
  );
  const [map, setMap] = useState(/**@type google.maps.Map */ (null));
  const [currentLocation, setCurrentLocation] = useState(null);
  const { toast } = useToast();
  const itineraryLinkRef = useRef(window.location.href);
  //for places card
  const [mapZoom, setMapZoom] = useState(15);

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
    itineraryInfo && setMapZoom(13);
    console.log(itineraryInfo);
  }, [itineraryInfo, setMapZoom]);

  const clearSelection = () => {};

  const [createItinerary, { isLoading: loadingCreateItinerary, error }] =
    useAddItineraryMutation();

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
        <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
          <div className="grid auto-rows-max items-start gap-4 md:gap-4 lg:col-span-3 hide-sheet-svg">
            <Card x-chunk="dashboard-05-chunk-3" className="w-full h-[65vh]">
              {isLoaded && (
                <GoogleMap
                  center={itineraryInfo?.placeToStayDetails?.geometry}
                  zoom={mapZoom}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={(map) => setMap(map)}
                >
                  {itineraryInfo?.placeToStayDetails.geometry && (
                    <MarkerF
                      position={itineraryInfo?.placeToStayDetails.geometry}
                    />
                  )}

                  {itineraryInfo?.foodPlan?.breakfast?.location?.lat &&
                    itineraryInfo?.foodPlan?.breakfast?.location?.lng &&
                    itineraryInfo?.itineraryResponse && (
                      <MarkerF
                        position={{
                          lat: itineraryInfo?.foodPlan?.breakfast?.location
                            ?.lat,
                          lng: itineraryInfo?.foodPlan?.breakfast?.location
                            ?.lng,
                        }}
                      />
                    )}

                  {itineraryInfo?.placeOneDetails?.name && (
                    <MarkerF
                      position={itineraryInfo?.placeOneDetails?.geometry}
                    />
                  )}

                  {itineraryInfo?.foodPlan?.lunch?.location?.lat &&
                    itineraryInfo?.foodPlan?.lunch?.location?.lng &&
                    itineraryInfo?.itineraryResponse && (
                      <MarkerF
                        position={{
                          lat: itineraryInfo?.foodPlan?.lunch?.location?.lat,
                          lng: itineraryInfo?.foodPlan?.lunch?.location?.lng,
                        }}
                      />
                    )}

                  {itineraryInfo?.placeTwoDetails?.name &&
                    itineraryInfo.itineraryResponse && (
                      <MarkerF
                        position={itineraryInfo?.placeTwoDetails?.geometry}
                      />
                    )}

                  {itineraryInfo?.foodPlan?.dinner?.location?.lat &&
                    itineraryInfo?.foodPlan?.dinner?.location?.lng &&
                    itineraryInfo?.itineraryResponse && (
                      <MarkerF
                        position={{
                          lat: itineraryInfo?.foodPlan?.dinner?.location?.lat,
                          lng: itineraryInfo?.foodPlan?.dinner?.location?.lng,
                        }}
                      />
                    )}

                  {/* {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse} />
                  )} */}
                </GoogleMap>
              )}
            </Card>
            <div className="grid gap-4 md:grid-col-span-4 lg:grid-col-span-4 xl:grid-col-span-4">
              <Card
                x-chunk="dashboard-05-chunk-2"
                className="lg:grid-cols-4 xl:grid-cols-4 flex justify-center"
              >
                {itineraryInfo ? (
                  <div className="flex gap-2 p-1">
                    <Card className="relative overflow-hidden flex flex-col justify-start gap-2 h-full">
                      <CardHeader className="p-0 block">
                        <img
                          alt=""
                          className="aspect-square w-full rounded rounded-[10px] object-cover"
                          src={breakfastImg}
                          style={{
                            height: "175px",
                            width: "500px",
                          }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="absolute bottom-0 left-[10px] z-10 show-svg show-svg flex justify-center align-center w-[85%]">
                              {itineraryInfo?.foodPlan?.breakfast?.title
                                ?.length > 15
                                ? itineraryInfo?.foodPlan?.breakfast?.title.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itineraryInfo?.foodPlan?.breakfast?.title}
                              <Eye className="w-[14px] ml-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 h-60">
                            <div className="flex flex-col ">
                              <div className="font-bold text-primary flex items-start p-2 pl-0 text-[14px] pb-[8px]">
                                Breakfast At
                              </div>
                              <div className="flex flex-col font-bold mb-3 justify-start items-start mb-0">
                                <div className="flex items-center justify-between w-full">
                                  <div className="text-[12px]">
                                    {itineraryInfo?.foodPlan?.breakfast?.title
                                      ?.length > 15
                                      ? itineraryInfo?.foodPlan?.breakfast?.title.substring(
                                          0,
                                          15
                                        ) + "..."
                                      : itineraryInfo?.foodPlan?.breakfast
                                          ?.title}
                                  </div>
                                  <div className="flex gap-5 font-bold h-[14px]">
                                    <Badge className="">
                                      <Star className="w-[10px] mr-[5px]" />
                                      4/5
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {itineraryInfo?.foodPlan?.breakfast?.location?.address
                                    .split(",")
                                    .slice(0, 3)
                                    .join(", ")}
                                </div>
                              </div>
                              <div className="mt-[2rem]">
                                <div className="font-bold text-[12px] text-primary">
                                  Details
                                </div>
                                <p className="text-left text-[12px]">
                                  {itineraryInfo?.foodPlan?.breakfast?.details}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardHeader>
                    </Card>
                    <Card className="relative overflow-hidden flex flex-col justify-start gap-2 h-full">
                      <CardHeader className="p-0 block">
                        <img
                          alt=""
                          className="aspect-square w-full rounded rounded-[10px] object-cover"
                          src={
                            itineraryInfo?.placeOneDetails?.photos[0] ||
                            placeImg
                          }
                          style={{
                            height: "175px",
                            width: "500px",
                          }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="absolute bottom-0 left-[10px] z-10 show-svg show-svg flex justify-center align-center w-[85%]">
                              {itineraryInfo?.placeOneDetails?.name?.length > 15
                                ? itineraryInfo?.placeOneDetails?.name.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itineraryInfo?.placeOneDetails?.name}
                              <Eye className="w-[14px] ml-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 h-60">
                            <div className="flex flex-col ">
                              <div className="font-bold text-primary flex items-start p-2 pl-0 text-[14px] pb-[8px]">
                                Visiting Next
                              </div>
                              <div className="flex flex-col font-bold mb-3 justify-start items-start mb-0">
                                <div className="flex items-center justify-between w-full">
                                  <div className="text-[12px]">
                                    {itineraryInfo?.placeOneDetails?.name
                                      ?.length > 15
                                      ? itineraryInfo?.placeOneDetails?.name.substring(
                                          0,
                                          15
                                        ) + "..."
                                      : itineraryInfo?.placeOneDetails?.name}
                                  </div>
                                  <div className="flex gap-5 font-bold h-[14px]">
                                    <Badge className="">
                                      <Star className="w-[10px] mr-[5px]" />
                                      4/5
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {itineraryInfo?.placeOneDetails?.formatted_address
                                    .split(",")
                                    .slice(0, 3)
                                    .join(", ")}
                                </div>
                              </div>
                              <div className="mt-[2rem]">
                                <div className="font-bold text-[12px] text-primary">
                                  Details
                                </div>
                                <p className="text-left text-[12px]">
                                  {itineraryInfo?.placeOneDetails?.placeInfo}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardHeader>
                    </Card>
                    <Card className="relative overflow-hidden flex flex-col justify-start gap-2 h-full">
                      <CardHeader className="p-0 block">
                        <img
                          alt=""
                          className="aspect-square w-full rounded rounded-[10px] object-cover"
                          src={lunchImg}
                          style={{
                            height: "175px",
                            width: "500px",
                          }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="absolute bottom-0 left-[10px] z-10 show-svg show-svg flex justify-center align-center w-[85%]">
                              {itineraryInfo?.foodPlan?.lunch?.title?.length >
                              15
                                ? itineraryInfo?.foodPlan?.lunch?.title.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itineraryInfo?.foodPlan?.lunch?.title}
                              <Eye className="w-[14px] ml-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 h-60">
                            <div className="flex flex-col ">
                              <div className="font-bold text-primary flex items-start p-2 pl-0 text-[14px] pb-[8px]">
                                Lunch At
                              </div>
                              <div className="flex flex-col font-bold mb-3 justify-start items-start mb-0">
                                <div className="flex items-center justify-between w-full">
                                  <div className="text-[12px]">
                                    {itineraryInfo?.foodPlan?.lunch?.title
                                      ?.length > 15
                                      ? itineraryInfo?.foodPlan?.lunch?.title.substring(
                                          0,
                                          15
                                        ) + "..."
                                      : itineraryInfo?.foodPlan?.lunch?.title}
                                  </div>
                                  <div className="flex gap-5 font-bold h-[14px]">
                                    <Badge className="">
                                      <Star className="w-[10px] mr-[5px]" />
                                      4/5
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {itineraryInfo?.foodPlan?.lunch?.location?.address
                                    .split(",")
                                    .slice(0, 3)
                                    .join(", ")}
                                </div>
                              </div>
                              <div className="mt-[2rem]">
                                <div className="font-bold text-[12px] text-primary">
                                  Details
                                </div>
                                <p className="text-left text-[12px]">
                                  {itineraryInfo?.foodPlan?.lunch?.details}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardHeader>
                    </Card>
                    <Card className="relative overflow-hidden flex flex-col justify-start gap-2 h-full">
                      <CardHeader className="p-0 block">
                        <img
                          alt=""
                          className="aspect-square w-full rounded rounded-[10px] object-cover"
                          src={
                            itineraryInfo?.placeTwoDetails?.photos[0] ||
                            placeImg
                          }
                          style={{
                            height: "175px",
                            width: "500px",
                          }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="absolute bottom-0 left-[10px] z-10 show-svg show-svg flex justify-center align-center w-[85%]">
                              {itineraryInfo?.placeTwoDetails?.name?.length > 15
                                ? itineraryInfo?.placeTwoDetails?.name.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itineraryInfo?.placeTwoDetails?.name}
                              <Eye className="w-[14px] ml-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 h-60">
                            <div className="flex flex-col ">
                              <div className="font-bold text-primary flex items-start p-2 pl-0 text-[14px] pb-[8px]">
                                Visiting Next
                              </div>
                              <div className="flex flex-col font-bold mb-3 justify-start items-start mb-0">
                                <div className="flex items-center justify-between w-full">
                                  <div className="text-[12px]">
                                    {itineraryInfo?.placeTwoDetails?.name
                                      ?.length > 15
                                      ? itineraryInfo?.placeTwoDetails?.name.substring(
                                          0,
                                          15
                                        ) + "..."
                                      : itineraryInfo?.placeTwoDetails?.name}
                                  </div>
                                  <div className="flex gap-5 font-bold h-[14px]">
                                    <Badge className="">
                                      <Star className="w-[10px] mr-[5px]" />
                                      {itineraryInfo?.placeTwoDetails?.rating}/5
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {itineraryInfo?.placeTwoDetails?.formatted_address
                                    .split(",")
                                    .slice(0, 3)
                                    .join(", ")}
                                </div>
                              </div>
                              <div className="mt-[2rem]">
                                <div className="font-bold text-[12px] text-primary">
                                  Details
                                </div>
                                <p className="text-left text-[12px]">
                                  {itineraryInfo?.placeTwoDetails?.placeInfo}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardHeader>
                    </Card>
                    <Card className="relative overflow-hidden flex flex-col justify-start gap-2 h-full">
                      <CardHeader className="p-0 block">
                        <img
                          alt=""
                          className="aspect-square w-full rounded rounded-[10px] object-cover"
                          src={restaurant}
                          style={{
                            height: "175px",
                            width: "500px",
                          }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="absolute bottom-0 left-[10px] z-10 show-svg show-svg flex justify-center align-center w-[85%]">
                              {itineraryInfo?.foodPlan?.dinner?.title?.length >
                              15
                                ? itineraryInfo?.foodPlan?.dinner?.title.substring(
                                    0,
                                    15
                                  ) + "..."
                                : itineraryInfo?.foodPlan?.dinner?.title}
                              <Eye className="w-[14px] ml-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-60 h-60">
                            <div className="flex flex-col ">
                              <div className="font-bold text-primary flex items-start p-2 pl-0 text-[14px] pb-[8px]">
                                Dinner At
                              </div>
                              <div className="flex flex-col font-bold mb-3 justify-start items-start mb-0">
                                <div className="flex items-center justify-between w-full">
                                  <div className="text-[12px]">
                                    {itineraryInfo?.foodPlan?.dinner?.title
                                      ?.length > 15
                                      ? itineraryInfo?.foodPlan?.dinner?.title.substring(
                                          0,
                                          15
                                        ) + "..."
                                      : itineraryInfo?.foodPlan?.dinner?.title}
                                  </div>
                                  <div className="flex gap-5 font-bold h-[14px]">
                                    <Badge className="">
                                      <Star className="w-[10px] mr-[5px]" />
                                      4/5
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {itineraryInfo?.foodPlan?.dinner?.location?.address
                                    .split(",")
                                    .slice(0, 3)
                                    .join(", ")}
                                </div>
                              </div>
                              <div className="mt-[2rem]">
                                <div className="font-bold text-[12px] text-primary">
                                  Details
                                </div>
                                <p className="text-left text-[12px]">
                                  {itineraryInfo?.foodPlan?.dinner?.details}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </CardHeader>
                    </Card>
                  </div>
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
            <Card
              className={`overflow-hidden w-full ${
                itineraryInfo?.itineraryResponse
                  ? "h-[45vh] overflow-y-auto"
                  : ""
              }`}
            >
              <CardHeader className="flex flex-col items-start bg-muted/50 pt-2 pb-4 gap-2 space-y-2">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  {itineraryInfo?.name}
                </CardTitle>
                <CardDescription className="text-left">
                  Your itinerary made by Gemini AI 💞
                </CardDescription>
              </CardHeader>
              <Separator className="my-4 mt-0" />
              <CardContent className="p-6 text-sm pt-2 pb-2">
                <div className="grid gap-1">
                  <div className="font-semibold text-[12px]">
                    Destination Details
                  </div>
                  <ul className="grid gap-1 text-[12px]">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Origin</span>
                      {itineraryInfo?.itineraryRouteDetails?.origin ? (
                        <span>
                          {itineraryInfo?.itineraryRouteDetails?.origin}
                        </span>
                      ) : (
                        <Skeleton className="h-4 w-[100px]" />
                      )}
                    </li>
                  </ul>
                  <Separator className="my-4 h-[0.5px]" />
                  <ul className="grid gap-1 text-[12px]">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Distance</span>
                      {itineraryInfo?.itineraryRouteDetails?.distance ? (
                        <span>
                          {itineraryInfo?.itineraryRouteDetails?.distance}
                        </span>
                      ) : (
                        <Skeleton className="h-4 w-[100px]" />
                      )}
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-[12px]">
                    Visiting Plans
                  </div>
                  <div className="flex gap-2 justify-between">
                    <div className="grid gap-1 text-left">
                      <div className="font-semibold text-[12px]">
                        {itineraryInfo?.placeOneDetails?.name?.length > 20
                          ? itineraryInfo?.placeOneDetails?.name?.substring(
                              0,
                              20
                            ) + "..."
                          : itineraryInfo?.placeOneDetails?.name}
                      </div>
                      <div className="grid gap-0.5 not-italic text-muted-foreground text-[12px]">
                        {itineraryInfo?.placeOneDetails?.formatted_address
                          .split(",")
                          .slice(0, 3)
                          .map((item, index) => (
                            <span key={index}>{item}</span>
                          ))}
                      </div>
                    </div>
                    <div className="grid auto-rows-max gap-1 text-right text-[12px]">
                      <div className="font-semibold text-[12px]">
                        {itineraryInfo?.placeTwoDetails?.name?.length > 20
                          ? itineraryInfo?.placeTwoDetails?.name?.substring(
                              0,
                              20
                            ) + "..."
                          : itineraryInfo?.placeTwoDetails?.name}
                      </div>
                      <div className="grid gap-0.5 not-italic text-muted-foreground text-[12px]">
                        {itineraryInfo?.placeTwoDetails?.formatted_address
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
                      <dt className="text-muted-foreground text-[12px]">
                        Breakfast
                      </dt>
                      <dd className="text-[12px]">
                        {itineraryInfo?.foodPlan?.breakfast?.title
                          ? itineraryInfo?.foodPlan?.breakfast?.title
                          : "Skipped"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <dt className="text-muted-foreground">Lunch</dt>
                      <dd>
                        {itineraryInfo?.foodPlan?.lunch?.title
                          ? itineraryInfo?.foodPlan?.lunch?.title
                          : "Skipped"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <dt className="text-muted-foreground">Dinner</dt>
                      <dd>
                        {itineraryInfo?.foodPlan?.dinner?.title
                          ? itineraryInfo?.foodPlan?.dinner?.title
                          : "Skipped"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
            <div>
              {itineraryInfo?.itineraryResponse ? (
                <Card className="h-[40vh] relative flex flex-col justify-between">
                  <CardHeader className="flex flex-col items-start bg-muted/50 pt-3 pb-3 gap-[0.5rem] space-y-2">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Your Itinerary
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Made with love powered by Gemini AI 💞
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 max-h-[10rem] overflow-y-auto">
                    <div className="flex flex-col justify-between items-start gap-8">
                      <p className="text-left text-[12px]">
                        {itineraryInfo?.itineraryResponse}
                      </p>
                    </div>
                  </CardContent>
                  <div className="p-6">
                    <Dialog className="p-6">
                      <DialogTrigger asChild>
                        <Button className="w-full text-[12px]">
                          Share Itinerary
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Share link</DialogTitle>
                          <DialogDescription>
                            Anyone who has this link will be able to view this.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                              Link
                            </Label>
                            <Input
                              id="link"
                              defaultValue={window.location.href}
                              ref={itineraryLinkRef}
                              readOnly
                            />
                          </div>
                          <DialogClose asChild>
                            <Button
                              type="button"
                              size="sm"
                              className="px-3"
                              onClick={(e) => handleCopyLinkToClipboard(e)}
                            >
                              <span className="sr-only">Copy</span>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </DialogClose>
                        </div>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
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

export default ItineraryPublic;
