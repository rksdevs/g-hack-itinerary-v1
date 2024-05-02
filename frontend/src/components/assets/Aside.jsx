import React from "react";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  MapPinned,
  Turtle,
  CookingPot,
  CalendarCheck,
  Home,
  School,
  Landmark,
  LogOut,
  ListRestart,
  CalendarPlus  
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { useLogoutMutation } from "../../slices/userApiSlice";
import { useToast } from "../ui/use-toast";
import { clearPlanner } from "../../slices/plannerSlice";
import { clearItinerary } from "../../slices/itinerarySlice";

const Aside = () => {
  const location = useLocation();
  const loginPage = location.pathname === "/login";
  const registerPage = location.pathname === "/register";
  const homePage = location.pathname === "/";
  const plannerPage = location.pathname === "/planner";
  const eateriesPage = location.pathname === "/eateries";
  const itineraryPage = location.pathname === "/itinerary";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [logoutApiCall, { isLoading, error }] = useLogoutMutation();
  const logoutHandler = async (e) => {
    // e.preventDefault();
    await logoutApiCall().unwrap();
    dispatch(clearPlanner());
    dispatch(logout());
    toast({
      title: "Logout successful!",
    });
    navigate("/login");
  };

  const resetPlanner = (e) => {
    e.preventDefault ();
    dispatch(clearPlanner());
    dispatch(clearItinerary());
  }

  const createNewItineraryHandler = (e) => {
    e.preventDefault();
    dispatch(clearPlanner());
    dispatch(clearItinerary());
    navigate("/")
  }

  return (
    <aside
      className={`inset-y fixed  left-0 z-20 flex h-full flex-col border-r ${
        loginPage || registerPage ? "hidden" : ""
      }`}
    >
      <div className={`flex border-b p-2 h-[4rem] items-center`}>
        <Button
          variant="outline"
          size="icon"
          aria-label="Home"
          className={`${homePage && "bg-primary"}`}
          onClick={() => navigate("/")}
        >
          <Landmark  className="size-5 fill-foreground m-0" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
                onClick={(e) => createNewItineraryHandler(e)}
              >
                <CalendarPlus className="size-5 m-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Create New Itinerary
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
                onClick={(e) => resetPlanner(e)}
              >
                <ListRestart className="size-5 m-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Reset Itinerary
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
                onClick={() => navigate("/profile")}
              >
                <SquareUser className="size-5 m-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
                onClick={(e) => logoutHandler(e)}
              >
                <LogOut className="size-5 m-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Aside;
