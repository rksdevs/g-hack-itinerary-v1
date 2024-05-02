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
  Clock,
  Eye,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import Autoplay from "embla-carousel-autoplay";
import lunchImg from "../components/images/lunch.jpg";
import breakfastImg from "../components/images/breakfast.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Calendar } from "../components/ui/calendar";
import { cn } from "../lib/utils";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import stayMarker from "../components/images/StayMarker.jpg";
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
  addPlaceOneOptions,
  addPlaceTwoOptions,
  addPlaceOne,
  addPlaceTwo,
  addPlaceOneTiming,
  addPlaceTwoTiming,
  setDisableFoodTab,
  setItineraryRouteDetails,
  setStaticMapUrl,
} from "../slices/plannerSlice";
import { logout } from "../slices/authSlice";
import { useToast } from "../components/ui/use-toast";
import { setupDestination, addPlaceToStay } from "../slices/plannerSlice";
import {
  useAddItineraryMutation,
  useGetOneItineraryQuery,
} from "../slices/itineraryApiSlice";
import PlacesCard from "../components/assets/PlacesCard";
import FoodsCard from "../components/assets/FoodsCard";
import ItineraryCard from "../components/assets/ItineraryCard";
import JourneyCard from "../components/assets/JourneyCard";
import { setItinerary } from "../slices/itinerarySlice";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MAP_URL } from "../constants";
import placeImg from "../components/images/placeImg.jpg";

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
  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });
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
    mapIsLoaded,
    itineraryRouteDetails,
    staticMapUrl,
    foodPlanOptions,
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
  const [showItineraryCard, setShowItineraryCard] = useState(false);
  const [itineraryLink, setItineraryLink] = useState(window.location.href);
  const { toast } = useToast();
  const itineraryLinkRef = useRef(window.location.href);
  const [updatedAddress, setUpdatedAddress] = useState("");
  const [foodTabDisable, setFoodTabDisable] = useState(
    placeOneDetails && placeTwoDetails ? false : true
  );
  const [mapStaticImage, setMapStaticImage] = useState(null);

  const [markerType, setMarkerType] = useState("");
  const [itineraryName, setItineraryName] = useState("Itinerary");
  const [promptFormatError, setPromptFormatError] = useState(false);

  //for places card
  const placeOfStay = useRef();
  const [currentPlaceOfStay, setCurrentPlaceOfStay] = useState(null);
  const [openPlaceDialog, setOpenPlaceDialog] = useState(false);
  const [openSecondPlaceDialog, setOpenSecondPlaceDialog] = useState(false);
  const [mapZoom, setMapZoom] = useState(15);
  const [customizedAddressDestination, setCustomizedAddressDestination] =
    useState(null);

  const [mapLink, setMapLink] = useState(null);

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

  //show itinerary card
  const showCard = () => {
    setShowItineraryCard(true);
  };

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
    dispatch(setDisableFoodTab(false));
    dispatch(setCurrentItineraryTab("food"));
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
        name: itineraryName,
        itineraryDetails: {
          placeOneDetails,
          placeTwoDetails,
          placeToStayDetails,
          itineraryReadyToBuild,
          foodPlan,
          destinationDetails,
          itineraryResponse: itineraryResponseGemini?.responseOne,
          itineraryRouteDetails,
          staticMapUrl,
        },
      }).unwrap();
      console.log({ ...res }, "132");
      dispatch(setItinerary({ ...res }));
      navigate(`/itineraryPublic/${res._id}`);
    } catch (error) {
      console.log(error);
      toast({
        title: error,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (staticMapUrl) {
      console.log(staticMapUrl, "425---");
      // setMapLink(staticMapUrl);
    }
  }, [staticMapUrl]);

  //to setup current location of stay in the destination
  const handleSetupStay = async (e) => {
    e.preventDefault();
    try {
      if (placeOfStay.current.value !== "") {
        //eslint-disable-next-line no-undef
        const latlng = new google.maps.Geocoder();
        const resultsLatLang = await latlng.geocode({
          address: placeOfStay.current.value,
        });
        const placeId = resultsLatLang.results[0].place_id;
        const request = {
          placeId,
          fields: [
            "name",
            "formatted_address",
            "place_id",
            "geometry",
            "photos",
            "rating",
            "user_ratings_total",
            "address_components",
          ],
        };
        //eslint-disable-next-line no-undef
        const placesService = new google.maps.places.PlacesService(map);
        placesService.getDetails(request, function callback(results, status) {
          let photoArray = [];
          //eslint-disable-next-line no-undef
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results?.photos?.map((item) => photoArray.push(item.getUrl()));
            setCurrentPlaceOfStay({
              lat: results?.geometry?.location?.lat(),
              lng: results?.geometry?.location?.lng(),
            });
            map.panTo({
              lat: results?.geometry?.location?.lat(),
              lng: results?.geometry?.location?.lng(),
            });

            let locality;
            let state;
            let country;
            results?.address_components.forEach((component) => {
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              } else if (component.types.includes("country")) {
                country = component.long_name;
              } else if (component.types.includes("locality")) {
                locality = component.long_name;
              }
            });
            setCustomizedAddressDestination(
              `${locality}, ${state}, ${country}`
            );
            setItineraryName(`Itinerary-${state}`);
            dispatch(
              setupDestination({
                ...destinationDetails,
                destination: `${locality}, ${state}, ${country}`,
              })
            );
          }
          let placeData = {
            ...results,
            geometry: {
              lat: results?.geometry?.location?.lat(),
              lng: results?.geometry?.location?.lng(),
            },
            photos: photoArray,
          };
          generatePlaceToStayDetails(placeData);
        });
        setMapZoom(18);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error,
        variant: "destructive",
      });
    }
  };

  //to generate place of stay location details - as  place details are not available in getDetails method within Google places API
  const generatePlaceToStayDetails = async (placeData) => {
    try {
      const palceToStayPrompt = `Please share some good things about this place ${placeData?.name} in a single paragraph, with not more than 20 words`;
      const result = await model.generateContent(palceToStayPrompt);
      const response = result.response.text();
      dispatch(addPlaceToStay({ ...placeData, placeInfo: response }));
    } catch (error) {
      console.log(error);
      toast({
        title: error,
        variant: "destructive",
      });
    }
  };

  //to unwrapp the array of the promises returned by generateVisitPlaceDetails func above
  const processPlaceResultArray = async (e, placeType) => {
    if (e === "Religious") {
      setMarkerType("car");
    } else if (e === "Nature") {
      setMarkerType("car");
    } else if (e === "Shopping") {
      setMarkerType("bus");
    } else {
      setMarkerType("car");
    }

    if (placeType === "placeOne") {
      setOpenPlaceDialog(true);
      try {
        const myArr = await generatePlaceOptions(e);
        const promisesArr = myArr.map((item) =>
          generateVisitPlaceDetails(item)
        );
        const result = await Promise.all(promisesArr);
        dispatch(addPlaceOneOptions(result));
        console.log(result, "247");
      } catch (error) {
        console.log(error);
      }
    } else {
      setOpenSecondPlaceDialog(true);
      try {
        const myArr = await generatePlaceOptions(e);
        const promisesArr = myArr.map((item) =>
          generateVisitPlaceDetails(item)
        );
        const result = await Promise.all(promisesArr);
        dispatch(addPlaceTwoOptions(result));
        console.log(result, "247");
      } catch (error) {
        console.log(error);
        toast({
          title: error,
          variant: "destructive",
        });
      }
    }
  };

  //to generate top  3 places to visit options
  const generatePlaceOptions = async (e) => {
    setPromptFormatError(false);
    try {
      const placeOnePrompt = `top 3 ${e} places to visit in ${destinationDetails?.destination}, send the response as a Javascript JSON array of objects, each object is a place, each object has three properties first is a "title" property and its value is a string of the Name of the place, second is the "details" property and its value is a string of details about the place in not more than 20 words and third is "location" property which has the location information of the place, the value of location is an object with three properties first "address" which has the value of the full address of the place, second is "lng" which is the longitude coordinates of the place and third is "lat" which is the latitude coorinates of the place`;
      const result = await model.generateContent(placeOnePrompt);
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
      setPromptFormatError(true);
      console.log(error);
      toast({
        title: error,
        variant: "destructive",
      });
    }
  };

  //to generate the place details for every individual places suggested by gemini
  const generateVisitPlaceDetails = async (place) => {
    try {
      //eslint-disable-next-line no-undef
      const latlng = new google.maps.Geocoder();
      const resultsLatLang = await latlng.geocode({
        address: `${place.title}, ${place.location.address}`,
        // location: `${place.location.lat},${place.location.lng}`
      });
      const placeId = resultsLatLang.results[0].place_id;
      const request = {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "place_id",
          "geometry",
          "photos",
          "rating",
          "user_ratings_total",
        ],
      };
      //eslint-disable-next-line no-undef
      const placesService = new google.maps.places.PlacesService(map);

      // Wrapping the callback-based API in a promise
      const getDetailsPromise = () => {
        return new Promise((resolve, reject) => {
          placesService.getDetails(request, (results, status) => {
            //eslint-disable-next-line no-undef
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              let placeDetailsPhotoArray = results?.photos?.map((item) =>
                item.getUrl()
              );
              let returningPlaceDetails = {
                ...results,
                geometry: {
                  lat: results.geometry.location.lat(),
                  lng: results.geometry.location.lng(),
                },
                photos: placeDetailsPhotoArray,
                placeInfo: place.details,
              };
              resolve(returningPlaceDetails);
            } else {
              toast({
                title: "Place details not found!",
                variant: "destructive",
              });
              reject(new Error("Place details not found"));
            }
          });
        });
      };
      // Await the promise
      const returningPlaceDetails = await getDetailsPromise();
      return returningPlaceDetails;
    } catch (error) {
      console.log(error);
      toast({
        title: error,
        variant: "destructive",
      });
    }
  };

  const handlePlaceOneSelection = (item) => {
    map.panTo(item.geometry);
    map.setZoom(18);
    dispatch(addPlaceOne(item));
    setOpenPlaceDialog(false);
  };

  const handlePlaceTwoSelection = (item) => {
    map.panTo(item.geometry);
    map.setZoom(18);
    dispatch(addPlaceTwo(item));
    setOpenSecondPlaceDialog(false);
  };

  const logoutHandler = async () => {
    await logoutApiCall().unwrap();
    dispatch(clearPlanner());
    dispatch(logout());
    toast({
      title: "Logout successful!",
    });
    navigate("/login");
  };

  //Calculate route when itineraryResponse is valid
  useEffect(() => {
    const calculateRoute = async () => {
      let origin = `${placeToStayDetails?.name}, ${placeToStayDetails?.formatted_address}`;

      let waypoints = [
        {
          location: `${foodPlan?.breakfast?.title}, ${foodPlan?.breakfast?.location?.address}`,
          stopover: true,
        },
        {
          location: `${placeOneDetails?.name}, ${placeOneDetails?.formatted_address}`,
          stopover: true,
        },
        {
          location: `${foodPlan?.lunch?.title}, ${foodPlan?.lunch?.location?.address}`,
          stopover: true,
        },
        {
          location: `${placeOneDetails?.name}, ${placeOneDetails?.formatted_address}`,
          stopover: true,
        },
        {
          location: `${foodPlan?.dinner?.title}, ${foodPlan?.dinner?.location?.address}`,
          stopover: true,
        },
      ];
      console.log("triggered - route");
      try {
        if (
          !placeToStayDetails?.formatted_address &&
          !foodPlan?.breakfast?.location?.address &&
          !placeOneDetails?.formatted_address &&
          !foodPlan?.lunch?.location?.address &&
          !placeTwoDetails?.formatted_address &&
          !foodPlan?.dinner?.location?.address
        ) {
          toast({
            title: "Missing or incorrect data, can't create route",
            variant: "destructive",
          });
          return;
        }
        //eslint-disable-next-line no-undef
        const directionService = new google.maps.DirectionsService();
        const results = await directionService.route({
          origin: origin,
          destination: origin,
          waypoints: waypoints,
          optimizeWaypoints: false,
          //eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        });

        const routeDetails = {
          origin: placeToStayDetails?.name,
          destination: placeToStayDetails?.name,
          mode: "Car",
          distance: results.routes[0].legs[0].distance.text,
        };
        console.log(routeDetails, "---672");
        dispatch(setItineraryRouteDetails({ ...routeDetails }));
        setDirectionsResponse(results);
        setMapZoom(18);
      } catch (error) {
        console.log(error);
        toast({
          title: error,
          variant: "destructive",
        });
      }
    };

    if (
      placeOneDetails &&
      placeTwoDetails &&
      placeToStayDetails &&
      foodPlan?.breakfast &&
      foodPlan?.lunch &&
      foodPlan?.dinner &&
      itineraryResponseGemini
    ) {
      calculateRoute();
    }
  }, [
    placeOneDetails,
    placeTwoDetails,
    placeToStayDetails,
    foodPlan?.breakfast,
    foodPlan?.lunch,
    foodPlan?.dinner,
    itineraryResponseGemini,
    toast,
    dispatch,
  ]);

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
            <Card
              x-chunk="dashboard-05-chunk-3"
              className={`w-full ${
                itineraryResponseGemini || showItineraryCard
                  ? "h-[65vh]"
                  : "h-[88vh]"
              }`}
            >
              {isLoaded && (
                <GoogleMap
                  center={currentLocation}
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
                  {/* {currentLocation && <MarkerF position={currentLocation} />} */}
                  {placeToStayDetails && !itineraryResponseGemini && (
                    <MarkerF position={currentPlaceOfStay} />
                  )}
                  {placeOneDetails?.name && !itineraryResponseGemini && (
                    <MarkerF position={placeOneDetails?.geometry} />
                  )}
                  {placeTwoDetails?.name && !itineraryResponseGemini && (
                    <MarkerF position={placeTwoDetails?.geometry} />
                  )}
                  {foodPlan?.breakfast?.location?.lat &&
                    foodPlan?.breakfast?.location?.lng &&
                    !itineraryResponseGemini && (
                      <MarkerF
                        position={{
                          lat: foodPlan?.breakfast?.location?.lat,
                          lng: foodPlan?.breakfast?.location?.lng,
                        }}
                      />
                    )}

                  {foodPlan?.lunch?.location?.lat &&
                    foodPlan?.lunch?.location?.lng &&
                    !itineraryResponseGemini && (
                      <MarkerF
                        position={{
                          lat: foodPlan?.lunch?.location?.lat,
                          lng: foodPlan?.lunch?.location?.lng,
                        }}
                      />
                    )}

                  {foodPlan?.dinner?.location?.lat &&
                    foodPlan?.dinner?.location?.lng &&
                    !itineraryResponseGemini && (
                      <MarkerF
                        position={{
                          lat: foodPlan?.dinner?.location?.lat,
                          lng: foodPlan?.dinner?.location?.lng,
                        }}
                      />
                    )}

                  {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse} />
                  )}
                </GoogleMap>
              )}
            </Card>
            <div
              className={`grid gap-4 md:grid-col-span-4 lg:grid-col-span-4 xl:grid-col-span-4 ${
                itineraryResponseGemini || showItineraryCard ? "" : "hidden"
              }`}
            >
              <Card
                x-chunk="dashboard-05-chunk-2"
                className="lg:grid-cols-4 xl:grid-cols-4 flex justify-center"
              >
                {itineraryReadyToBuild ? (
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
                              {foodPlan?.breakfast?.title?.length > 15
                                ? foodPlan?.breakfast?.title.substring(0, 15) +
                                  "..."
                                : foodPlan?.breakfast?.title}
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
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {foodPlan?.breakfast?.location?.address
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
                                  {foodPlan?.breakfast?.details}
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
                          src={placeOneDetails?.photos[0] || placeImg}
                          style={{
                            height: "175px",
                            width: "500px",
                          }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="absolute bottom-0 left-[10px] z-10 show-svg show-svg flex justify-center align-center w-[85%]">
                              {placeOneDetails?.name?.length > 15
                                ? placeOneDetails?.name.substring(0, 15) + "..."
                                : placeOneDetails?.name}
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
                                    {placeOneDetails?.name?.length > 15
                                      ? placeOneDetails?.name.substring(0, 15) +
                                        "..."
                                      : placeOneDetails?.name}
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
                                  {placeOneDetails?.formatted_address
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
                                  {placeOneDetails?.placeInfo}
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
                              {foodPlan?.lunch?.title?.length > 15
                                ? foodPlan?.lunch?.title.substring(0, 15) +
                                  "..."
                                : foodPlan?.lunch?.title}
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
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {foodPlan?.lunch?.location?.address
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
                                  {foodPlan?.lunch?.details}
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
                          src={placeTwoDetails?.photos[0] || placeImg}
                          style={{
                            height: "175px",
                            width: "500px",
                          }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button className="absolute bottom-0 left-[10px] z-10 show-svg show-svg flex justify-center align-center w-[85%]">
                              {placeTwoDetails?.name?.length > 15
                                ? placeTwoDetails?.name.substring(0, 15) + "..."
                                : placeTwoDetails?.name}
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
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {placeTwoDetails?.formatted_address
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
                                  {placeTwoDetails?.placeInfo}
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
                              {foodPlan?.dinner?.title?.length > 15
                                ? foodPlan?.dinner?.title.substring(0, 15) +
                                  "..."
                                : foodPlan?.dinner?.title}
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
                                <div className="flex gap-1 font-bold text-muted-foreground text-[10px] items-center font-medium">
                                  <MapPin className="w-[10px]" />
                                  {foodPlan?.dinner?.location?.address
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
                                  {foodPlan?.dinner?.details}
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
            <Tabs
              defaultValue="place"
              className="w-full"
              value={currentItineraryTab}
              onValueChange={onTabChange}
            >
              <TabsList className="grid w-full grid-cols-3">
                {/* <TabsTrigger value="journey">Journey</TabsTrigger> */}
                <TabsTrigger value="place">Places</TabsTrigger>
                <TabsTrigger value="food" disabled={disableFoodTab}>
                  Food
                </TabsTrigger>
                <TabsTrigger value="itinerary" disabled={disableItineraryTab}>
                  Itinerary
                </TabsTrigger>
              </TabsList>
              <TabsContent value="place">
                <Card
                  className={`overflow-hidden w-full ${
                    itineraryResponseGemini || showItineraryCard
                      ? "h-[41vh] overflow-y-auto"
                      : ""
                  }`}
                >
                  <CardHeader className="flex flex-col items-start bg-muted/50 pt-2 pb-4 gap-2 space-y-2">
                    <CardTitle className="group flex items-center text-lg">
                      Places
                    </CardTitle>
                    <CardDescription className="text-left">
                      Select two places from various types of places suggested
                      by Gemini.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="my-4 mt-0" />
                  <CardContent className="space-y-2 p-0">
                    <div className="space-y-2 p-4 pt-0">
                      <Label htmlFor="origin" className="text-[12px]">
                        Place of Stay
                      </Label>
                      {placeToStayDetails?.name ? (
                        <Button className="h-[32px] justify-start w-full bg-primary text-primary-foreground pointer-events-none text-[12px]">
                          <MapPin className="w-[16px] mr-4" />
                          {placeToStayDetails?.name}
                        </Button>
                      ) : (
                        isLoaded && (
                          <div className="w-full flex flex-col justify-start gap-4">
                            <Autocomplete className="w-full">
                              <Input
                                className="h-[32px] text-[12px]"
                                id="placeOfStay"
                                placeholder={`Select place of stay`}
                                ref={placeOfStay}
                              />
                            </Autocomplete>
                            <Button
                              className="h-[32px] text-[12px]"
                              onClick={handleSetupStay}
                            >
                              Set
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                    <Separator className="my-4 w-full" />
                    <div className="space-y-2 p-4 pt-2">
                      <Label htmlFor="origin" className="text-[12px]">
                        First Place To Visit
                      </Label>
                      {placeOneDetails?.name ? (
                        <Button className="h-[32px] justify-start w-full bg-primary text-primary-foreground pointer-events-none text-[12px]">
                          <MapPin className="w-[14px] mr-4" />
                          {placeOneDetails?.name}
                        </Button>
                      ) : (
                        <>
                          <div>
                            <Select
                              className="h-[32px] flex items-center"
                              onValueChange={(e) =>
                                processPlaceResultArray(e, "placeOne")
                              }
                            >
                              <SelectTrigger
                                id="place-one"
                                className="items-start [&_[data-description]]:hidden h-[32px] flex items-center text-[12px]"
                              >
                                <SelectValue
                                  placeholder="Select a type of place you wish to visit"
                                  className="text-[12px]"
                                />
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                <SelectItem value="Religious">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Heritages{" "}
                                        <span className="font-medium text-foreground">
                                          Religion & Culture
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Nature">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Nature{" "}
                                        <span className="font-medium text-foreground">
                                          Attractions
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Shopping">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Lifestyle{" "}
                                        <span className="font-medium text-foreground">
                                          Shopping
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="popular">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Top Places{" "}
                                        <span className="font-medium text-foreground">
                                          Let the app decide
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      <div>
                        <Dialog
                          open={openPlaceDialog}
                          onOpenChange={setOpenPlaceDialog}
                        >
                          <DialogTrigger asChild className="hidden">
                            <Button variant="outline">Edit Profile</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[450px] justify-center">
                            {placeOneOptions.length > 1 &&
                            !promptFormatError ? (
                              <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                                <CarouselContent>
                                  {placeOneOptions?.map((placeItem, index) => (
                                    <CarouselItem key={index}>
                                      <div className="p-1">
                                        <Card className="overflow-hidden">
                                          <CardHeader className="p-0">
                                            {placeItem?.photos?.length > 1 ? (
                                              <img
                                                alt=""
                                                className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                                src={placeItem?.photos[0]}
                                                style={{
                                                  height: "200px",
                                                  width: "100%",
                                                }}
                                              />
                                            ) : (
                                              <img
                                                alt=""
                                                className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                                src={placeImg}
                                                style={{
                                                  height: "200px",
                                                  width: "100%",
                                                }}
                                              />
                                            )}
                                          </CardHeader>
                                          <CardContent className="flex  flex-col p-2">
                                            <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                              <MapPin className="w-[10px]" />
                                              {placeItem?.formatted_address
                                                .split(",")
                                                .slice(0, 3)
                                                .join(", ")}
                                            </div>
                                            <div className="flex font-bold mb-3 justify-between items-center">
                                              <div>
                                                {placeItem?.name?.length > 15
                                                  ? placeItem?.name.substring(
                                                      0,
                                                      15
                                                    ) + "..."
                                                  : placeItem?.name}
                                              </div>
                                              <div className="flex gap-5 font-bold h-[14px]">
                                                <Badge className="">
                                                  <Star className="w-[10px] mr-[5px]" />
                                                  {placeItem?.rating}/5
                                                </Badge>
                                              </div>
                                            </div>
                                            <div className="w-[250px]">
                                              <p className="text-[10px] text-justify">
                                                {placeItem?.placeInfo}
                                              </p>
                                            </div>
                                          </CardContent>
                                          <CardFooter className="p-2 pt-0">
                                            <Button
                                              className="w-full"
                                              onClick={() =>
                                                handlePlaceOneSelection(
                                                  placeItem
                                                )
                                              }
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
                            ) : !promptFormatError &&
                              placeOneOptions.length < 1 ? (
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
                            ) : (
                              <Dialog>
                                <DialogTrigger className="hidden" asChild>
                                  <Button variant="outline">
                                    Edit Profile
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Prompt Erro</DialogTitle>
                                    <DialogDescription>
                                      There was an error generating prompt or
                                      formatting the prompt, please try again.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button type="submit">Close</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="my-4">
                        <Label htmlFor="time-place-one" className="text-[12px]">
                          Time Schedule
                        </Label>
                      </div>
                      {placeOneDetails?.timings ? (
                        <Button className="h-[32px] justify-start w-full bg-primary text-primary-foreground pointer-events-none text-[12px]">
                          <Clock className="w-[16px] mr-4" />
                          {placeOneDetails?.timings}
                        </Button>
                      ) : (
                        <div>
                          <div className="grid gap-3">
                            <Select
                              className="h-[32px] text-[12px] flex items-center"
                              onValueChange={(e) =>
                                dispatch(addPlaceOneTiming(e))
                              }
                            >
                              <SelectTrigger
                                id="place-one-time"
                                className="items-start [&_[data-description]]:hidden h-[32px] text-[12px] flex items-center"
                              >
                                <SelectValue
                                  placeholder="Choose time"
                                  className="text-[12px]"
                                />
                              </SelectTrigger>
                              <SelectContent className="text-[12px]">
                                <SelectItem value="6 AM to 8 AM">
                                  <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                    <Clock className="w-[10px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Early Morning{" "}
                                        <span className="font-medium text-foreground">
                                          6 AM to 8 AM
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="9 AM to 12 PM">
                                  <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                    <Clock className="w-[10px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Morning{" "}
                                        <span className="font-medium text-foreground">
                                          9 AM to 12 PM
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="3 PM to 5 PM">
                                  <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                    <Clock className="w-[10px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Afternoon{" "}
                                        <span className="font-medium text-foreground">
                                          3 PM to 5 PM
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="7 PM to 9 PM">
                                  <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                    <Clock className="w-[10px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Evening{" "}
                                        <span className="font-medium text-foreground">
                                          7 PM to 9 PM
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                    <Separator className={`my-4`} />
                    <div className={`space-y-2 p-4`}>
                      <Label htmlFor="origin" className="text-[12px]">
                        Second Place To Visit
                      </Label>
                      {placeTwoDetails?.name ? (
                        <Button className="h-[32px] text-[12px] justify-start w-full bg-primary text-primary-foreground pointer-events-none">
                          <MapPin className="w-[16px] mr-4" />
                          {placeTwoDetails?.name}
                        </Button>
                      ) : (
                        <>
                          <div>
                            <Select
                              onValueChange={(e) =>
                                processPlaceResultArray(e, "placeTwo")
                              }
                              className="h-[32px] text-[12px] flex items-center"
                            >
                              <SelectTrigger
                                id="place-two"
                                className="items-start [&_[data-description]]:hidden h-[32px] flex items-center text-[12px]"
                              >
                                <SelectValue
                                  placeholder="Select a type of place you wish to visit"
                                  className="text-[12px]"
                                />
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                <SelectItem value="Religious">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Heritages{" "}
                                        <span className="font-medium text-foreground">
                                          Religion & Culture
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Nature">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Nature{" "}
                                        <span className="font-medium text-foreground">
                                          Attractions
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Shopping">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Lifestyle{" "}
                                        <span className="font-medium text-foreground">
                                          Shopping
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="popular">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-[12px]" />
                                    <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                      <p>
                                        Top Places{" "}
                                        <span className="font-medium text-foreground">
                                          Let the app decide
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      <div>
                        <div>
                          <Dialog
                            open={openSecondPlaceDialog}
                            onOpenChange={setOpenSecondPlaceDialog}
                          >
                            <DialogTrigger asChild className="hidden">
                              <Button variant="outline">
                                Second Place Recommendation
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px] justify-center">
                              {placeTwoOptions.length > 1 ? (
                                <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                                  <CarouselContent>
                                    {placeTwoOptions?.map(
                                      (placeItem, index) => (
                                        <CarouselItem key={index}>
                                          <div className="p-1">
                                            <Card className="overflow-hidden">
                                              <CardHeader className="p-0">
                                                {placeItem?.photos?.length >
                                                1 ? (
                                                  <img
                                                    alt=""
                                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                                    src={placeItem?.photos[0]}
                                                    style={{
                                                      height: "200px",
                                                      width: "100%",
                                                    }}
                                                  />
                                                ) : (
                                                  <img
                                                    alt=""
                                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                                    src={placeImg}
                                                    style={{
                                                      height: "200px",
                                                      width: "100%",
                                                    }}
                                                  />
                                                )}
                                              </CardHeader>
                                              <CardContent className="flex  flex-col p-2">
                                                <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                                                  <MapPin className="w-[10px]" />
                                                  {placeItem?.formatted_address
                                                    .split(",")
                                                    .slice(0, 3)
                                                    .join(", ")}
                                                </div>
                                                <div className="flex font-bold mb-3 justify-between items-center">
                                                  <div>
                                                    {placeItem?.name?.length >
                                                    15
                                                      ? placeItem?.name.substring(
                                                          0,
                                                          15
                                                        ) + "..."
                                                      : placeItem?.name}
                                                  </div>
                                                  <div className="flex gap-5 font-bold h-[14px]">
                                                    <Badge className="">
                                                      <Star className="w-[10px] mr-[5px]" />
                                                      {placeItem?.rating}/5
                                                    </Badge>
                                                  </div>
                                                </div>
                                                <div className="w-[250px]">
                                                  <p className="text-[10px] text-justify">
                                                    {placeItem?.placeInfo}
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
                                                <Button
                                                  className="w-full"
                                                  onClick={() =>
                                                    handlePlaceTwoSelection(
                                                      placeItem
                                                    )
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
                      <div className="my-4">
                        <Label htmlFor="origin" className="text-[12px]">
                          Time Schedule
                        </Label>
                      </div>
                      {placeTwoDetails?.timings ? (
                        <Button className="h-[32px] text-[12px] justify-start w-full bg-primary text-primary-foreground pointer-events-none">
                          <Clock className="w-[16px] mr-4" />
                          {placeTwoDetails?.timings}
                        </Button>
                      ) : (
                        <div className="grid gap-3">
                          <Select
                            onValueChange={(e) =>
                              dispatch(addPlaceTwoTiming(e))
                            }
                            className="h-[32px] flex items-center text-[12px]"
                          >
                            <SelectTrigger
                              id="place-two-time"
                              className="items-start text-[12px] [&_[data-description]]:hidden h-[32px] flex items-center"
                            >
                              <SelectValue placeholder="Choose Time" />
                            </SelectTrigger>
                            <SelectContent className="text-[12px]">
                              <SelectItem value="6 AM to 8 AM">
                                <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                  <Clock className="w-[10px]" />
                                  <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                    <p>
                                      Early Morning{" "}
                                      <span className="font-medium text-foreground">
                                        6 AM to 8 AM
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="9 AM to 12 PM">
                                <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                  <Clock className="w-[10px]" />
                                  <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                    <p>
                                      Morning{" "}
                                      <span className="font-medium text-foreground">
                                        9 AM to 12 PM
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="3 PM to 5 PM">
                                <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                  <Clock className="w-[10px]" />
                                  <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                    <p>
                                      Afternoon{" "}
                                      <span className="font-medium text-foreground">
                                        3 PM to 5 PM
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="7 PM to 9 PM">
                                <div className="flex items-center gap-1 text-muted-foreground text-[12px]">
                                  <Clock className="w-[10px]" />
                                  <div className="grid gap-0.5 mt-[2px] text-[12px]">
                                    <p>
                                      Evening{" "}
                                      <span className="font-medium text-foreground">
                                        7 PM to 9 PM
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <Separator
                    className={`my-0 ${placeToStayDetails?.name && "my-4"}`}
                  />
                  <div
                    className={`p-4 ${placeToStayDetails?.name && "p-4 pb-6"}`}
                  >
                    <Button
                      className="h-[32px] w-full"
                      onClick={(e) => handleProceed(e)}
                      disabled={
                        !placeTwoDetails?.name &&
                        !placeOneDetails?.name &&
                        !placeOneDetails?.timings &&
                        !placeTwoDetails?.timings
                      }
                    >
                      Proceed
                    </Button>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="food">
                <FoodsCard map={map} />
              </TabsContent>
              <TabsContent value="itinerary">
                <ItineraryCard showItineraryCard={showCard} />
              </TabsContent>
            </Tabs>
            <div
              className={`${
                itineraryResponseGemini || showItineraryCard ? "" : "hidden"
              }`}
            >
              {itineraryResponseGemini ? (
                <Card className="h-[40vh] relative">
                  <CardHeader className="flex flex-col items-start bg-muted/50 pt-3 pb-3 gap-[0.5rem] space-y-2">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Your Itinerary
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Made with love powered by Gemini AI 💞
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 max-h-[10rem] overflow-y-auto">
                    <div className="flex flex-col justify-between items-start gap-8">
                      <p className="text-left text-[12px]">
                        {itineraryResponseGemini.responseOne}
                      </p>
                    </div>
                  </CardContent>
                  <div className="p-6">
                    <Button
                      className="w-full text-[12px]"
                      onClick={handleCreateItinerary}
                    >
                      Save Itinerary
                    </Button>
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

export default Journey;
