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
import { addPlaceOne } from "../../slices/plannerSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Badge } from "../ui/badge";

const PlaceOneAccordions = () => {
  const dispatch = useDispatch();
  const { placeOneOptions, placeOneDetails } = useSelector(
    (state) => state.plannerDetails
  );
  const handlePlaceOneSelection = (item) => {
    dispatch(addPlaceOne(item));
  };
  const handleChangeSelection = () => {};
  // console.log(placeList);
  return (
    <div>
      {placeOneOptions.length > 1 && !placeOneDetails ? (
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
                        onClick={() => handlePlaceOneSelection(placeItem)}
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
        // <AccordionItem value="selected-place">
        //   <AccordionTrigger className="flex">
        //     <div className="font-bold">Selected Place One</div>
        //     <div>{placeOneDetails.name}</div>
        //     <div className="text-muted-foreground">
        //       {placeOneDetails.timings}
        //     </div>
        //   </AccordionTrigger>
        //   <AccordionContent>
        //     <Card className="overflow-hidden">
        //       <CardHeader>
        //         <CardTitle className="font-bold">
        //           {placeOneDetails.name}
        //         </CardTitle>
        //         {/* <CardTitle className="font-bold">{placeToStayDetails.name}</CardTitle> */}
        //         {/* <CardDescription>{updatedAddress}</CardDescription> */}
        //       </CardHeader>
        //       <CardContent className="flex gap-2">
        //         <div className="flex gap-2 flex-col w-1/3">
        //           {placeOneDetails?.photos?.length > 1 && (
        //             <img
        //               alt=""
        //               className="aspect-square w-full rounded-md object-cover"
        //               src={placeOneDetails?.photos[0]}
        //               style={{ height: "250px", width: "300px" }}
        //             />
        //           )}
        //           <div className="flex justify-between gap-2">
        //             <button>
        //               {placeOneDetails?.photos?.length > 1 && (
        //                 <img
        //                   alt=""
        //                   className="aspect-square w-full rounded-md object-cover"
        //                   src={placeOneDetails?.photos[1]}
        //                   style={{ height: "74px", width: "74px" }}
        //                 />
        //               )}
        //             </button>
        //             <button>
        //               {placeOneDetails?.photos?.length > 1 && (
        //                 <img
        //                   alt=""
        //                   className="aspect-square w-full rounded-md object-cover"
        //                   src={placeOneDetails?.photos[2]}
        //                   style={{ height: "74px", width: "74px" }}
        //                 />
        //               )}
        //             </button>
        //             <button>
        //               {placeOneDetails?.photos?.length > 1 && (
        //                 <img
        //                   alt=""
        //                   className="aspect-square w-full rounded-md object-cover"
        //                   src={placeOneDetails.photos[3]}
        //                   style={{ height: "74px", width: "74px" }}
        //                 />
        //               )}
        //             </button>
        //           </div>
        //         </div>
        //         <div className="flex gap-2 w-2/3">
        //           <Card>
        //             <CardHeader className="flex justify-start gap-1">
        //               {/* <Badge className="w-[50px] absolute">
        //           {placeToStayDetails.rating}/5
        //         </Badge> */}
        //               <div className="flex font-bold">
        //                 {placeOneDetails.name}
        //               </div>
        //               <div className="flex gap-1 font-bold text-muted-foreground">
        //                 {placeOneDetails.formatted_address}
        //               </div>
        //               <div className="flex gap-5 font-bold">
        //                 <div className="flex">
        //                   Ratings:{" "}
        //                   <ul className="flex gap-1 items-end">
        //                     {Array.from({
        //                       length: placeOneDetails.rating,
        //                     }).map((_, index) => (
        //                       <li key={index}>
        //                         <Star fill="#e11d48" strokeWidth={0} />
        //                       </li>
        //                     ))}
        //                   </ul>
        //                 </div>
        //                 {/* <div className="flex gap-1 font-bold">
        //             Reviews:{" "}
        //             <span className="font-normal">
        //               {placeToStayDetails.user_ratings_total}
        //             </span>
        //           </div> */}
        //               </div>
        //             </CardHeader>
        //             <CardContent>
        //               <div className="flex gap-5">
        //                 <div className="font-bold">About: </div>
        //                 <div className="flex justify-start text-justify">
        //                   {placeOneDetails.placeInfo}
        //                 </div>
        //               </div>
        //             </CardContent>
        //             <CardFooter>
        //               <Button onClick={() => handleChangeSelection()}>
        //                 Change Selection
        //               </Button>
        //             </CardFooter>
        //           </Card>
        //         </div>
        //       </CardContent>
        //     </Card>
        //   </AccordionContent>
        //   {/* <AccordionContent className="flex justify-center">
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
        // </AccordionItem>
        <Card className="overflow-hidden min-h-[316px] flex justify-between flex-col">
          <CardHeader className="p-0">
            <img
              alt=""
              className="aspect-square w-full rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none object-cover"
              src={placeOneDetails?.photos[0]}
              style={{ height: "150px", width: "100%" }}
            />
          </CardHeader>
          <CardContent className="flex  flex-col p-2">
            <div className="flex gap-1 font-bold text-muted-foreground text-[8px] items-center">
              <MapPin className="w-[10px]" />
              {placeOneDetails?.formatted_address
                .split(",")
                .slice(0, 3)
                .join(", ")}
            </div>
            <div className="flex font-bold mb-3 justify-between items-center">
              <div>
                {placeOneDetails?.name?.length > 15
                  ? placeOneDetails?.name?.substring(0, 15) + "..."
                  : placeOneDetails?.name}
              </div>
              <div className="flex gap-5 font-bold h-[14px]">
                <Badge className="">
                  <Star className="w-[10px] mr-[5px]" />
                  {placeOneDetails?.rating}/5
                </Badge>
              </div>
            </div>
            <div className="w-[250px]">
              <p className="text-[10px] text-justify">
                {placeOneDetails?.placeInfo}
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

export default PlaceOneAccordions;
