import React, { useEffect, useState } from "react";
import { Star, StarHalf } from "lucide-react";
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
      // <Accordion type="single" collapsible className="w-full">
      //   <AccordionItem value="selected-place">
      //     <AccordionTrigger className="flex">
      //       <div className="font-bold">You're Staying at:</div>
      //       <div>{placeToStayDetails.name}</div>
      //       <div className="text-muted-foreground">
      //         {/* {placeOneDetails.timings} */}
      //       </div>
      //     </AccordionTrigger>
      //     <AccordionContent>
      //       <Card className="flex flex-col">
      //         <CardHeader className="font-bold">
      //           {/* ** About {placeOneDetails.title} ** */}
      //         </CardHeader>
      //         <CardContent>
      //           <p className="float-left mb-[10px]">
      //             {/* {placeOneDetails.details} */}
      //           </p>
      //         </CardContent>
      //         <CardFooter>
      //           <Button onClick={() => handlePlaceOneSelection()}>
      //             Change Selection
      //           </Button>
      //         </CardFooter>
      //       </Card>
      //     </AccordionContent>
      //     {/* <AccordionContent className="flex justify-center">
      //                 <Carousel
      //                   opts={{
      //                     align: "start",
      //                   }}
      //                   className="w-full max-w-sm"
      //                 >
      //                   <CarouselContent>
      //                     {Array.from({ length: 5 }).map((_, index) => (
      //                       <CarouselItem
      //                         key={index}
      //                         className="md:basis-1/2 lg:basis-1/3"
      //                       >
      //                         <div className="p-1">
      //                           <Card>
      //                             <CardContent className="flex aspect-square items-center justify-center p-6">
      //                               <span className="text-3xl font-semibold">
      //                                 {index + 1}
      //                               </span>
      //                             </CardContent>
      //                           </Card>
      //                         </div>
      //                       </CarouselItem>
      //                     ))}
      //                   </CarouselContent>
      //                   <CarouselPrevious />
      //                   <CarouselNext />
      //                 </Carousel>
      //               </AccordionContent> */}
      //   </AccordionItem>
      // </Accordion>
      // <Card>
      <Card className="overflow-hidden hidden">
        <CardHeader>
          <CardTitle className="font-bold">Your Stay</CardTitle>
          {/* <CardTitle className="font-bold">{placeToStayDetails.name}</CardTitle> */}
          {/* <CardDescription>{updatedAddress}</CardDescription> */}
        </CardHeader>
        <CardContent className="flex gap-2">
          <div className="flex gap-2 flex-col w-1/3">
            <img
              alt=""
              className="aspect-square w-full rounded-md object-cover"
              src={placeToStayDetails.photos[0]}
              style={{ height: "250px", width: "275px" }}
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
                {/* <Badge className="w-[50px] absolute">
                  {placeToStayDetails.rating}/5
                </Badge> */}
                <div className="flex font-bold">{placeToStayDetails.name}</div>
                <div className="flex gap-1 font-bold text-muted-foreground">
                  {updatedAddress}
                </div>
                <div className="flex gap-5 font-bold">
                  <div className="flex">
                    Ratings:{" "}
                    <ul className="flex gap-1 items-end">
                      {Array.from({ length: placeToStayDetails.rating }).map(
                        (_, index) => (
                          <li key={index}>
                            <Star fill="#e11d48" strokeWidth={0} />
                          </li>
                        )
                      )}
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
                    {placeToStayDetails.placeInfo}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      // </Card>
    )
  );
};

export default PlaceOfStayAccordion;
