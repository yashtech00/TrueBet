import { useEffect, useState } from "react"


interface Event{
  id:string,
  title: string,
  description: string,
  outcome: string | null,
  closeAt: string,
  createdAt:string
}

export default function Home() {
  
  const [event, setEvent] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("api/events");
      const data = await res.json();
      setEvent(data);
    }
    fetchEvents();
  }, []);


  return (
    <div>

    </div>
  )

}