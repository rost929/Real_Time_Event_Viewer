import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchEarthquakes, fetchVolcanoes } from "../api/eventApi";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ category, timePeriod }, { rejectWithValue }) => {
    try {
      let data;
      if (category === "earthquakes") {
        data = await fetchEarthquakes(timePeriod);
      } else if (category === "volcanoes") {
        data = await fetchVolcanoes();
      } else {
        throw new Error("Invalid category");
      }
      return { category, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  category: "earthquakes",
  events: [],
  status: "idle",
  error: null,
  timePeriod: "all_week",
  minMagnitude: 0,
  searchTerm: "",
  selectedEvent: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setTimePeriod: (state, action) => {
      state.timePeriod = action.payload;
    },
    setMinMagnitude: (state, action) => {
      state.minMagnitude = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.category === "earthquakes") {
          state.events = action.payload.data.features || [];
        } else if (action.payload.category === "volcanoes") {
          state.events = action.payload.data || [];
        }
      });
  },
});

export const { setCategory, setTimePeriod, setMinMagnitude, setSearchTerm, setSelectedEvent } = eventsSlice.actions;

export default eventsSlice.reducer;

const selectCategory = (state) => state.events.category;
const selectEvents = (state) => state.events.events;
const selectMinMagnitude = (state) => state.events.minMagnitude;
const selectSearchTerm = (state) => state.events.searchTerm;

export const selectFilteredEvents = createSelector(
  [selectCategory, selectEvents, selectMinMagnitude, selectSearchTerm],
  (category, events, minMagnitude, searchTerm) => {
    if (category === "earthquakes") {
      return (events || []).filter((event) => {
        const place = event?.properties?.place || "";
        const matchesMagnitude = event.properties.mag >= minMagnitude;
        const matchesSearch = place.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesMagnitude && matchesSearch;
      });
    } else if (category === "volcanoes") {
      return (events || []).filter((event) => {
        const name = event?.name || "";
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    } else {
      return [];
    }
  }
);
