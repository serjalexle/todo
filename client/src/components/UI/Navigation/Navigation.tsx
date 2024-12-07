"use client";
import { Favorite, Menu, NoteAdd, Task } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { BOTTOM_NAVIGATION_HEIGHT } from "constants/components";
import React, { useEffect, useState } from "react";

const EXCEPTION_ROUTES = ["/auth/login", "/auth/register"];

const Navigation = () => {
  const [value, setValue] = useState(0);
  const [isNavHidden, setIsNavHidden] = useState(true);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (EXCEPTION_ROUTES.includes(currentPath)) {
      setIsNavHidden(true);
    } else {
      setIsNavHidden(false);
    }
  }, []);

  return (
    !isNavHidden && (
      <BottomNavigation
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: BOTTOM_NAVIGATION_HEIGHT,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
        }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Tasks" icon={<Task />} />
        <BottomNavigationAction label="Favorites" icon={<Favorite />} />
        <BottomNavigationAction label="Notes" icon={<NoteAdd />} />
        <BottomNavigationAction label="Other" icon={<Menu />} />
      </BottomNavigation>
    )
  );
};

export default Navigation;
