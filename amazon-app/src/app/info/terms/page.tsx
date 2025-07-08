import { ShieldCheck, FileText, Ban, Globe2 } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | Amazon Spirit Lodge',
  description:
    'Read the official Terms and Conditions of Amazon Spirit Lodge before booking. Learn about our reservation policies, cancellations, website use, and more.',
};

// Nueva función async para obtener el contenido desde la API
async function getTerms(): Promise<string> {
  const res = await fetch('http://localhost:3000/terms', { cache: 'no-store' });
  if (!res.ok) return 'Terms content not available.';
  const data = await res.json();
  return data.content || 'Terms content not available.';
}

export default async function TermsPage() {
  const content = await getTerms();

  return (
    <div className="max-w-5xl mx-auto pt-4 px-6 py-24 text-gray-800">
      <div className="bg-white p-10 sm:p-14 rounded-3xl shadow-2xl border border-gray-100">
        <h1 className="text-2xl sm:text-1xl font-FileText text-[#002f61] mb-4 text-center">
          Terms and Conditions
        </h1>

        <div
          className="prose max-w-none prose-gray prose-li:marker:text-teal-600 prose-p:text-gray-700 prose-p:mb-3 prose-p:leading-relaxed prose-ul:pl-6 prose-ol:pl-6 prose-ol:list-decimal prose-ul:list-disc"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <p className="mt-12 text-sm text-center text-gray-500 italic">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
