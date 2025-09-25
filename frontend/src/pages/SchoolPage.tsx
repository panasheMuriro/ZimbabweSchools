import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Loader from '../components/Loader';

export default function SchoolPage() {
  const { schoolName } = useParams<{ schoolName: string }>();
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!schoolName) return;

    setIsLoading(true);
    setHtmlContent('');
    setError(null);

    fetch(`/api/school/${encodeURIComponent(schoolName)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Failed to fetch school data');
        }
        return res.text();
      })
      .then((html) => {
        setHtmlContent(html);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [schoolName]);

  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [htmlContent]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
        <p className="mt-4 text-lg text-slate-600">
          Generating page for {schoolName}...
        </p>
        <p className="text-sm text-slate-500">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" dangerouslySetInnerHTML={{ __html: error }} />
        <Link to="/" className="mt-8 inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <ArrowLeft className="mr-2 -ml-1 h-5 w-5" />
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <iframe 
      ref={iframeRef}
      className="w-full h-screen border-0"
      title={`${schoolName} School Page`}
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
}