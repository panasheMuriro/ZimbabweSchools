import { Link } from 'react-router-dom';

interface SchoolCardProps {
  name: string;
  imageUrl: string;
}

export default function SchoolCard({ name, imageUrl }: SchoolCardProps) {
  return (
    <Link to={`/schools/${name}`} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <div className="h-40 flex items-center justify-center p-4">
          <img 
            src={imageUrl} 
            alt={`${name} logo`} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="p-4 border-t border-slate-200">
          <h2 className="font-semibold text-center truncate group-hover:text-[#e07a5f]">
            {name}
          </h2>
        </div>
      </div>
    </Link>
  );
}