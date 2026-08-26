/**
 * Backend Places Knowledge Base
 * Stores rich historical context for AI narration generation.
 */
const PLACES_DATA = {
  'india-gate': {
    id: 'india-gate',
    name: 'India Gate',
    category: 'monument',
    location: 'Rajpath, New Delhi',
    historicalContext: 'A 42-meter high war memorial archway designed by Sir Edwin Lutyens and unveiled in 1931. It honors 84,000 soldiers of the British Indian Army who died in World War I and the Third Anglo-Afghan War. The Amar Jawan Jyoti flame beneath the arch has burned continuously since 1971.',
    localVibe: 'Bustling evening destination filled with families, street food, evening breezes, and illuminated arches against the twilight sky.',
  },
  'red-fort': {
    id: 'red-fort',
    name: 'Red Fort',
    category: 'heritage',
    location: 'Old Delhi',
    historicalContext: 'Constructed by Mughal Emperor Shah Jahan in 1638 when he shifted his capital from Agra to Delhi. Built of red sandstone, its impressive 33-meter high walls enclose royal pavilions, the Diwan-i-Aam (Hall of Public Audience), and Diwan-i-Khas.',
    localVibe: 'Historic heart of Old Delhi near Chandni Chowk, echoing centuries of imperial majesty and Independence Day celebrations.',
  },
  'qutub-minar': {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    category: 'heritage',
    location: 'Mehrauli, New Delhi',
    historicalContext: 'A 73-meter tall minaret started by Qutb-ud-din Aibak in 1192 and finished by Iltutmish and Firoz Shah Tughlaq. Built of fluted red sandstone and marble, surrounded by the Iron Pillar of Delhi which has resisted rust for over 1,600 years.',
    localVibe: 'Serene green lawns in ancient Mehrauli, offering quiet contemplation under medieval stone architecture.',
  },
  'humayuns-tomb': {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    category: 'heritage',
    location: 'Nizamuddin East, New Delhi',
    historicalContext: 'Built in 1570 by Empress Bega Begum for Mughal Emperor Humayun. Designed by Persian architect Mirak Mirza Ghiyas, it was the first grand charbagh (four-quadrant garden) tomb in India and directly inspired the architecture of the Taj Mahal.',
    localVibe: 'Peaceful garden paradise surrounded by water channels, symmetrical arches, and Persian-inspired symmetry.',
  },
  'lotus-temple': {
    id: 'lotus-temple',
    name: 'Lotus Temple',
    subtitle: 'Baháʼí House of Worship',
    category: 'cultural',
    location: 'Kalkaji, New Delhi',
    historicalContext: 'Completed in 1986, designed by Iranian-Canadian architect Fariborz Sahba. The structure features 27 free-standing marble-clad petals arranged in clusters of three to form nine doors opening onto a central hall seating 2,500 people.',
    localVibe: 'Meditative sanctuary where visitors of all religions sit together in complete silence amid lush green ponds.',
  },
  'jantar-mantar': {
    id: 'jantar-mantar',
    name: 'Jantar Mantar',
    category: 'monument',
    location: 'Connaught Place, New Delhi',
    historicalContext: 'Built in 1724 by Maharaja Jai Singh II of Jaipur. Consists of 13 architectural astronomy instruments including the Samrat Yantra, a giant sundial standing 27 meters tall used to predict time and planetary movements.',
    localVibe: 'Intriguing geometric stone playground in the heart of modern Connaught Place, blending ancient science with outdoor art.',
  },
  'national-war-memorial': {
    id: 'national-war-memorial',
    name: 'National War Memorial',
    category: 'monument',
    location: 'India Gate Complex, New Delhi',
    historicalContext: 'Inaugurated in 2019, spread over 40 acres around the central canopy. Features four concentric circles named Raksha Chakra, Tyag Chakra, Veerta Chakra, and Amar Chakra, honoring fallen soldiers post-1947.',
    localVibe: 'Solemn and impressive memorial with golden inscriptions of heroes, lit brightly at sunset.',
  },
  'rashtrapati-bhavan': {
    id: 'rashtrapati-bhavan',
    name: 'Rashtrapati Bhavan',
    category: 'monument',
    location: 'Raisina Hill, New Delhi',
    historicalContext: 'Completed in 1929 as the Viceroys House, designed by Sir Edwin Lutyens. Features a 340-room mansion, vast colonnades, a grand central dome inspired by the Pantheon, and famous Mughal Gardens.',
    localVibe: 'Grand imperial boulevard looking down Rajpath towards India Gate, radiating dignity and national governance.',
  },
};

module.exports = { PLACES_DATA };
