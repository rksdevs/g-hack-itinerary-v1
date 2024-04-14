import React from "react";
import { MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { addBreakfast, addPlaceOne } from "../../slices/plannerSlice";

const BreakfastAccordion = () => {
  const dispatch = useDispatch();
  const { placeOneOptions, placeOneDetails, foodPlanOptions, foodPlan } =
    useSelector((state) => state.plannerDetails);
  const handleBreakfastSelection = (item) => {
    dispatch(addBreakfast(item));
  };
  // console.log(placeList);
  return (
    <Accordion type="single" collapsible className="w-full">
      {foodPlanOptions?.breakfastOptions?.length > 1 && !foodPlan?.breakfast ? (
        foodPlanOptions?.breakfastOptions?.map((placeItem, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{placeItem?.title}</AccordionTrigger>
            <AccordionContent>
              <Card className="flex flex-col">
                <CardHeader className="font-bold">
                  ** About {placeItem?.title} **
                </CardHeader>
                <CardContent>
                  <p className="float-left mb-[10px]">{placeItem?.details}</p>
                </CardContent>
                <CardContent>
                  <p className="float-left mb-[10px]">
                    <span className="flex gap-[5px]">
                      <MapPin className="text-muted-foreground font-bold" />{" "}
                      {placeItem?.location?.address}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleBreakfastSelection(placeItem)}>
                    Add to Itinerary
                  </Button>
                </CardFooter>
              </Card>
            </AccordionContent>
            {/* <AccordionContent className="flex justify-center">
                        <Carousel
                          opts={{
                            align: "start",
                          }}
                          className="w-full max-w-sm"
                        >
                          <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                              >
                                <div className="p-1">
                                  <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                      <span className="text-3xl font-semibold">
                                        {index + 1}
                                      </span>
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </AccordionContent> */}
          </AccordionItem>
        ))
      ) : foodPlan?.breakfast?.skip ? (
        <AccordionItem value="selected-place">
          <AccordionTrigger className="flex">
            <div className="font-bold">You're Skipping Breakfast</div>
            <div>
              <span className="font-bold">Skipped</span>
            </div>
            {/* <div className="text-muted-foreground">
          {foodPlan?.breakfast?.timings}
        </div> */}
          </AccordionTrigger>
          <AccordionContent>
            <Card className="flex flex-col">
              {/* <CardHeader className="font-bold">
            ** About {foodPlan?.breakfast?.title} **
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
          </AccordionContent>
        </AccordionItem>
      ) : (
        <AccordionItem value="selected-place">
          <AccordionTrigger className="flex">
            <div className="font-bold">You're Having Breakfast At: </div>
            <div>
              <span className="font-bold">{foodPlan?.breakfast?.title}</span>
              {" : "}
              {foodPlan?.breakfast?.location?.address}
            </div>
            {/* <div className="text-muted-foreground">
              {foodPlan?.breakfast?.timings}
            </div> */}
          </AccordionTrigger>
          <AccordionContent>
            <Card className="flex flex-col">
              <CardHeader className="font-bold">
                ** About {foodPlan?.breakfast?.title} **
              </CardHeader>
              <CardContent>
                <p className="float-left mb-[10px]">
                  {foodPlan?.breakfast?.details}
                </p>
              </CardContent>
              <CardContent>
                <p className="float-left mb-[10px]">
                  {foodPlan?.breakfast?.location?.address}
                </p>
              </CardContent>
              <CardFooter>
                <Button>Change Selection</Button>
              </CardFooter>
            </Card>
          </AccordionContent>
          {/* <AccordionContent className="flex justify-center">
                        <Carousel
                          opts={{
                            align: "start",
                          }}
                          className="w-full max-w-sm"
                        >
                          <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                              >
                                <div className="p-1">
                                  <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                      <span className="text-3xl font-semibold">
                                        {index + 1}
                                      </span>
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </AccordionContent> */}
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default BreakfastAccordion;