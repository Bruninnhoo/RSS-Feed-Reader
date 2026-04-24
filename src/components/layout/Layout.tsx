import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="flex h-screen w-full bg-white text-[#1a1d21] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto w-full max-w-[var(--container-content)] mx-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
