import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team | Amazon Spirit Lodge',
  description:
    'Meet the passionate and dedicated local team behind Amazon Spirit Lodge. Learn about the guides, chefs, and staff who make your jungle experience unforgettable.',
};

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  description?: string;
}

async function getTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch('http://localhost:3000/team', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch team');
    return await res.json();
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
}

export default async function OurTeamPage() {
  const team = await getTeam();

  return (
    <div className="max-w-6xl pt-4 mx-auto px-8 py-24 text-gray-900 bg-white">
      <div className="bg-white p-14 rounded-4xl shadow-2xl border border-[rgba(0,47,97,0.2)]">
        <h1 className="text-5xl font-bold text-[#002f61] mb-12 text-center tracking-tight drop-shadow-md">
          Our Team
        </h1>

        <p className="text-xl mb-16 max-w-3xl mx-auto text-center leading-relaxed text-gray-700">
          At{' '}
          <span className="font-semibold text-[#002f61]">Amazon Spirit Lodge</span>, we take immense
          pride in our passionate local team dedicated to delivering authentic, safe, and unforgettable
          experiences deep in the Amazon rainforest.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-16 text-center">
          {team.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">No team members found.</p>
          )}

          {team.map((member) => (
            <div
              key={member.id}
              className="transform hover:scale-105 transition-transform duration-500 cursor-pointer"
            >
              <img
                src={
                  member.imageUrl.startsWith('http')
                    ? member.imageUrl
                    : `http://localhost:3000${member.imageUrl}`
                }
                alt={member.name}
                className="w-36 h-36 mx-auto rounded-full object-cover shadow-lg border-4 border-[rgba(0,47,97,0.3)]"
                loading="lazy"
              />
              <h3 className="font-semibold text-2xl text-[#002f61] mt-6">{member.name}</h3>
              <p className="text-gray-600 text-base mt-2">{member.role}</p>
              {member.description && (
                <p className="text-sm text-gray-500 mt-1 italic">{member.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
