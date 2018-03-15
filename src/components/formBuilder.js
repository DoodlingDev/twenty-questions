// @flow
import React from "react";
import Tabbar from "./tabbar";

type Props = {
  tabButtons: ?Array<React$Node>,
  title: string,
  propertyObjects: Array<React$Node>,
  submitButton: React$Element<*>,
  submitHandler: (Object) => typeof undefined,
  tabs: Object,
  description?: string,
  children?: any,
};

const FormBuilder = ({
  tabButtons,
  title,
  description,
  propertyObjects,
  submitButton,
  validate,
  values,
  fieldRegistry,
  submitFn,
  submitHandler,
  tabs,
}: Props) => {
  return (
    <form>
      {tabButtons &&
        <Tabbar tabs={tabButtons} />
      }

      {title && <h2>{title}</h2>}
      {description && <h3>{description}</h3>}

      {propertyObjects[tabs.activeTab]}
      {React.cloneElement(submitButton, {
        onClick: submitHandler,
      })}
    </form>
  );
};

export default FormBuilder;
