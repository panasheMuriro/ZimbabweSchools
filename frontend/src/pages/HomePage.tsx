import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import SchoolCard from '../components/SchoolCard';

interface School {
  name: string;
  imageUrl: string;
}

const URL = "https://raw.githubusercontent.com/panasheMuriro/ZimbabweSchools/refs/heads/main/frontend/public"


export default function HomePage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [query, setQuery] = useState('');
  

  useEffect(() => {
    // Fetch the list of schools from our JSON file
    fetch('/data/schools.json')
      .then(res => res.json())
      .then(data => setSchools(data))
      .catch(err => console.error("Failed to load schools data:", err));
  }, []);

  const fuse = useMemo(() => {
    if (schools.length > 0) {
      return new Fuse(schools, {
        keys: ['name'],
        threshold: 0.4,
      });
    }
  }, [schools]);

  const filteredSchools = useMemo(() => {
    if (!query) return schools;
    if (!fuse) return [];
    return fuse.search(query).map(result => result.item);
  }, [query, schools, fuse]);

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {/* Search Bar */}
        <div className="relative mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a school (e.g., Churchill, St Ignatius...)"
            className="w-full px-4 py-3 pl-12 text-lg border border-slate-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* School Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredSchools.map((school) => (
            <SchoolCard key={school.name} name={school.name} imageUrl={URL+school.imageUrl} />
          ))}
        </div>
      </main>
    </>
  );
}