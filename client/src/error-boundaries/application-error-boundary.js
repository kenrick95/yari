import React from "react";

import "./error-boundaries.scss";

/**
 * The error boundary for application.
 *
 * When the whole application crashes, for whatever reason,
 * this component will show a friendly message
 * to replace that crashed component
 */
export class ApplicationErrorBoundary extends React.Component {
  state = {
    error: null
  };
  componentDidCatch(error, _errorInfo) {
    this.setState({
      error
    });
    // TODO: Report this error to Sentry, https://github.com/mdn/stumptown-renderer/issues/99
  }
  render() {
    if (this.state.error) {
      return (
        <div className="application-error-boundary">
          Unfortunately, this application has encountered unhanlded errors and
          the content cannot be shown.
          {/* TODO: When error reporting is set up, the message should include "We have been notified of this error" or something similar */}
        </div>
      );
    }
    return this.props.children;
  }
}
