// @flow
import React from "react";
import cn from "../utils/className.js";

type q20$TabBarProps = {
  tabs: Array<*>,
};

export const TabBar = ({ tabs }: q20$TabBarProps) => {
  return <nav className={cn("tab-bar")}>{tabs}</nav>;
};

export default TabBar;
