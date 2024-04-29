import Itinerary from "../models/itineraryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import axios from "axios";

//@desc Add an itinerary
//@route POST /api/itinerary/addItinerary
//@access Private
const addItinerary = asyncHandler(async (req, res) => {
    const { name, itineraryDetails } = req.body;

    const newItinerary = new Itinerary({
        name,
        user: req.user._id,
        ...itineraryDetails
    })

    const createdItinerary = await newItinerary.save()
    res.status(200).json(createdItinerary)
});

//@desc Get all itineraries within an account
//@route GET /api/itinerary/myItineraries
//@access Private
const getAllItinerary = asyncHandler(async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ user: req.user._id });
        res.status(200).json(itineraries)
    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Can not find itineraries')
    }
});

//@desc Get one specific itinerary
//@route GET /api/itinerary/:id
//@access Public
const getSpecificItinerary = asyncHandler(async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (itinerary) {
            res.status(200).json(itinerary)
        } else {
            res.status(404);
            throw new Error('Itinerary not found!')
        }
    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Can not find itineraries')
    }
})

//@desc Shorten itinerary link to share
//@route POST /api/itinerary/shorten
//@access Public
// const shortenItineraryLink = asyncHandler(async (req, res) => {
//     const {linkToShorten} = req.body;
//     const encodedParams = new URLSearchParams();
//     encodedParams.set('url', linkToShorten);

//     const options = {
//     method: 'POST',
//     url: process.env.RAPID_API_SHORTEN_URL,
//     headers: {
//         'content-type': 'application/x-www-form-urlencoded',
//         'X-RapidAPI-Key': RAPID_API_SHORTEN_KEY,
//         'X-RapidAPI-Host': RAPID_API_SHORTEN_HOST
//     },
//     data: encodedParams,
//     };

//     try {
//         const response = await axios.request(options);
//         res.status(200).json(response)
//     } catch (error) {
//         console.error(error);
//         res.status(401)
//         throw new Error('Can not shorten url, try again later!')
//     }
// })

export {addItinerary, getAllItinerary, getSpecificItinerary}