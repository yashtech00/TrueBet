import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateEventPage() {
 
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    
     const fetchEvent = async () => {
        try {
            const res = await axios.get("/api/events")
            setEvents(res.data);
        } catch (e) {
            console.log("Error fetching events:", e);
            return [];
        }
    }
    fetchEvent();
 },[])

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
      {events.length > 0 ? (
        events.map((event: any) => (
          <div key={event.id}>
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-500">{event.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Closes At: {new Date(event.closesAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
}
