import { Place } from '../types/place';

/**
 * Revelis Tourist & Heritage Places Database
 * Contains 8 iconic heritage landmarks across Delhi.
 * Configured with precise coordinates, discovery radii, categories, and descriptions.
 */
export const DELHI_PLACES: Place[] = [
  {
    id: 'india-gate',
    name: 'India Gate',
    subtitle: 'War Memorial Arch',
    shortDescription: 'A 42-meter high war memorial archway situated in Rajpath, New Delhi, honoring fallen soldiers.',
    description: 'A 42-meter high war memorial archway situated in Rajpath, New Delhi, honoring soldiers.',
    category: 'monument',
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
    },
    radiusMeters: 150,
  },
  {
    id: 'red-fort',
    name: 'Red Fort',
    subtitle: 'Lal Qila Fortress',
    shortDescription: 'Historic 17th-century Mughal fort constructed of red sandstone in Old Delhi.',
    description: 'Historic 17th-century Mughal fortress built by Emperor Shah Jahan, serving as the ceremonial seat of Indian Independence Day celebrations.',
    category: 'heritage',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
    },
    radiusMeters: 200,
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    subtitle: 'UNESCO Victory Tower',
    shortDescription: 'A 73-meter tall minaret and victory tower built in the 12th century.',
    description: 'UNESCO World Heritage site featuring a 73-meter tall victory tower built of red sandstone and marble with intricate Arabic carvings.',
    category: 'heritage',
    location: {
      latitude: 28.5245,
      longitude: 77.1855,
    },
    radiusMeters: 150,
  },
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    subtitle: 'Mughal Garden Tomb',
    shortDescription: 'UNESCO World Heritage garden tomb built in 1570, inspiring Taj Mahal architecture.',
    description: 'The first garden-tomb on the Indian subcontinent, commissioned by Emperor Humayuns chief consort Empress Bega Begum.',
    category: 'heritage',
    location: {
      latitude: 28.5849,
      longitude: 77.2507,
    },
    radiusMeters: 150,
  },
  {
    id: 'lotus-temple',
    name: 'Lotus Temple',
    subtitle: 'Baháʼí House of Worship',
    shortDescription: 'A lotus-shaped house of worship open to all religions, famous for architectural elegance.',
    description: 'Notable for its flowerlike shape, it has become a prominent attraction in the city, open to all regardless of faith.',
    category: 'cultural',
    location: {
      latitude: 28.5535,
      longitude: 77.2588,
    },
    radiusMeters: 150,
  },
  {
    id: 'jantar-mantar',
    name: 'Jantar Mantar',
    subtitle: 'Astronomical Observatory',
    shortDescription: 'Historic astronomical observatory built in 1724 featuring 13 architectural astronomy instruments.',
    description: 'Built by Maharaja Jai Singh II of Jaipur, consisting of 13 architectural astronomy instruments used to compile astronomical tables.',
    category: 'monument',
    location: {
      latitude: 28.6271,
      longitude: 77.2166,
    },
    radiusMeters: 150,
  },
  {
    id: 'national-war-memorial',
    name: 'National War Memorial',
    subtitle: 'Military Honor Monument',
    shortDescription: 'State-of-the-art monument surrounding India Gate canopy honoring fallen Indian military heroes.',
    description: 'Built to honor and remember soldiers of the Indian Armed Forces who fought in post-independence military conflicts.',
    category: 'monument',
    location: {
      latitude: 28.6119,
      longitude: 77.2294,
    },
    radiusMeters: 150,
  },
  {
    id: 'rashtrapati-bhavan',
    name: 'Rashtrapati Bhavan',
    subtitle: 'Presidential Estate',
    shortDescription: 'Official residence of the President of India located at the western end of Rajpath.',
    description: 'The 340-room main building and presidential estate featuring famous Mughal Gardens, designed by Edwin Lutyens.',
    category: 'monument',
    location: {
      latitude: 28.6143,
      longitude: 77.1994,
    },
    radiusMeters: 200,
  },
];

// Default target place constant
export const INDIA_GATE = DELHI_PLACES[0];
export const HERITAGE_PLACES = DELHI_PLACES;
