// src/components/GroceryCard.tsx

interface GroceryCardProps {
  name: string;
  store: string;
  price: string;
}

export default function GroceryCard({ name, store, price }: GroceryCardProps) {
  return (
    <div className="p-3 border rounded-lg flex justify-between items-center bg-slate-50">
      <span><strong>{name}</strong> at {store}</span>
      <span className="text-green-600 font-semibold">{price}</span>
    </div>
  );
}