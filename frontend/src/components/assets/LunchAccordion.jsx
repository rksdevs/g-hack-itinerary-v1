import React from "react";
import { MapPin, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { addLunch } from "../../slices/plannerSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Badge } from "../ui/badge";
import restaurant from "../images/restaurant.jpg";

const LunchAccordion = () => {
  const dispatch = useDispatch();
  const { foodPlanOptions, foodPlan } = useSelector(
    (state) => state.plannerDetails
  );
  const handleLunchSelection = (item) => {
    dispatch(addLunch(item));
  };
  // console.log(placeList);
  return (
    <div>
      {foodPlanOptions?.lunchOptions?.length > 1 && !foodPlan?.lunch ? (
        <Carousel className="w-full max-w-xs min-h-[316px] flex justify-between flex-col">
          <CarouselContent>
            {foodPlanOptions?.lunchOptions?.map((placeItem, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardHeader className="p-0">
                      <img
                        alt=""
                        className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
                        src={restaurant}
                        style={{ height: "150px", width: "100%" }}
                      />
                    </CardHeader>
                    <CardContent className="flex  flex-col p-2">
                      <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
                        <MapPin className="w-[10px]" />
                        {placeItem?.location?.address
                          .split(",")
                          .slice(0, 3)
                          .join(", ")}
                      </div>
                      <div className="flex font-bold mb-3 justify-between items-center">
                        <div>
                          {placeItem.title.length > 15
                            ? placeItem.title.substring(0, 15) + "..."
                            : placeItem.title}
                        </div>
                        <div className="flex gap-5 font-bold h-[14px]">
                          <Badge className="">
                            <Star className="w-[10px] mr-[5px]" />
                            4/5
                          </Badge>
                        </div>
                      </div>
                      <div className="w-[250px]">
                        <p className="text-[10px] text-justify">
                          {placeItem.details}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => handleLunchSelection(placeItem)}
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
      ) : foodPlan?.lunch?.skip ? (
        <Card className="flex flex-col">
          {/* <CardHeader className="font-bold">
            ** About {foodPlan?.lunch?.title} **
          </CardHeader> */}
          <CardContent>
            <p className="float-left mb-[10px]">
              Please carry something to snack upon!
            </p>
          </CardContent>
          {/* <CardFooter>
            <Button>Change Selection</Button>
          </CardFooter> */}
        </Card>
      ) : (
        <Card className="overflow-hidden min-h-[316px] flex flex-col justify-between">
          <CardHeader className="p-0">
            <img
              alt=""
              className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
              src={restaurant}
              style={{ height: "150px", width: "100%" }}
            />
          </CardHeader>
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
                {foodPlan?.lunch.title.length > 15
                  ? foodPlan?.lunch.title.substring(0, 15) + "..."
                  : foodPlan?.lunch.title}
              </div>
              <div className="flex gap-5 font-bold h-[14px]">
                <Badge className="">
                  <Star className="w-[10px] mr-[5px]" />
                  4/5
                </Badge>
              </div>
            </div>
            <div className="w-[250px]">
              <p className="text-[10px] text-justify">
                {foodPlan?.lunch.details}
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-2 pt-0">
            <Button
              className="w-full"
              onClick={() => console.log(foodPlan?.lunch)}
            >
              Remove from Itinerary
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default LunchAccordion;
