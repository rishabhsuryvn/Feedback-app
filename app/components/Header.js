"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import Button from "./Button";
import Logout from "./icons/Logout";
import Login from "./icons/Login";

export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;

  function logout() {
    signOut();
  }
  function login() {
    signIn("google");
  }
  return (
    <div className="max-w-2xl mx-auto flex justify-end p-1">
      {isLoggedIn && (
        <>
          <Button
            className="bg-white border border-red-200 shadow-sm px-1 py-0"
            onClick={logout}
          >
            Logout <Logout />
          </Button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <Button
            variant="primary"
            className="shadow-sm px-2 py-0"
            onClick={login}
          >
            Login <Login />
          </Button>
        </>
      )}
    </div>
  );
}
