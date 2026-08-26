import { SupportedLanguage } from '../types/narration';

/**
 * Offline Fallback Narrations Dataset
 * Ensures gracefulness if network is offline or backend API server is unreachable.
 */
export const FALLBACK_NARRATIONS: Record<
  string,
  Record<SupportedLanguage, string>
> = {
  'india-gate': {
    en: 'Welcome to India Gate! Take a moment to stand beneath this soaring 42-meter war memorial arch. Designed by Sir Edwin Lutyens and unveiled in 1931, its sandstone walls carry the inscribed names of over 84,000 brave soldiers.',
    hi: 'नमस्ते और इंडिया गेट में आपका स्वागत है! जब आप इस विशाल 42 मीटर ऊंचे लाल पत्थर के मेहराब को देखते हैं, तो ध्यान दें कि इसके स्तंभों पर 84,000 से अधिक वीर सैनिकों के नाम खुदे हुए हैं।',
    hinglish:
      'Hey there, welcome to India Gate! Bas ek minute ruk kar is majestic 42-meter sandstone arch ko dekhiye. Iski walls par 84,000 brave soldiers ke names engraved hain.',
  },
  'red-fort': {
    en: 'Welcome to the legendary Red Fort! Commissioned by Mughal Emperor Shah Jahan in 1638, these massive 33-meter red sandstone walls housed the imperial seat of power for centuries.',
    hi: 'लाल किले के शाही मुख्य द्वार पर आपका स्वागत है! 17वीं सदी में मुगल सम्राट शाहजहाँ द्वारा निर्मित यह किला लाल बलुआ पत्थर की भव्यता की मिसाल है।',
    hinglish:
      'Welcome to the iconic Lal Qila! 1638 me Shah Jahan dwara banwaya gaya ye qila Red Sandstone ki royal architectural brilliance hai.',
  },
  'qutub-minar': {
    en: 'Welcome to Qutub Minar! Standing 73 meters tall, this UNESCO World Heritage victory tower was begun in 1192 and features exquisite fluted red sandstone carvings.',
    hi: 'कुतुब मीनार के प्रांगण में आपका स्वागत है! 73 मीटर ऊँची यह मीनार 12वीं शताब्दी की स्थापत्य कला का एक अद्भुत नमूना है।',
    hinglish:
      'Hey, welcome to Qutub Minar! Look at this massive 73-meter tall victory tower built in the 12th century.',
  },
  'humayuns-tomb': {
    en: "Welcome to Humayun's Tomb! Built in 1570 by Empress Bega Begum, this magnificent garden tomb introduced the Persian charbagh style to India.",
    hi: 'हुमायूँ के मक़बरे में आपका स्वागत है! 1570 में बनी यह भव्य इमारत चारबाग शैली का भारत में पहला उदाहरण है।',
    hinglish:
      "Welcome to Humayun's Tomb! 1570 me bana ye garden tomb itna stunning hai ki isne Taj Mahal ki architecture ko inspire kiya tha.",
  },
  'lotus-temple': {
    en: 'Welcome to the Lotus Temple! Shaped like a blooming lotus with 27 free-standing marble petals, this Baháʼí House of Worship is open to people of all faiths.',
    hi: 'कमल मंदिर में आपका स्वागत है! 27 पंखुड़ियों वाले संगमरमर के कमल के रूप में बना यह मंदिर सभी धर्मों के लोगों के लिए खुला है।',
    hinglish:
      'Welcome to Lotus Temple! 27 marble petals se bana ye temple sabhi faiths ke logon ke liye open hai.',
  },
  'jantar-mantar': {
    en: 'Welcome to Jantar Mantar! Built in 1724 by Maharaja Jai Singh II of Jaipur, this geometric stone playground contains 13 astronomical instruments.',
    hi: 'जंतर मंतर में आपका स्वागत है! 1724 में निर्मित यह खगोलीय वेधशाला 13 विशाल पत्थरों के उपकरणों से बनी है।',
    hinglish:
      'Welcome to Jantar Mantar! 1724 me bana ye astronomical observatory 13 massive stone instruments se bana hai.',
  },
  'national-war-memorial': {
    en: 'Welcome to the National War Memorial! Spread across 40 serene acres around the central canopy, honoring Indian military heroes post-1947.',
    hi: 'राष्ट्रीय युद्ध स्मारक में आपका स्वागत है! 40 एकड़ में फैला यह स्मारक 1947 के बाद के हमारे वीर जवानों को समर्पित है।',
    hinglish:
      'Welcome to National War Memorial! 40 acres me phaila ye memorial hamare brave soldiers ko honor karta hai.',
  },
  'rashtrapati-bhavan': {
    en: 'Welcome to Rashtrapati Bhavan! Sitting proudly atop Raisina Hill, this 340-room mansion serves as the official residence of the President of India.',
    hi: 'राष्ट्रपति भवन में आपका स्वागत है! रायसीना पहाड़ी पर स्थित यह 340 कमरों का भवन भारत के राष्ट्रपति का आधिकारिक निवास है।',
    hinglish:
      'Welcome to Rashtrapati Bhavan! Raisina Hill par sthit ye 340-room residence Bharat ke President ka official home hai.',
  },
};
