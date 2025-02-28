import Image from "next/image";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  return (
    <main className="p-8">
      <div className="flex flex-row justify-between align-middle">
        <div>
          <h1 className="text-3xl font-bold poppins">Hello, Sahil!</h1>
          <p className="text-lg ar-one-sans">This is AR One Sans in action.</p>
        </div>
        <div>
          <LoginLink>Sign in</LoginLink>
          <RegisterLink>Sign up</RegisterLink>
        </div>
      </div>
    </main>
  );
}
