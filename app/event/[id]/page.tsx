"use client";

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
    }, [])

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
                {/* <button onClick={() => setIsModalOpen(true)}>Edit Event</button> */}
            </div>
        </div>               
    )
}

