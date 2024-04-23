import React from "react";
import { Star, StarHalf } from "lucide-react";
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
            <AccordionTrigger>{placeItem.name}</AccordionTrigger>
            {/* <AccordionContent>
              <Card className="flex flex-col">
                <CardHeader className="font-bold">
                  ** About {placeItem.name} **
                </CardHeader>
                <CardContent>
                  <p className="float-left mb-[10px]">{placeItem.placeInfo}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handlePlaceOneSelection(placeItem)}>
                    Add to Itinerary
                  </Button>
                </CardFooter>
              </Card>
            </AccordionContent> */}
            <AccordionContent>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-bold">Your Stay</CardTitle>
                  {/* <CardTitle className="font-bold">{placeToStayDetails.name}</CardTitle> */}
                  {/* <CardDescription>{updatedAddress}</CardDescription> */}
                </CardHeader>
                <CardContent className="flex gap-2">
                  <div className="flex gap-2 flex-col w-1/3">
                    {placeItem?.photos?.length > 1 && (
                      <img
                        alt=""
                        className="aspect-square w-full rounded-md object-cover"
                        src={placeItem?.photos[0]}
                        style={{ height: "250px", width: "300px" }}
                      />
                    )}
                    <div className="flex justify-between gap-2">
                      <button>
                        {placeItem?.photos?.length > 1 && (
                          <img
                            alt=""
                            className="aspect-square w-full rounded-md object-cover"
                            src={placeItem?.photos[1]}
                            style={{ height: "74px", width: "74px" }}
                          />
                        )}
                      </button>
                      <button>
                        {placeItem?.photos?.length > 1 && (
                          <img
                            alt=""
                            className="aspect-square w-full rounded-md object-cover"
                            src={placeItem?.photos[2]}
                            style={{ height: "74px", width: "74px" }}
                          />
                        )}
                      </button>
                      <button>
                        {placeItem?.photos?.length > 1 && (
                          <img
                            alt=""
                            className="aspect-square w-full rounded-md object-cover"
                            src={placeItem.photos[3]}
                            style={{ height: "74px", width: "74px" }}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 w-2/3">
                    <Card>
                      <CardHeader className="flex justify-start gap-1">
                        {/* <Badge className="w-[50px] absolute">
                  {placeToStayDetails.rating}/5
                </Badge> */}
                        <div className="flex font-bold">{placeItem.name}</div>
                        <div className="flex gap-1 font-bold text-muted-foreground">
                          {placeItem.formatted_address}
                        </div>
                        <div className="flex gap-5 font-bold">
                          <div className="flex">
                            Ratings:{" "}
                            <ul className="flex gap-1 items-end">
                              {Array.from({
                                length: placeItem.rating,
                              }).map((_, index) => (
                                <li key={index}>
                                  <Star fill="#e11d48" strokeWidth={0} />
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* <div className="flex gap-1 font-bold">
                    Reviews:{" "}
                    <span className="font-normal">
                      {placeToStayDetails.user_ratings_total}
                    </span>
                  </div> */}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-5">
                          <div className="font-bold">About: </div>
                          <div className="flex justify-start text-justify">
                            {placeItem.placeInfo}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
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
