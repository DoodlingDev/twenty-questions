import OnFocus from "../components/nodes/widgets/onFocus";
import StyledBoolean from "../components/nodes/widgets/styledBoolean";

/**
 * getWidgets
 *
 * @param {array} passedWidgets: array of widget components
 * @return {object} Combination
 *   passed widgets and registry
 */
export default function getWidgets(
  passedWidgets?: q20$widgetList,
): q20$widgetList {
  let widgetList = {};
  if (passedWidgets) {
    widgetList = passedWidgets;
  }

  const widgetRegistry = {
    OnFocus,
    StyledBoolean,
  };

  return Object.assign(widgetRegistry, widgetList);
}
