import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
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
} from "lucide-react";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  addPlaceToStay,
  addPlaceOneOptions,
  addPlaceTwoOptions,
  addPlaceOneTiming,
  addPlaceTwoTiming,
  addPlaceOne,
  addPlaceTwo,
  setDisableFoodTab,
  setCurrentItineraryTab,
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

const PlacesCard = ({ map }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const placeOfStay = useRef();
  const [currentPlaceOfStay, setCurrentPlaceOfStay] = useState(null);
  const [showPlaceOneInput, setShowPlaceOneInput] = useState(false);
  const [openPlaceTwoSelect, setOpenPlaceTwoSelect] = useState(false);
  const [openPlaceDialog, setOpenPlaceDialog] = useState(false);
  const [openSecondPlaceDialog, setOpenSecondPlaceDialog] = useState(false);

  //   const { isLoaded } = useJsApiLoader({
  //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
  //     libraries,
  //   });
  const {
    placeOneDetails,
    placeOneOptions,
    placeTwoOptions,
    placeTwoDetails,
    destinationDetails,
    placeToStayDetails,
    mapIsLoaded,
    // googleMapInstance,
  } = useSelector((state) => state.plannerDetails);
  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });

  //to generate place of stay location details - as  place details are not available in getDetails method within Google places API
  const generatePlaceToStayDetails = async (placeData) => {
    try {
      const palceToStayPrompt = `Please share some good things about this place ${placeData?.name} in a single paragraph, with not more than 20 words`;
      const result = await model.generateContent(palceToStayPrompt);
      const response = result.response.text();
      console.log(response, "seg");

      dispatch(addPlaceToStay({ ...placeData, placeInfo: response }));
    } catch (error) {
      console.log(error);
    }
  };

  //to setup current location of stay in the destination
  const handleSetupStay = async (e) => {
    e.preventDefault();
    console.log("triggered setup stay");
    try {
      console.log(placeOfStay);
      if (placeOfStay.current.value !== "") {
        //eslint-disable-next-line no-undef
        const latlng = new google.maps.Geocoder();
        const resultsLatLang = await latlng.geocode({
          address: placeOfStay.current.value,
        });
        const placeId = resultsLatLang.results[0].place_id;
        console.log(placeId);
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
        placesService.getDetails(request, function callback(results, status) {
          let photoArray = [];
          //eslint-disable-next-line no-undef
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results, "from 210");

            results?.photos?.map((item) => photoArray.push(item.getUrl()));
            // setPhotosUrl(...photoArray);

            console.log(results?.geometry?.location?.lat());
            setCurrentPlaceOfStay({
              lat: results?.geometry?.location?.lat(),
              lng: results?.geometry?.location?.lng(),
            });
            map.panTo({
              lat: results?.geometry?.location?.lat(),
              lng: results?.geometry?.location?.lng(),
            });
          }
          console.log(results);

          let placeData = {
            ...results,
            geometry: {
              lat: results?.geometry?.location?.lat(),
              lng: results?.geometry?.location?.lng(),
            },
            photos: photoArray,
          };
          console.log(placeData);
          generatePlaceToStayDetails(placeData);
        });
        setShowPlaceOneInput(true);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //to unwrapp the array of the promises returned by generateVisitPlaceDetails func above
  const processPlaceResultArray = async (e, placeType) => {
    try {
      const myArr = await generatePlaceOptions(e);
      const promisesArr = myArr.map((item) => generateVisitPlaceDetails(item));
      const result = await Promise.all(promisesArr);

      if (placeType === "placeOne") {
        setOpenPlaceDialog(true);
        dispatch(addPlaceOneOptions(result));
      } else {
        setOpenSecondPlaceDialog(true);
        dispatch(addPlaceTwoOptions(result));
      }
      console.log(result, "247");
    } catch (error) {}
  };

  //to generate top  3 places to visit options
  const generatePlaceOptions = async (e, placeType) => {
    // e.preventDefault();
    console.log("triggered generating options");
    // setPlaceOne();
    try {
      const placeOnePrompt = `top 3 ${e} places to visit in ${destinationDetails?.destination}, send the response as a Javascript JSON array of objects, each object is a place, each object has three properties first is a "title" property and its value is a string of the Name of the place, second is the "details" property and its value is a string of details about the place in not more than 20 words and third is "location" property which has the location information of the place, the value of location is an object with three properties first "address" which has the value of the full address of the place, second is "lng" which is the longitude coordinates of the place and third is "lat" which is the latitude coorinates of the place`;
      const result = await model.generateContent(placeOnePrompt);
      const response = result.response.text();
      console.log(response, "seg");
      const regex = /(\[.*?\])/s;
      const expectedJSON = response.match(regex);
      console.log(JSON.parse(expectedJSON[0]));
      // setTopTenList(JSON.parse(expectedJSON[0]));
      return JSON.parse(expectedJSON[0]);
    } catch (error) {
      console.log(error);
    }
  };

  //to generate the place details for every individual places suggested by gemini
  const generateVisitPlaceDetails = async (place) => {
    console.log(`${place.title}, ${place.location.address}`);
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
              console.log(returningPlaceDetails, "281");
              resolve(returningPlaceDetails);
            } else {
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
    }
  };

  const handlePlaceOneSelection = (item) => {
    // dispatch(addPlaceOne(item));
    dispatch(addPlaceOne(item));
    setOpenPlaceDialog(false);
  };

  const handlePlaceTwoSelection = (item) => {
    // dispatch(addPlaceOne(item));
    dispatch(addPlaceTwo(item));
    setOpenSecondPlaceDialog(false);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    // dispatch(setDisablePlaceTab(false));
    // dispatch(setCurrentItineraryTab("place"));
    dispatch(setDisableFoodTab(false));
    dispatch(setCurrentItineraryTab("food"));
  };

  useEffect(() => {
    if (placeOneDetails && placeOneDetails?.timings) {
      setOpenPlaceTwoSelect(true);
    }

    if (placeTwoDetails) {
      //do something
    }
  }, [placeOneDetails, placeTwoDetails]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-start bg-muted/50 pt-3 pb-3 gap-[1rem] space-y-2">
        <CardTitle className="group flex items-center gap-2 text-lg">
          Places
        </CardTitle>
        <CardDescription className="text-left">
          Select two places from various types of places suggested by Gemini.
        </CardDescription>
      </CardHeader>
      <Separator className="my-4 mt-0" />
      <CardContent className="space-y-2 p-0">
        <div className="space-y-2 p-4">
          <Label htmlFor="origin" className="text-[1rem]">
            Place of Stay
          </Label>
          {placeToStayDetails?.name ? (
            <Input
              className="h-[32px] w-full bg-primary text-primary-foreground pointer-events-none"
              id="placeOfStay"
              value={`Staying at: ${placeToStayDetails?.name}`}
            />
          ) : (
            mapIsLoaded && (
              <div className="w-full flex flex-col justify-start gap-4">
                <Autocomplete className="w-full">
                  <Input
                    className="h-[32px]"
                    id="placeOfStay"
                    placeholder={`Where do you plan to stay in ${destinationDetails.destination}`}
                    ref={placeOfStay}
                  />
                </Autocomplete>
                <Button className="h-[32px]" onClick={handleSetupStay}>
                  Set
                </Button>
              </div>
            )
          )}
        </div>
        <Separator className="my-4 w-full" />
        <div className="space-y-2 p-4">
          <Label htmlFor="origin" className="text-[1rem]">
            First Place To Visit
          </Label>
          {placeOneDetails?.name ? (
            <>
              <div>
                <Select
                  className="h-[32px] flex items-center text-primary-foreground bg-primary pointer-events-none"
                  onValueChange={(e) => processPlaceResultArray(e, "placeOne")}
                >
                  <SelectTrigger
                    id="place-one"
                    className="items-start [&_[data-description]]:hidden h-[32px] flex items-center text-primary-foreground bg-primary pointer-events-none hide-svg"
                  >
                    <SelectValue
                      className="text-primary"
                      placeholder={placeOneDetails?.name}
                    />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="Religious">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            Heritages{" "}
                            <span className="font-medium text-primary-foreground">
                              Religious & Cultural Gatherings
                            </span>
                          </p>
                          <p className="text-xs" data-description>
                            Places that best describes the culture & heritage of
                            the city.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Nature">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
            </>
          ) : (
            <>
              <div>
                <Select
                  className="h-[32px] flex items-center"
                  onValueChange={(e) => processPlaceResultArray(e, "placeOne")}
                >
                  <SelectTrigger
                    id="place-one"
                    className="items-start [&_[data-description]]:hidden h-[32px] flex items-center"
                  >
                    <SelectValue placeholder="Select a type of place you wish to visit" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="Religious">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
                          <p>
                            Heritages{" "}
                            <span className="font-medium text-foreground">
                              Religious & Cultural Gatherings
                            </span>
                          </p>
                          <p className="text-xs" data-description>
                            Places that best describes the culture & heritage of
                            the city.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Nature">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
            </>
          )}
          <div>
            <Dialog open={openPlaceDialog} onOpenChange={setOpenPlaceDialog}>
              <DialogTrigger asChild className="hidden">
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] justify-center">
                {/* <DialogHeader>
                  <DialogTitle>Top Recommendation</DialogTitle>
                  <DialogDescription>
                    Top places recommended by
                  </DialogDescription>
                </DialogHeader> */}
                <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                  <CarouselContent>
                    {placeOneOptions?.map((placeItem, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card className="overflow-hidden">
                            <CardHeader className="p-0">
                              {placeItem?.photos?.length > 1 && (
                                <img
                                  alt=""
                                  className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                  src={placeItem?.photos[0]}
                                  style={{ height: "200px", width: "100%" }}
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
                                    ? placeItem?.name.substring(0, 15) + "..."
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
                                  handlePlaceOneSelection(placeItem)
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
              </DialogContent>
            </Dialog>
          </div>
          <div className="my-4">
            <Label htmlFor="time-place-one" className="text-[1rem]">
              Time Schedule
            </Label>
          </div>
          {placeOneDetails?.timings ? (
            <div>
              <div className="grid gap-3">
                <Select
                  className="h-[32px] flex items-center text-primary-foreground bg-primary pointer-events-none"
                  onValueChange={(e) => dispatch(addPlaceOneTiming(e))}
                  value={placeOneDetails?.timings}
                >
                  <SelectTrigger
                    id="place-one-time"
                    className="items-start [&_[data-description]]:hidden h-[32px] flex items-center text-primary-foreground bg-primary pointer-events-none hide-svg"
                  >
                    <SelectValue placeholder="Choose time" className="" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="6 AM to 8 AM">
                      <div className="flex items-center gap-1 text-primary-foreground">
                        <Clock className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            Early Morning{" "}
                            <span className="font-medium text-primary-foreground">
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
                      <div className="flex items-center gap-1 text-primary-foreground">
                        <Clock className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            First half{" "}
                            <span className="font-medium text-primary-foreground">
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
                      <div className="flex items-center gap-1 text-primary-foreground">
                        <Clock className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            Second half{" "}
                            <span className="font-medium text-primary-foreground">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
          ) : (
            <div>
              <div className="grid gap-3">
                <Select
                  className="h-[32px] flex items-center"
                  onValueChange={(e) => dispatch(addPlaceOneTiming(e))}
                >
                  <SelectTrigger
                    id="place-one-time"
                    className="items-start [&_[data-description]]:hidden h-[32px] flex items-center"
                  >
                    <SelectValue placeholder="Choose time" className="" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="6 AM to 8 AM">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
          )}
        </div>
        <Separator className="my-4" />
        <div className={`space-y-2 p-4 pb-0`}>
          <Label htmlFor="origin" className="text-[1rem]">
            Second Place To Visit
          </Label>
          {placeTwoDetails?.name ? (
            <>
              <div>
                <Select
                  onValueChange={(e) => processPlaceResultArray(e, "placeTwo")}
                  className="h-[32px] flex items-center text-primary-foreground bg-primary pointer-events-none"
                >
                  <SelectTrigger
                    id="place-two"
                    className="items-start [&_[data-description]]:hidden h-[32px] flex items-center hide-svg bg-primary text-primary-foreground travel-mode-trigger pointer-events-none"
                  >
                    <SelectValue placeholder={placeTwoDetails?.name} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Religious">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            Heritages{" "}
                            <span className="font-medium text-foreground text-primary-foreground">
                              Religious & Cultural Gatherings
                            </span>
                          </p>
                          <p className="text-xs" data-description>
                            Places that best describes the culture & heritage of
                            the city.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Nature">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            Nature{" "}
                            <span className="font-medium text-foreground text-primary-foreground">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            Lifestyle{" "}
                            <span className="font-medium text-foreground text-primary-foreground">
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
                      <div className="flex items-center gap-1 text-muted-foreground text-primary-foreground">
                        <MapPin className="w-[10px] text-primary-foreground" />
                        <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                          <p>
                            Something Else{" "}
                            <span className="font-medium text-foreground text-primary-foreground">
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
            </>
          ) : (
            <>
              <div>
                <Select
                  onValueChange={(e) => processPlaceResultArray(e, "placeTwo")}
                  className="h-[32px]  flex items-center"
                >
                  <SelectTrigger
                    id="place-two"
                    className="items-start [&_[data-description]]:hidden h-[32px] flex items-center"
                  >
                    <SelectValue placeholder="Select a type of place you wish to visit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Religious">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
                          <p>
                            Heritages{" "}
                            <span className="font-medium text-foreground">
                              Religious & Cultural Gatherings
                            </span>
                          </p>
                          <p className="text-xs" data-description>
                            Places that best describes the culture & heritage of
                            the city.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="Nature">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-[10px]" />
                        <div className="grid gap-0.5 mt-[2px]">
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
            </>
          )}
          <div>
            <div>
              <Dialog
                open={openSecondPlaceDialog}
                onOpenChange={setOpenSecondPlaceDialog}
              >
                <DialogTrigger asChild className="hidden">
                  <Button variant="outline">Second Place Recommendation</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] justify-center">
                  {/* <DialogHeader>
                  <DialogTitle>Top Recommendation</DialogTitle>
                  <DialogDescription>
                    Top places recommended by
                  </DialogDescription>
                </DialogHeader> */}
                  <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
                    <CarouselContent>
                      {placeTwoOptions?.map((placeItem, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className="overflow-hidden">
                              <CardHeader className="p-0">
                                {placeItem?.photos?.length > 1 && (
                                  <img
                                    alt=""
                                    className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                                    src={placeItem?.photos[0]}
                                    style={{ height: "200px", width: "100%" }}
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
                                      ? placeItem?.name.substring(0, 15) + "..."
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
                                    handlePlaceTwoSelection(placeItem)
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
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="my-4">
            <Label htmlFor="origin" className="text-[1rem]">
              Time Schedule
            </Label>
          </div>
          {placeTwoDetails?.timings ? (
            <div className="grid gap-3">
              <Select
                onValueChange={(e) => dispatch(addPlaceTwoTiming(e))}
                className="h-[32px]  flex items-center bg-primary text-primary-foreground"
                value={placeTwoDetails?.timings}
              >
                <SelectTrigger
                  id="place-one-time"
                  className="items-start [&_[data-description]]:hidden h-[32px]  flex items-center text-primary-foreground travel-mode-trigger pointer-events-none hide-svg bg-primary"
                >
                  <SelectValue placeholder="Choose Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 AM to 8 AM">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px] text-primary-foreground" />
                      <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                        <p>
                          Early Morning{" "}
                          <span className="font-medium text-primary-foreground">
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
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px] text-primary-foreground" />
                      <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                        <p>
                          First half{" "}
                          <span className="font-medium text-primary-foreground">
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
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px] text-primary-foreground" />
                      <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                        <p>
                          Second half{" "}
                          <span className="font-medium text-primary-foreground">
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
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px] text-primary-foreground" />
                      <div className="grid gap-0.5 mt-[2px] text-primary-foreground">
                        <p>
                          Evening hours{" "}
                          <span className="font-medium text-primary-foreground">
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
          ) : (
            <div className="grid gap-3">
              <Select
                onValueChange={(e) => dispatch(addPlaceTwoTiming(e))}
                className="h-[32px] flex items-center"
              >
                <SelectTrigger
                  id="place-two-time"
                  className="items-start [&_[data-description]]:hidden h-[32px] flex items-center"
                >
                  <SelectValue placeholder="Choose Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 AM to 8 AM">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px]" />
                      <div className="grid gap-0.5 mt-[2px]">
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
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px]" />
                      <div className="grid gap-0.5 mt-[2px]">
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
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px]" />
                      <div className="grid gap-0.5 mt-[2px]">
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
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-[10px]" />
                      <div className="grid gap-0.5 mt-[2px]">
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
          )}
        </div>
      </CardContent>
      <Separator className="my-4 " />
      <div className="p-4 pt-0">
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
  );
};

export default PlacesCard;
