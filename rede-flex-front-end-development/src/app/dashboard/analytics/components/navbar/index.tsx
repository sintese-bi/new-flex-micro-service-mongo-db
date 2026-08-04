import DashboardComponentsNavbarItems from "./items";
import DashboardComponentsNavbarMenuDropDown from "./menudropdown";
export default async function DashboardComponentsNavbar() {
  return (
    <div className="lg:h-5/6 md:h-5/6 sm:h-5/6 xs:h-28 h-8 rounded-xl">
      <div className="hidden lg:flex md:flex sm:flex xs:hidden top-16 left-2 bg-main-color h-full rounded-xl">
        <DashboardComponentsNavbarItems />
      </div>
      <div className="lg:hidden md:hidden sm:hidden xs:flex">
        <DashboardComponentsNavbarMenuDropDown />
      </div>
    </div>
  );
}
