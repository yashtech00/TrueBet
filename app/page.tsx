// app/page.tsx
import EventCard from "./components/EventCard";
import { fetchEvents } from "./lib/fetchEvents";

export default async function Home() {
  const events = await fetchEvents();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 All Prediction Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.length > 0 ? (
          events.map((event: any) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              closesAt={event.closesAt}
            />
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </main>
  );
}
