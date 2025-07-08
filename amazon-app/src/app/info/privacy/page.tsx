export const metadata = {
  title: 'Privacy Policy | Amazon Spirit Lodge',
  description:
    'Read our Privacy Policy to understand how we collect, use, and protect your personal data while staying at Amazon Spirit Lodge.',
};

export default async function PrivacyPage() {
  const res = await fetch('http://localhost:3000/privacy', { cache: 'no-store' });
  const data = await res.json();

  return (
    <div className="max-w-4xl mx-auto pt-4 px-6 py-24 text-gray-800">
      <div className="bg-white p-10 sm:p-14 rounded-3xl shadow-2xl border border-gray-100">
        <h1 className="text-2xl sm:text-1xl font-FileText text-[#002f61] mb-4 text-center">
          Privacy Policy
        </h1>

        <article
          className="prose prose-blue max-w-none text-justify"
          dangerouslySetInnerHTML={{ __html: typeof data.content === 'string' ? data.content : '' }}
        />
        
        <p className="mt-12 text-sm text-center text-gray-500 italic">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
