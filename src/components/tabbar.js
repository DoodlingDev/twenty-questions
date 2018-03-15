// @flow
import React, { Component } from "react";
import cn from "../utils/className.js";

type q20$TabBarProps = {
  tabs: Array<*>,
};

type q20$TabBarState = {

};

export const TabBar = ({ tabs }: q20$TabBarProps) => {
  return (
    <nav className={cn("tab-bar")}>
      {tabs}
    </nav>
  );
}

export default TabBar;

