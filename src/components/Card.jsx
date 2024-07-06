function Card({ title, children }) {
  return (
    <div className="flex flex-col p-4 md:p-6 rounded-md border border-gray-300 relative w-full h-full bg-white">
      <h2 className="w-full text-xl font-semibold mb-8">{title}</h2>
      {children}
    </div>
  );
}

export default Card;
