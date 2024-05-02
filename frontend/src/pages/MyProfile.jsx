import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../slices/userApiSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../components/ui/use-toast";

import { Button } from "../components/ui/button";
import { Package2 } from "lucide-react";
import breakfastImg from "../components/images/breakfast.jpg"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { setCredentials } from "../slices/authSlice";
import { Search } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Badge } from "../components/ui/badge";
import { useGetAllItineraryQuery } from "../slices/itineraryApiSlice";

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {userInfo} = useSelector((state=>state.auth))
const {data:allItinerary, isLoading, error} = useGetAllItineraryQuery()
  const { toast } = useToast();

  return (
    <div className="flex min-h-screen w-full flex-col justify-center items-center">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10 pl-[70px] max-w-[75vw]">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                <Label htmlFor="name" >Name</Label>
                  <Input id="name" defaultValue={userInfo.name} />
                  <Label htmlFor="email" >Email</Label>
                  <Input id="email" defaultValue={userInfo.email} />
                </form>
              </CardContent>
            </Card>
            {allItinerary ? (<Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[200px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead className="w-[200px] sm:table-cell">Name</TableHead>
                        <TableHead className="w-[200px] sm:table-cell">Origin</TableHead>
                        <TableHead className="w-[200px] sm:table-cell">
                          Id
                        </TableHead>
                        <TableHead className="hidden w-[200px] sm:table-cell">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allItinerary.map((itinerartyItem)=>(<TableRow key={itinerartyItem._id}>
                        <TableCell className="hidden sm:table-cell ">
                          <img
                            alt=""
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={itinerartyItem?.placeToStayDetails?.photos[0] || breakfastImg}
                            width="64"
                          />
                        </TableCell>
                        <TableCell className="font-medium w-[200px] text-left">
                          {itinerartyItem?.name?.length > 20
                                ? itinerartyItem?.name.substring(0, 20) +
                                  "..."
                                : itinerartyItem?.name}
                        </TableCell>
                        <TableCell className="w-[200px]">
                            {itinerartyItem?.placeToStayDetails?.name}
                        </TableCell>
                        <TableCell className="w-[200px]">
                            {itinerartyItem._id}
                        </TableCell>
                      </TableRow>))}
                    </TableBody>
                  </Table>) : (<div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>)}
          </div>
      </main>
    </div>
  );
}

export default MyProfile