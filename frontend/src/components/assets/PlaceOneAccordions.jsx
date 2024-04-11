import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { addPlaceOne } from "../../slices/plannerSlice";

const PlaceOneAccordions = () => {
  const dispatch = useDispatch();
  const { placeOneOptions, placeOneDetails } = useSelector(
    (state) => state.plannerDetails
  );
  const handlePlaceOneSelection = (item) => {
    dispatch(addPlaceOne(item));
  };
  // console.log(placeList);
  return (
    <Accordion type="single" collapsible className="w-full">
      {placeOneOptions.length > 1 && !placeOneDetails ? (
        placeOneOptions?.map((placeItem, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{placeItem.title}</AccordionTrigger>
            <AccordionContent>
              <Card className="flex flex-col">
                <CardHeader className="font-bold">
                  ** About {placeItem.title} **
                </CardHeader>
                <CardContent>
                  <p className="float-left mb-[10px]">{placeItem.details}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handlePlaceOneSelection(placeItem)}>
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
      ) : (
        <AccordionItem value="selected-place">
          <AccordionTrigger className="flex">
            <div className="font-bold">Selected Place One</div>
            <div>{placeOneDetails.title}</div>
            <div className="text-muted-foreground">
              {placeOneDetails.timings}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card className="flex flex-col">
              <CardHeader className="font-bold">
                ** About {placeOneDetails.title} **
              </CardHeader>
              <CardContent>
                <p className="float-left mb-[10px]">
                  {placeOneDetails.details}
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handlePlaceOneSelection()}>
                  Change Selection
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
      )}
    </Accordion>
  );
};

export default PlaceOneAccordions;
