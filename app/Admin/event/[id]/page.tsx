import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function EventPage() {

    const { id } = useParams();

    const [event, setEvent] = useState<any>(null);
   
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`/api/events/${id}`);
                console.log(res.data);
                setEvent(res.data);
            } catch (e) {
                console.error(e);
            }
            
        }
        fetchEvent();
    },[])

    return (
        <div>
            <h1>Event Page</h1>
            <div>
                <h2>Event Details</h2>
            
                {event ? (
                    <div>
                        <p>Title: {event.title}</p>
                        <p>Description: {event.description}</p>
                        <p>Closes At: {event.closesAt}</p>
                        <p>Outcome: {event.outcome}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <button onClick={() => setIsModalOpen(true)}>Edit Event</button>
            </div>
            <EditModel
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                event={event}
            />
        </div>
        
                    
    )
}   

const EditModel = (
    { isModalOpen, setIsModalOpen, event }: 
    { isModalOpen: boolean, setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, event: any }
) => {
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
        <div>            
            <h1>Event Page</h1>            
            <div>                
                <h2>Event Details</h2>                
                <div>                    
                    <label>Title</label>                    
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />                    
                </div>                
                <div>                    
                    <label>Description</label>                    
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />                    
                </div>                
                <div>                    
                    <label>Closes At</label>                    
                    <input type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />                    
                </div>                
                <div>                    
                    <label>Outcome</label>                    
                    <select value={outcome ?? ""} onChange={(e) => setOutcome(e.target.value ? (e.target.value as "YES" | "NO") : null)}>                        
                        <option value="">Not decided</option>                        
                        <option value="YES">YES</option>                        
                        <option value="NO">NO</option>                    
                    </select>                
                </div>                
                <button onClick={handleSubmit}>Create Event</button>            
            </div>  
        </div>
    )
}