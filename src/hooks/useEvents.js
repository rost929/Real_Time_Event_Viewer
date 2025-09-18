import { useQuery } from "@tanstack/react-query";
import { getEventFetcher } from "../api/eventApi";

function useEvents(category, timePeriod) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["events", category, timePeriod],
    queryFn: async () => {
      const eventFetcher = getEventFetcher(category);
      return await eventFetcher(timePeriod);
    },
  });

  return {
    events: data,
    isLoading,
    error,
  };
}

export default useEvents;
