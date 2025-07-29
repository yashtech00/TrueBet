// components/EventCard.tsx
import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  closesAt: string;
}

export default function EventCard({
  id,
  title,
  description,
  closesAt,
}: EventCardProps) {
  return (
    <Link href={`/event/${id}`}>
      <div className="p-4 border rounded-xl shadow hover:shadow-md transition bg-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-2">
          Closes At: {new Date(closesAt).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
