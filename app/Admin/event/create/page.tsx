


import { useState } from "react";


export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [outcome, setOutcome] = useState<"YES" | "NO" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      closesAt: new Date(closesAt),
      outcome,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error("Failed to create event");

      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setClosesAt("");
      setOutcome(null);
    } catch (error) {
      console.error(error);
      alert("Error creating event");
    }
    };        
    
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">      
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>             
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* Closes At */}
        <div>
          <label className="block text-sm font-medium">Closes At</label>
          <input
            type="datetime-local"
            value={closesAt}
            onChange={(e) => setClosesAt(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-sm font-medium">Outcome</label>
                  <select
            
            value={outcome ?? ""}
            onChange={(e) =>
              setOutcome(e.target.value ? (e.target.value as "YES" | "NO") : null)
            }
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">Not decided</option>
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}