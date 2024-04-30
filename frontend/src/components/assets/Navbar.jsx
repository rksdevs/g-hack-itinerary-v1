import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  MapPin,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
import { useLogoutMutation } from "../../slices/userApiSlice";
import { useToast } from "../ui/use-toast";
import { clearPlanner } from "../../slices/plannerSlice";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginPage = location.pathname === "/login";
  const registerPage = location.pathname === "/register";
  const homePage = location.pathname === "/";
  const plannerPage = location.pathname === "/planner";
  const eateriesPage = location.pathname === "/eateries";
  const itineraryPage = location.pathname === "/itinerary";
  const { destinationDetails, placeOneDetails, placeTwoDetails, foodPlan } =
    useSelector((state) => state.plannerDetails);
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const { toast } = useToast();
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
  return (
    <header
      className={`sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-[5rem] ${
        loginPage || registerPage ? "hidden" : ""
      } hidden`}
    >
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <div className="flex flex-col gap-[4px]">
          <div className="relative flex items-center gap-[0.5rem]">
            <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
            <div className="flex w-[5rem]">
              <Label htmlFor="place-one" className="text-[10px]">
                Origin
              </Label>{" "}
            </div>
            <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
              {destinationDetails?.origin
                ? destinationDetails?.origin
                : "Yet to choose"}
            </div>
          </div>
          <div className="relative flex items-center gap-[0.5rem]">
            <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
            <div className="flex w-[5rem]">
              <Label htmlFor="place-one" className="text-[10px]">
                Destination
              </Label>
            </div>
            <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
              {destinationDetails.destination
                ? destinationDetails.destination
                : "Yet to choose"}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className="relative flex items-center gap-[0.5rem]">
            <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
            <div className="flex w-[5rem]">
              <Label htmlFor="place-one" className="text-[10px]">
                Place One
              </Label>
            </div>
            <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
              {placeOneDetails?.name
                ? placeOneDetails.name.length > 15
                  ? placeOneDetails.name.substring(0, 15) + "..."
                  : placeOneDetails.name
                : "Yet to choose"}
            </div>
          </div>
          <div className="relative flex items-center gap-[0.5rem]">
            <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
            <div className="flex w-[5rem]">
              <Label htmlFor="place-one" className="text-[10px]">
                Place Two
              </Label>{" "}
            </div>
            <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
              {placeTwoDetails?.name
                ? placeTwoDetails.name.length > 15
                  ? placeTwoDetails.name.substring(0, 15) + "..."
                  : placeTwoDetails.name
                : "Yet to choose"}
            </div>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <div className="relative flex items-center gap-[0.5rem]">
            <MapPin className="absolute left-[54px] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
            <div className="flex w-[40px]">
              <Label htmlFor="place-one" className="text-[10px]">
                Breakfast
              </Label>
            </div>
            <div className="pl-8 sm:w-[300px] md:w-[150px] lg:w-[150px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
              {foodPlan?.breakfast
                ? foodPlan?.breakfast?.title
                : "Yet to choose"}
            </div>
          </div>
          <div className="relative flex items-center gap-[0.5rem]">
            <MapPin className="absolute left-[54px] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
            <div className="flex w-[40px]">
              <Label htmlFor="place-one" className="text-[10px]">
                Lunch
              </Label>{" "}
            </div>
            <div className="pl-8 sm:w-[300px] md:w-[150px] lg:w-[150px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
              {foodPlan?.lunch ? foodPlan?.lunch?.title : "Yet to choose"}
            </div>
          </div>
          <div className="relative flex items-center gap-[0.5rem]">
            <MapPin className="absolute left-[54px] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
            <div className="flex w-[40px]">
              <Label htmlFor="place-one" className="text-[10px]">
                Dinner
              </Label>{" "}
            </div>
            <div className="pl-8 sm:w-[300px] md:w-[150px] lg:w-[150px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
              {foodPlan?.dinner ? foodPlan?.dinner?.title : "Yet to choose"}
            </div>
          </div>
        </div>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <div className="flex flex-col gap-[4px]">
              <div className="relative flex items-center gap-[0.5rem]">
                <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
                <div className="flex w-[5rem]">
                  <Label htmlFor="place-one" className="text-[10px]">
                    Origin
                  </Label>{" "}
                </div>
                <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
                  {destinationDetails?.origin
                    ? destinationDetails?.origin
                    : "Yet to choose"}
                </div>
              </div>
              <div className="relative flex items-center gap-[0.5rem]">
                <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
                <div className="flex w-[5rem]">
                  <Label htmlFor="place-one" className="text-[10px]">
                    Destination
                  </Label>
                </div>
                <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
                  {destinationDetails.destination
                    ? destinationDetails.destination
                    : "Yet to choose"}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[4px]">
              <div className="relative flex items-center gap-[0.5rem]">
                <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
                <div className="flex w-[5rem]">
                  <Label htmlFor="place-one" className="text-[10px]">
                    Place One
                  </Label>
                </div>
                <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
                  {placeOneDetails?.name
                    ? placeOneDetails.name.length > 15
                      ? placeOneDetails.name.substring(0, 15) + "..."
                      : placeOneDetails.name
                    : "Yet to choose"}
                </div>
              </div>
              <div className="relative flex items-center gap-[0.5rem]">
                <MapPin className="absolute left-[6rem] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
                <div className="flex w-[5rem]">
                  <Label htmlFor="place-one" className="text-[10px]">
                    Place Two
                  </Label>{" "}
                </div>
                <div className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[200px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
                  {placeTwoDetails?.name
                    ? placeTwoDetails.name.length > 15
                      ? placeTwoDetails.name.substring(0, 15) + "..."
                      : placeTwoDetails.name
                    : "Yet to choose"}
                </div>
              </div>
            </div>
            <div className="flex gap-[10px]">
              <div className="relative flex items-center gap-[0.5rem]">
                <MapPin className="absolute left-[54px] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
                <div className="flex w-[40px]">
                  <Label htmlFor="place-one" className="text-[10px]">
                    Breakfast
                  </Label>
                </div>
                <div className="pl-8 sm:w-[300px] md:w-[150px] lg:w-[150px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
                  {foodPlan?.breakfast
                    ? foodPlan?.breakfast?.title
                    : "Yet to choose"}
                </div>
              </div>
              <div className="relative flex items-center gap-[0.5rem]">
                <MapPin className="absolute left-[54px] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
                <div className="flex w-[40px]">
                  <Label htmlFor="place-one" className="text-[10px]">
                    Lunch
                  </Label>{" "}
                </div>
                <div className="pl-8 sm:w-[300px] md:w-[150px] lg:w-[150px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
                  {foodPlan?.lunch ? foodPlan?.lunch?.title : "Yet to choose"}
                </div>
              </div>
              <div className="relative flex items-center gap-[0.5rem]">
                <MapPin className="absolute left-[54px] top--[7px] h-[10px] w-[10px] text-muted-foreground" />
                <div className="flex w-[40px]">
                  <Label htmlFor="place-one" className="text-[10px]">
                    Dinner
                  </Label>{" "}
                </div>
                <div className="pl-8 sm:w-[300px] md:w-[150px] lg:w-[150px] h-[24px] text-[10px] flex items-center rounded-lg border border-primary">
                  {foodPlan?.dinner ? foodPlan?.dinner?.title : "Yet to choose"}
                </div>
              </div>
            </div>
            {/* <div>
            <div className="relative">
              <Label htmlFor="place-one">Destination</Label>            
              <Input
                type="search"
                placeholder="Search itineraries..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value= {destinationDetails ? destinationDetails.destination : "Destination"}
              />
            </div>
          </div> */}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {userInfo ? userInfo.name : "Your Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => logoutHandler(e)}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
