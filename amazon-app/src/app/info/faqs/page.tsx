'use client';

import { useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import {
  FaRegCreditCard, FaChild, FaConciergeBell, FaWifi, FaBolt, FaMapMarkedAlt,
  FaPhoneAlt, FaBoxOpen, FaTruckMoving, FaQuestionCircle,
} from 'react-icons/fa';

const faqData = [
  {
    pregunta: 'How can I make a reservation?',
    respuesta:
      'You only need to create an account, log in, and select the date and room type from the booking form.',
    icon: <FaRegCreditCard />,
  },
  {
    pregunta: 'What payment methods do you accept?',
    respuesta:
      'We accept cash payments at the lodge and will soon enable card or bank transfer payments.',
    icon: <FaRegCreditCard />,
  },
  {
    pregunta: 'Can I cancel my reservation?',
    respuesta:
      'Yes, you can cancel any active reservation before the check-in date from your profile.',
    icon: <FaTruckMoving />,
  },
  {
    pregunta: 'Does the lodge have Wi-Fi?',
    respuesta:
      'Yes, we offer free Wi-Fi in common areas, though it might be intermittent due to the jungle location.',
    icon: <FaWifi />,
  },
  {
    pregunta: 'What services are included?',
    respuesta:
      'Includes breakfast, guided walks, canoe use, access to hammock area, and local guide service for activities.',
    icon: <FaConciergeBell />,
  },
  {
    pregunta: 'Is there electricity in the rooms?',
    respuesta:
      'Yes, but limited to specific hours as we operate with solar energy and a generator.',
    icon: <FaBolt />,
  },
  {
    pregunta: 'What should I pack for my stay?',
    respuesta:
      'We recommend comfortable clothes, insect repellent, sunscreen, waterproof bags, and good hiking shoes.',
    icon: <FaBoxOpen />,
  },
  {
    pregunta: 'Are children allowed?',
    respuesta:
      'Yes, children are welcome. We recommend families take extra care during guided tours for safety.',
    icon: <FaChild />,
  },
  {
    pregunta: 'Is the lodge accessible for people with disabilities?',
    respuesta:
      'The lodge has limited accessibility due to the natural terrain. Please contact us for specific needs.',
    icon: <FaMapMarkedAlt />,
  },
  {
    pregunta: 'Are meals included? Can you accommodate dietary restrictions?',
    respuesta:
      'Meals including breakfast are included. We can accommodate common dietary restrictions if informed in advance.',
    icon: <FaConciergeBell />,
  },
  {
    pregunta: 'What is the check-in and check-out time?',
    respuesta:
      'Check-in is from 2:00 p.m. to 6:00 p.m. and check-out by 11:00 a.m.',
    icon: <FaRegCreditCard />,
  },
  {
    pregunta: 'Can I extend my stay or book additional activities?',
    respuesta:
      'Extensions and additional activities can be arranged on site subject to availability.',
    icon: <FaPhoneAlt />,
  },
  {
    pregunta: 'Is there phone or mobile signal coverage?',
    respuesta:
      'Mobile signal is very limited. We recommend using Wi-Fi at the lodge for communication.',
    icon: <FaWifi />,
  },
  {
    pregunta: 'Are pets allowed?',
    respuesta:
      'Pets are not allowed to preserve the natural environment and safety of all guests.',
    icon: <FaQuestionCircle />,
  },
  {
    pregunta: 'How safe is the area?',
    respuesta:
      'The area is safe and we have security protocols in place. We recommend following guide instructions during excursions.',
    icon: <FaMapMarkedAlt />,
  },
  {
    pregunta: 'Can I bring my own equipment (e.g., fishing gear, binoculars)?',
    respuesta:
      'Yes, you can bring personal equipment to enhance your experience.',
    icon: <FaBoxOpen />,
  },
  {
    pregunta: 'Are guided tours included or available?',
    respuesta:
      'Guided tours are included in some packages and available for booking onsite.',
    icon: <FaConciergeBell />,
  },
  {
    pregunta: 'Do you offer airport pickup/drop-off services?',
    respuesta:
      'Yes, we coordinate transportation from Iquitos airport to the lodge upon reservation confirmation.',
    icon: <FaTruckMoving />,
  },
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = 'FAQs | Amazon Spirit Lodge';
    setLoaded(true);
  }, []);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(index);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 px-6 pb-20 text-gray-800">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-[#016150] mb-10 text-center tracking-tight">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6 text-base leading-relaxed">
          {faqData.map((item, index) => (
            <section
              key={index}
              className={`transform transition duration-500 ease-in-out ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <button
                type="button"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                onClick={() => toggle(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full flex justify-between items-center text-left px-5 py-4 rounded-xl font-semibold
                  ${
                    activeIndex === index
                      ? 'bg-[#016150]/10 text-[#016150]'
                      : 'text-[#016150]/90 hover:text-[#016150] hover:bg-[#016150]/5'
                  }
                  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#016150]/60`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[#016150]">{item.icon}</span>
                  {item.pregunta}
                </span>
                <FiChevronDown
                  className={`ml-3 text-[#016150] transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`overflow-hidden transition-all duration-300 px-5 ${
                  activeIndex === index ? 'max-h-96 mt-3' : 'max-h-0'
                }`}
              >
                <p className="text-gray-700">{item.respuesta}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
