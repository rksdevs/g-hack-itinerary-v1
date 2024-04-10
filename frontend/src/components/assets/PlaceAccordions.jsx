import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../ui/accordion"

const PlaceAccordions = (placeList) => {
    console.log(placeList)
  return (
    <Accordion type="single" collapsible className="w-full">
        {placeList.length > 1 && placeList?.map((placeItem, index)=>(<AccordionItem key={index} value = {`item-${index}`}>
            <AccordionTrigger>{placeItem}</AccordionTrigger>
            <AccordionContent>
                {placeItem}
            </AccordionContent>   
        </AccordionItem>))}
    {/* <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Is it styled?</AccordionTrigger>
      <AccordionContent>
        Yes. It comes with default styles that matches the other
        components&apos; aesthetic.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Is it animated?</AccordionTrigger>
      <AccordionContent>
        Yes. It&apos;s animated by default, but you can disable it if you
        prefer.
      </AccordionContent>
    </AccordionItem> */}
  </Accordion>
  )
}

export default PlaceAccordions