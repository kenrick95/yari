import React from "react";

/**
 * The error boundary for ingredients.
 *
 * When an ingredient crashes, for whatever reason,
 * this component will show a friendly message
 * to replace that crashed component
 */
export class ErrorBoundary extends React.Component {
  state = {
    error: null
  };
  componentDidCatch(error, _errorInfo) {
    this.setState({
      error
    });
    // TODO: Report this error somewhere?
  }
  render() {
    if (this.state.error) {
      const { sectionType } = this.props;
      return (
        <>
          <h2>{getTitle(sectionType)}</h2>
          <p>
            Unfortunately, this {sectionType} section has unhanlded errors and
            cannot be shown.
            {/* TODO: When error reporting is set up, the message should include "We have been notified of this error" or something similar */}
          </p>
        </>
      );
    }
    return this.props.children;
  }
}

// NOTE: Should this mapping be maintained elsewhere? Feels wrong to put it here. When there is a new section type, contributors might forget to update this list
function getTitle(sectionType) {
  switch (sectionType) {
    case "prose":
      return "Prose";
    case "interactive_example":
      return "Interactive Example";
    case "attributes":
      return "Attributes";
    case "browser_compatibility":
      return "Browser Compatibility";
    case "examples":
      return "Examples";
    case "example":
      return "Example";
    case "info_box":
      return "Info Box";
    case "link_list":
      return "Link List";

    default:
      return "Unknown Section";
  }
}
