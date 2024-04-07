import React, { useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useGetGoogleMapApiKeyQuery } from "../../slices/googleMapApiSlice";

const DestinationMap = ({ selected }) => {
  console.log(selected);
  const [open, setOpen] = useState(false);
  const { data: mapKey, isLoading, error } = useGetGoogleMapApiKeyQuery();
  const position = {
    lat: selected.lat,
    lng: selected.lng,
  };
  return isLoading ? (
    <div>Loading Maps</div>
  ) : (
    <APIProvider apiKey={mapKey} libraries={["places"]}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        className="w-[400px] h-[350px]"
        mapId="221e323a9e4060af"
      >
        <AdvancedMarker position={position} onClick={() => setOpen("true")}>
          <Pin background={"cyan"} borderColor={"white"} glyphColor={"blue"} />
        </AdvancedMarker>
        {open && (
          <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
            <p>I'm somewhere on earth</p>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default DestinationMap;
