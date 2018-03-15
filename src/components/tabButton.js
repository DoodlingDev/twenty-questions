// @flow
import React from "react";
import className from "../utils/className";

type Props = {
  label: string,
  handleClick: (SyntheticEvent<*>) => typeof undefined,
};

export const TabButton = ({ handleClick, label }: Props) => {
  return (
    <button
      className={className("tabbedForm", "button", label)}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default TabButton;
