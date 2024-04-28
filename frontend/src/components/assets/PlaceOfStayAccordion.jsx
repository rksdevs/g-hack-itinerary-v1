import React, { useEffect, useState } from "react";
import { Star, StarHalf, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { addPlaceOne } from "../../slices/plannerSlice";
// import Image from "next/image";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";

const PlaceOfStayAccordion = () => {
  const [updatedAddress, setUpdatedAddress] = useState("");
  const dispatch = useDispatch();
  const {
    placeOneOptions,
    placeOneDetails,
    placeToStayDetails,
    destinationDetails,
  } = useSelector((state) => state.plannerDetails);
  const handlePlaceOneSelection = (item) => {
    dispatch(addPlaceOne(item));
  };
  useEffect(() => {
    if (placeToStayDetails) {
      let result = placeToStayDetails.formatted_address.split(",");
      result.length = 1;
      result.push(destinationDetails.destination);
      setUpdatedAddress(result.join(", "));
    }
  }, [placeToStayDetails, destinationDetails]);
  // console.log(placeList);
  return (
    placeToStayDetails.placeInfo && (
      <>
        {/* <Accordion type="single" collapsible className="w-full hidden">
          <AccordionItem value="selected-place">
            <AccordionTrigger className="flex">
              <div className="font-bold">You're Staying at:</div>
              <div>{placeToStayDetails.name}</div>
              <div className="text-muted-foreground"></div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-bold">Your Stay</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <div className="flex gap-2 flex-col w-1/3">
                    <img
                      alt=""
                      className="aspect-square w-full rounded-md object-cover"
                      src={placeToStayDetails.photos[0]}
                      style={{ height: "250px", width: "300px" }}
                    />
                    <div className="flex justify-between gap-2">
                      <button>
                        <img
                          alt=""
                          className="aspect-square w-full rounded-md object-cover"
                          src={placeToStayDetails.photos[1]}
                          style={{ height: "74px", width: "74px" }}
                        />
                      </button>
                      <button>
                        <img
                          alt=""
                          className="aspect-square w-full rounded-md object-cover"
                          src={placeToStayDetails.photos[2]}
                          style={{ height: "74px", width: "74px" }}
                        />
                      </button>
                      <button>
                        <img
                          alt=""
                          className="aspect-square w-full rounded-md object-cover"
                          src={placeToStayDetails.photos[3]}
                          style={{ height: "74px", width: "74px" }}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 w-2/3">
                    <Card>
                      <CardHeader className="flex justify-start gap-1">
                        <div className="flex font-bold">
                          {placeToStayDetails.name}
                        </div>
                        <div className="flex gap-1 font-bold text-muted-foreground">
                          {updatedAddress}
                        </div>
                        <div className="flex gap-5 font-bold">
                          <div className="flex">
                            Ratings:{" "}
                            <ul className="flex gap-1 items-end">
                              {Array.from({
                                length: placeToStayDetails.rating,
                              }).map((_, index) => (
                                <li key={index}>
                                  <Star fill="#e11d48" strokeWidth={0} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-5">
                          <div className="font-bold">About: </div>
                          <div className="flex justify-start text-justify">
                            {placeToStayDetails.placeInfo}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}
        <Card className="overflow-hidden">
          <CardHeader className="p-0">
            <img
              alt=""
              className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
              src={placeToStayDetails.photos[0]}
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
                {placeToStayDetails.name.length > 15
                  ? placeToStayDetails.name.substring(0, 15) + "..."
                  : placeToStayDetails.name}
              </div>
              <div className="flex gap-5 font-bold h-[14px]">
                <Badge className="">
                  <Star className="w-[10px] mr-[5px]" />
                  {placeToStayDetails.rating}/5
                </Badge>
              </div>
            </div>
            <div className="w-[250px]">
              <p className="text-[10px] text-justify">
                {placeToStayDetails.placeInfo}
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
      </>
    )
  );
};

export default PlaceOfStayAccordion;
