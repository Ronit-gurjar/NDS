'use client';

import { ThemeToggle } from "./ui/theme-toggel";

export default function DashboardBar () {
    return(
        <div className="flex flex-row justify-between items-center w-screen p-4 ">
        <h1 className="poppins">Hello, <span className="font-bold">Sahil</span></h1>
        <ThemeToggle/>
        </div>
    )
}
