import Image from "next/image";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-8">
      <div className="flex flex-row justify-between align-middle">
        <div>
          <h1 className="text-3xl font-bold poppins">Hello, Sahil!</h1>
          <p className="text-lg ar-one-sans">This is AR One Sans in action.</p>
        </div>
        <div>
          <Button variant={"ghost"}><LoginLink>Log in</LoginLink></Button>
          <Button variant={"outline"}><RegisterLink>Sign up</RegisterLink></Button>
        </div>
      </div>
    </main>
  );
}
