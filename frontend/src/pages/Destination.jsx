import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  Navigation,
  ArrowRightLeft,
  TramFront,
  Car,
  Plane,
  Bike,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useRef, useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

export function Destination() {
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
    libraries,
  });
  // const center = { lat: 43.45, lng: -80.49 };
  // const [origin, setOrigin] = useState({ lat: 43.45, lng: -80.49 });
  // const [destination, setDestination] = useState({ lat: 50.45, lng: 80.49 });
  const [map, setMap] = useState(/**@type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("Total Distance");
  const [duration, setDuration] = useState("Total Duration");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mode, setMode] = useState(null);

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

  const originRef = useRef();

  const destinationRef = useRef();

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
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
  };

  const clearSelection = () => {
    setDirectionsResponse(null);
    setDistance("Total Distance");
    setDuration("Total Duration");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  return (
    <div className="flex w-full flex-col h-[93%]">
      <main className="flex flex-1 flex-col gap-2 p-2 md:gap-4 md:p-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Destination</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold">
                {`${
                  originRef?.current?.value
                    ? `${originRef.current.value.split(",")[0]}`
                    : "Origin"
                } `}{" "}
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "2px",
                    marginBottom: "2px",
                  }}
                >
                  <ArrowRightLeft />
                </p>
                {destinationRef?.current?.value
                  ? `${destinationRef.current.value.split(",")[0]}`
                  : "Destination"}
              </div>
              <p className="text-xs text-muted-foreground">
                {distance} & {duration}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center h-full">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="destination">Choose Destination</TabsTrigger>
              <TabsTrigger value="travel">Setup Travel</TabsTrigger>
            </TabsList>
            <TabsContent value="destination" className="flex gap-3">
              <Card className="h-[36rem] flex-1">
                <CardHeader>
                  <CardTitle>Choose Destination</CardTitle>
                  <CardDescription>
                    Choose your destinations to start with your itinerary
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 mt-[3rem]">
                  <div className="space-y-1">
                    <Label
                      htmlFor="origin"
                      className="float-left my-2 pl-[2px]"
                    >
                      Origin
                    </Label>
                    <Navigation
                      style={{ float: "right", width: "1em" }}
                      onClick={() => map.panTo(currentLocation)}
                    />
                    <Autocomplete>
                      <Input
                        id="origin"
                        placeholder="Choose a location"
                        ref={originRef}
                      />
                    </Autocomplete>
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="destination"
                      className="float-left my-2 pl-[2px]"
                    >
                      Destination
                    </Label>
                    <Navigation
                      style={{ float: "right", width: "1em" }}
                      onClick={() => map.panTo(currentLocation)}
                    />
                    <Autocomplete>
                      <Input
                        id="destination"
                        placeholder="Choose a location"
                        ref={destinationRef}
                      />
                    </Autocomplete>
                  </div>
                </CardContent>
                <CardContent className="space-y-2 mt-[3rem]">
                  <div className="space-y-1 flex justify-between items-center gap-2">
                    <div>Mode of Travel</div>
                    <RadioGroup defaultValue="comfortable">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="car"
                          id="r1"
                          onClick={(e) => setMode(e.target.value)}
                        />
                        <Label htmlFor="r1">Car</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="train"
                          id="r2"
                          onClick={(e) => setMode(e.target.value)}
                        />
                        <Label htmlFor="r2">Train</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="plane"
                          id="r3"
                          onClick={(e) => setMode(e.target.value)}
                        />
                        <Label htmlFor="r3">Flight</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter className="mt-[3rem]">
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={clearSelection}
                  >
                    Clear Selection
                  </Button>
                  <Button className="w-full" onClick={calculateRoute}>
                    Confirm
                  </Button>
                </CardFooter>
              </Card>
              <Card className="h-[36rem] w-[75%] flex-4">
                <CardHeader>
                  <CardTitle>Your Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isLoaded && (
                    <GoogleMap
                      center={currentLocation}
                      zoom={15}
                      mapContainerStyle={{ width: "100%", height: "475px" }}
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
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="travel" className="flex gap-3">
              <Card className="h-[28rem]">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New password</Label>
                    <Input id="new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
              <Card className="h-[28rem]">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">New password</Label>
                    <Input id="new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
