import React, { useContext, useState } from "react";
import { Calendar1, Search } from "lucide-react";
import "./header.css";

export default function Header() {
  return (
    <section id="header-non-user">
      <Calendar1 className="logo"></Calendar1>
      <h1 className="logo-heading">EventSphere</h1>
    </section>
  );
}
