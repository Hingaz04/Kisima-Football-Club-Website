import React from "react";
import Fixtures from "../Components/Fixtures";
import Results from "../Components/Results";
import "./SchedulePage.css"; 

function SchedulePage() {
  return (
    <div className="schedule-page-container">
      <div className="fixtures-container">
        <Fixtures />
      </div>
      <div className="results-container">
        <Results />
      </div>
    </div>
  );
}

export default SchedulePage;
