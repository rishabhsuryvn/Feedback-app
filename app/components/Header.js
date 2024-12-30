"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import Button from "./Button";
import Logout from "./icons/Logout";
import Login from "./icons/Login";

export default function Header() {
  const { data: session, status } = useSession();

  function logout() {
    signOut();
  }
  function login() {
    signIn("google");
  }
  return (
    <div className="max-w-2xl mx-auto flex justify-between items-center py-4 px-8">
      <div className="flex gap-4 items-center">
        <span className="font-bold text-3xl">feedios</span>
      </div>
      {status === "authenticated" && (
        <>
          <Button className="neu-box-inset p-1" onClick={logout}>
            <Logout />
          </Button>
        </>
      )}
      {status === "unauthenticated" && (
        <>
          <Button
            variant="primary"
            className="shadow-sm px-2 py-0"
            onClick={login}
          >
            <Login />
          </Button>
        </>
      )}
    </div>
  );
}
