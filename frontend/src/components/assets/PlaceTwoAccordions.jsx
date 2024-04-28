import React from "react";
import { Star, StarHalf, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { addPlaceTwo } from "../../slices/plannerSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Badge } from "../ui/badge";

const PlaceTwoAccordions = () => {
  const dispatch = useDispatch();
  const { placeTwoOptions, placeTwoDetails } = useSelector(
    (state) => state.plannerDetails
  );
  const handlePlaceTwoSelection = (item) => {
    dispatch(addPlaceTwo(item));
  };
  const handleChangeSelection = () => {};
  // console.log(placeList);
  return (
    <div>
      {placeTwoOptions.length > 1 && !placeTwoDetails ? (
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
                          style={{ height: "150px", width: "100%" }}
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
                          {placeItem.name.length > 15
                            ? placeItem.name.substring(0, 15) + "..."
                            : placeItem.name}
                        </div>
                        <div className="flex gap-5 font-bold h-[14px]">
                          <Badge className="">
                            <Star className="w-[10px] mr-[5px]" />
                            {placeItem.rating}/5
                          </Badge>
                        </div>
                      </div>
                      <div className="w-[250px]">
                        <p className="text-[10px] text-justify">
                          {placeItem.placeInfo}
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
                        onClick={() => handlePlaceTwoSelection(placeItem)}
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
      ) : (
        <Card className="overflow-hidden min-h-[316px] flex justify-between flex-col">
          <CardHeader className="p-0">
            <img
              alt=""
              className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
              src={placeTwoDetails.photos[0]}
              style={{ height: "150px", width: "100%" }}
            />
          </CardHeader>
          <CardContent className="flex  flex-col p-2">
            <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
              <MapPin className="w-[10px]" />
              {placeTwoDetails.formatted_address
                .split(",")
                .slice(0, 3)
                .join(", ")}
            </div>
            <div className="flex font-bold mb-3 justify-between items-center">
              <div>
                {placeTwoDetails.name.length > 15
                  ? placeTwoDetails.name.substring(0, 15) + "..."
                  : placeTwoDetails.name}
              </div>
              <div className="flex gap-5 font-bold h-[14px]">
                <Badge className="">
                  <Star className="w-[10px] mr-[5px]" />
                  {placeTwoDetails.rating}/5
                </Badge>
              </div>
            </div>
            <div className="w-[250px]">
              <p className="text-[10px] text-justify">
                {placeTwoDetails.placeInfo}
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
            <Button className="w-full" onClick={() => handleChangeSelection()}>
              Add to Itinerary
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PlaceTwoAccordions;
