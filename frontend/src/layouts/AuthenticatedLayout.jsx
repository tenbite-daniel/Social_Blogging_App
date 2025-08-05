import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideNav from "../components/SideNav";

export default function AuthenticatedLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header
                onToggleSidebar={() =>
                    setIsSidebarCollapsed(!isSidebarCollapsed)
                }
            />

            <div className="flex flex-1 pt-16 overflow-x-hidden">
                <SideNav
                    isCollapsed={isSidebarCollapsed}
                    onCollapse={() => setIsSidebarCollapsed(true)}
                />
                <main
                    className={`flex-1 transition-all duration-300 ${
                        isSidebarCollapsed ? "ml-0 lg:ml-16" : "ml-0 lg:ml-64"
                    } `}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
