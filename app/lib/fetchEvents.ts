
export async function fetchEvents() {

    const url = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const res = await fetch(`${url}/api/events`, {
            next: { revalidate: 5 },
        })
        if (!res.ok) {
            throw new Error("Failed to fetch events");
        }
        return res.json();
    } catch (e) {
        console.log("Error fetching events:", e);
        return [];
        
    }
}