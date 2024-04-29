import { useEffect, useRef, useState } from "react";
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
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { addPlaceToStay } from "../slices/plannerSlice";
import PlaceOfStayAccordion from "../components/assets/PlaceOfStayAccordion";
import { useNavigate } from "react-router-dom";

function Planner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  } = useSelector((state) => state.plannerDetails);
  const [placeOne, setPlaceOne] = useState("");
  const [placeTwo, setPlaceTwo] = useState("");
  const [topTenList, setTopTenList] = useState([]);
  const [currentPlaceOfStay, setCurrentPlaceOfStay] = useState(null);
  const [openPlaceTwoSelect, setOpenPlaceTwoSelect] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(/**@type google.maps.Map */ (null));
  const [photosUrl, setPhotosUrl] = useState([]);
  const placeOfStay = useRef();
  const [visitPlaceTestArr, setVisitPlaceTestArr] = useState([]);
  const [showPlaceOneInput, setShowPlaceOneInput] = useState(false);

  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    if (placeOneDetails && placeOneDetails?.timings) {
      setOpenPlaceTwoSelect(true);
    }

    if (placeTwoDetails) {
      //do something
    }
  }, [placeOneDetails, placeTwoDetails]);

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

  //to get the current location from browser location
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

  //to unwrapp the array of the promises returned by generateVisitPlaceDetails func above
  const processPlaceResultArray = async (e, placeType) => {
    try {
      const myArr = await generatePlaceOptions(e);
      const promisesArr = myArr.map((item) => generateVisitPlaceDetails(item));
      const result = await Promise.all(promisesArr);
      if (placeType === "placeOne") {
        dispatch(addPlaceOneOptions(result));
      } else {
        dispatch(addPlaceTwoOptions(result));
      }
      console.log(result, "247");
    } catch (error) {}
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

            results.photos.map((item) => photoArray.push(item.getUrl()));
            // setPhotosUrl(...photoArray);

            console.log(results.geometry.location.lat());
            setCurrentPlaceOfStay({
              lat: results.geometry.location.lat(),
              lng: results.geometry.location.lng(),
            });
            map.panTo({
              lat: results.geometry.location.lat(),
              lng: results.geometry.location.lng(),
            });
          }
          console.log(results);

          let placeData = {
            ...results,
            geometry: {
              lat: results.geometry.location.lat(),
              lng: results.geometry.location.lng(),
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

  return (
    <div className="grid pl-[56px]">
      <div className="flex flex-col">
        <header
          className={`sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-2 ${
            placeTwoDetails?.name ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex gap-1">
            {placeToStayDetails?.name ? (
              <Input
                className="h-[32px] text-[10px] w-[200px] bg-primary text-primary-foreground pointer-events-none"
                id="placeOfStay"
                value={`Staying at: ${placeToStayDetails?.name}`}
              />
            ) : (
              isLoaded && (
                <div className="w-full flex justify-start gap-1">
                  <Autocomplete className="w-[80%]">
                    <Input
                      className="h-[32px] text-[10px]"
                      id="placeOfStay"
                      placeholder={`Where do you plan to stay in ${destinationDetails.destination}`}
                      ref={placeOfStay}
                    />
                  </Autocomplete>
                  <Button
                    className="h-[32px] text-[10px]"
                    onClick={handleSetupStay}
                  >
                    Set
                  </Button>
                </div>
              )
            )}
            {/* {isLoaded && (
              <div className="w-full flex justify-start gap-1">
                <Autocomplete className="w-[80%]">
                  <Input
                    className="h-[32px] text-[10px]"
                    id="placeOfStay"
                    placeholder={`Where do you plan to stay in ${destinationDetails.destination}`}
                    ref={placeOfStay}
                  />
                </Autocomplete>
                <Button
                  className="h-[32px] text-[10px]"
                  onClick={handleSetupStay}
                >
                  Set
                </Button>
              </div>
            )} */}
          </div>
          <div
            className={`flex gap-2 ${
              showPlaceOneInput ? "" : placeToStayDetails?.name ? "" : "hidden"
            }`}
          >
            {placeOneDetails?.name ? (
              <>
                <div className="flex items-center">
                  <p className="text-[10px] font-bold">First Place</p>
                </div>
                <div>
                  <Select
                    className="h-[32px] text-[10px] flex items-center text-primary-foreground bg-primary pointer-events-none"
                    onValueChange={(e) =>
                      processPlaceResultArray(e, "placeOne")
                    }
                  >
                    <SelectTrigger
                      id="place-one"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center text-primary-foreground bg-primary pointer-events-none hide-svg"
                    >
                      <SelectValue
                        className="text-[10px] text-primary"
                        placeholder={placeOneDetails?.name}
                      />
                    </SelectTrigger>
                    <SelectContent className="text-[10px]">
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
                              Places that best describes the culture & heritage
                              of the city.
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
                <div className="flex items-center">
                  <p className="text-[10px] font-bold">First Place</p>
                </div>
                <div>
                  <Select
                    className="h-[32px] text-[10px] flex items-center"
                    onValueChange={(e) =>
                      processPlaceResultArray(e, "placeOne")
                    }
                  >
                    <SelectTrigger
                      id="place-one"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
                    >
                      <SelectValue
                        className="text-[10px]"
                        placeholder="Select a type of place you wish to visit"
                      />
                    </SelectTrigger>
                    <SelectContent className="text-[10px]">
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
                              Places that best describes the culture & heritage
                              of the city.
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
            {/* <div className="flex items-center">
              <p className="text-[10px] font-bold">First Place</p>
            </div>
            <div>
              <Select
                className="h-[32px] text-[10px] flex items-center"
                onValueChange={(e) => processPlaceResultArray(e, "placeOne")}
              >
                <SelectTrigger
                  id="place-one"
                  className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
                >
                  <SelectValue
                    className="text-[10px]"
                    placeholder="Select a type of place you wish to visit"
                  />
                </SelectTrigger>
                <SelectContent className="text-[10px]">
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
            </div> */}
            {placeOneDetails?.timings ? (
              <div className={!placeOneDetails?.name ? "hidden" : ""}>
                <div className="grid gap-3">
                  <Select
                    className="h-[32px] text-[10px] flex items-center text-primary-foreground bg-primary pointer-events-none"
                    onValueChange={(e) => dispatch(addPlaceOneTiming(e))}
                    value={placeOneDetails?.timings}
                  >
                    <SelectTrigger
                      id="place-one-time"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center text-primary-foreground bg-primary pointer-events-none hide-svg"
                    >
                      <SelectValue
                        placeholder="Choose time"
                        className="text-[10px]"
                      />
                    </SelectTrigger>
                    <SelectContent className="text-[10px]">
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
              <div className={!placeOneDetails ? "hidden" : ""}>
                {/* <div className="grid gap-3 mb-[5px]">
                <Label htmlFor="top-p">Select time to vist place one</Label>
              </div> */}
                <div className="grid gap-3">
                  <Select
                    className="h-[32px] text-[10px] flex items-center"
                    onValueChange={(e) => dispatch(addPlaceOneTiming(e))}
                  >
                    <SelectTrigger
                      id="place-one-time"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
                    >
                      <SelectValue
                        placeholder="Choose time"
                        className="text-[10px]"
                      />
                    </SelectTrigger>
                    <SelectContent className="text-[10px]">
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
            {/* <div className={!placeOneDetails ? "hidden" : ""}>
              <div className="grid gap-3">
                <Select
                  className="h-[32px] text-[10px] flex items-center"
                  onValueChange={(e) => dispatch(addPlaceOneTiming(e))}
                >
                  <SelectTrigger
                    id="place-one-time"
                    className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
                  >
                    <SelectValue
                      placeholder="Choose time"
                      className="text-[10px]"
                    />
                  </SelectTrigger>
                  <SelectContent className="text-[10px]">
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
            </div> */}
          </div>
          <div
            className={`flex gap-2 items-center ${
              openPlaceTwoSelect ? "" : placeOneDetails?.timings ? "" : "hidden"
            }`}
          >
            {placeTwoDetails?.name ? (
              <>
                <div className="flex items-center">
                  <p className="text-[10px] font-bold">Second Place</p>
                </div>
                <div>
                  <Select
                    onValueChange={(e) =>
                      processPlaceResultArray(e, "placeTwo")
                    }
                    className="h-[32px] text-[10px] flex items-center text-primary-foreground bg-primary pointer-events-none"
                  >
                    <SelectTrigger
                      id="place-two"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center hide-svg bg-primary text-primary-foreground travel-mode-trigger pointer-events-none"
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
                              Places that best describes the culture & heritage
                              of the city.
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
                <div className="flex items-center">
                  <p className="text-[10px] font-bold">Second Place</p>
                </div>
                <div>
                  <Select
                    onValueChange={(e) =>
                      processPlaceResultArray(e, "placeTwo")
                    }
                    className="h-[32px] text-[10px] flex items-center"
                  >
                    <SelectTrigger
                      id="place-two"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
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
                              Places that best describes the culture & heritage
                              of the city.
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
            {/* <div className="flex items-center">
              <p className="text-[10px] font-bold">Second Place</p>
            </div>
            <div>
              <Select
                onValueChange={(e) => processPlaceResultArray(e, "placeTwo")}
                className="h-[32px] text-[10px] flex items-center"
              >
                <SelectTrigger
                  id="place-two"
                  className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
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
            </div> */}
            <div className={!placeTwoDetails?.name ? "hidden" : ""}>
              {placeTwoDetails?.timings ? (
                <div className="grid gap-3">
                  <Select
                    onValueChange={(e) => dispatch(addPlaceTwoTiming(e))}
                    className="h-[32px] text-[10px] flex items-center bg-primary text-primary-foreground"
                    value={placeTwoDetails?.timings}
                  >
                    <SelectTrigger
                      id="place-one-time"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center text-primary-foreground travel-mode-trigger pointer-events-none hide-svg bg-primary"
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
                    className="h-[32px] text-[10px] flex items-center"
                  >
                    <SelectTrigger
                      id="place-one-time"
                      className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
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
              {/* <div className="grid gap-3">
                <Select
                  onValueChange={(e) => dispatch(addPlaceTwoTiming(e))}
                  className="h-[32px] text-[10px] flex items-center"
                >
                  <SelectTrigger
                    id="place-one-time"
                    className="items-start [&_[data-description]]:hidden h-[32px] text-[10px] flex items-center"
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
              </div> */}
            </div>
          </div>
          <div
            className={`${
              placeTwoDetails?.name &&
              placeOneDetails?.name &&
              placeOneDetails?.timings &&
              placeTwoDetails?.timings
                ? "flex"
                : "hidden"
            }`}
          >
            <Button
              className="h-[32px] text-[10px]"
              onClick={() => navigate("/eateries")}
            >
              Proceed
            </Button>
          </div>
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
          {/* <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button> */}
        </header>
        <main className="flex flex-col gap-2 overflow-auto p-2">
          <div
            className={`relative flex h-full min-h-[40vh] rounded-xl bg-muted/50 p-4`}
          >
            {isLoaded && destinationDetails.destination && (
              <>
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
                  {currentPlaceOfStay && (
                    <MarkerF position={currentPlaceOfStay} />
                  )}
                </GoogleMap>
              </>
            )}
          </div>
          <div
            className={`relative flex gap-[5rem] h-full rounded-xl bg-muted/50 p-4 justify-around min-h-[316px]`}
          >
            {/* {placeToStayDetails && <PlaceOfStayAccordion />}
            <div className="flex-1 pt-2">
              {placeOneOptions.length > 1 && <PlaceOneAccordions />}
              {placeTwoOptions.length > 1 && <PlaceTwoAccordions />}
            </div> */}
            <div>{placeToStayDetails && <PlaceOfStayAccordion />}</div>
            {/* <div>{placeToStayDetails && <PlaceOfStayAccordion />}</div> */}
            <div>{placeOneOptions.length > 1 && <PlaceOneAccordions />}</div>
            <div>{placeTwoOptions.length > 1 && <PlaceTwoAccordions />}</div>
            {/* <div>{placeToStayDetails && <PlaceOfStayAccordion />}</div> */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Planner;
