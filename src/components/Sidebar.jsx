import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setTimePeriod, setMinMagnitude, setSearchTerm, setSelectedEvent } from "../redux/eventsSlice";
import Spinner from "./Spinner";

function Sidebar({ events, status }) {
  const dispatch = useDispatch();

  const category = useSelector((state) => state.events.category);
  const timePeriod = useSelector((state) => state.events.timePeriod);
  const minMagnitude = useSelector((state) => state.events.minMagnitude);
  const searchTerm = useSelector((state) => state.events.searchTerm);

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  };

  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h2>Event Filters</h2>

      <select
        value={category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        <option value="earthquakes">Earthquakes</option>
        <option value="volcanoes">Volcanoes</option>
      </select>

      {category === "earthquakes" && (
        <>
          <select
            value={timePeriod}
            onChange={(e) => dispatch(setTimePeriod(e.target.value))}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            <option value="all_hour">Past Hour</option>
            <option value="all_day">Past Day</option>
            <option value="all_week">Past Week</option>
            <option value="all_month">Past Month</option>
          </select>
          <input
            type="text"
            placeholder="Search by location"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Min Magnitude"
            value={minMagnitude}
            onChange={(e) => dispatch(setMinMagnitude(parseFloat(e.target.value) || 0))}
            style={inputStyle}
          />
        </>
      )}

      {category === "volcanoes" && (
        <>
          <input
            type="text"
            placeholder="Search by event name"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            style={inputStyle}
          />
        </>
      )}
      <div className="event-list-container">
        {status === "loading" ? (
          <Spinner />
        ) : events && events.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {events.map((event) => (
              <li
                key={event.id}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => dispatch(setSelectedEvent(event))}
              >
                - {event.properties?.place || event.name} ({event.properties?.mag || "N/A"})
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
            <p>No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
