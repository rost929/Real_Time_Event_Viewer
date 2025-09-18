import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MapContainer from "./components/MapContainer";
import Sidebar from "./components/Sidebar";
import { fetchEvents, selectFilteredEvents } from "./redux/eventsSlice";

function App() {
  const dispatch = useDispatch();

  const { category, timePeriod, status, error, selectedEvent } = useSelector((state) => state.events);

  const filteredEvents = useSelector(selectFilteredEvents);

  useEffect(() => {
    dispatch(fetchEvents({ category, timePeriod }));
  }, [category, timePeriod, dispatch]);

  if (status === "failed") return <div>An error occurred: {error}</div>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar events={filteredEvents} status={status} />
      <MapContainer events={filteredEvents} selectedEvent={selectedEvent} />
    </div>
  );
}

export default App;
