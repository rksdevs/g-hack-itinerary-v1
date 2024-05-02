import asyncHandler from "../middlewares/asyncHandler.js";
import axios from "axios";
import https from 'https';
import { URLSearchParams } from 'url'; 

export const getGoogleMapStaticUrl = asyncHandler(async(req,res)=>{
    const { center, zoom, size, markers } = req.query;
    const apiKey = process.env.GOOGLE_MAP_KEY;

    const params = new URLSearchParams({
    center,
    zoom,
    size,
    markers,
    key: apiKey,
  });

   const staticMapURL = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;

  // Construct the URL for the Static Maps API
  // const staticMapURL = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&markers=${markers}&key=${apiKey}`;

  // try {
  //   const data = await axios.get(staticMapURL, {responseType: 'arraybuffer'});
  //   res.setHeader('Content-Type', 'image/png');
  //   res.setHeader('Content-Length', data.length);
  //   res.end(data);
  // } catch (error) {
  //   res.status(400);
  //   throw new Error("Error fetching static map,but here's a Pancake...")
  // }

  https.get(staticMapURL, (response) => {
    let data = Buffer.from('');

    // Concatenate the response data
    response.on('data', (chunk) => {
      data = Buffer.concat([data, chunk]);
    });

    // Send the image data back to the client
    response.on('end', () => {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', data.length);
      res.end(data);
    });
  }).on('error', (error) => {
    console.error('Error fetching static map:', error);
    res.status(500).send('Error fetching static map');
  });

})