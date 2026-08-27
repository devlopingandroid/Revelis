const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PLACES_DATA } = require('./placesData');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Health check endpoints
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Revelis AI Narration Engine', timestamp: new Date().toISOString() });
});

/**
 * Local Guide Persona Prompt Generator
 * Synthesizes place history and local atmosphere into engaging 30-60 second local guide scripts.
 */
function generateLocalGuideNarration(place, language = 'en', mode = 'discover', duration = 'short') {
  const { name, historicalContext, localVibe } = place;

  if (language === 'hi') {
    switch (place.id) {
      case 'india-gate':
        return `नमस्ते और इंडिया गेट में आपका स्वागत है! जब आप इस विशाल 42 मीटर ऊंचे लाल पत्थर के मेहराब को देखते हैं, तो ध्यान दें कि इसके स्तंभों पर 84,000 से अधिक वीर सैनिकों के नाम खुदे हुए हैं। शाम के समय यहाँ की ठंडी हवा, जलती हुई अमर जवान ज्योति और रंग-बिरंगी रोशनी इस ऐतिहासिक स्थान को बेहद खास बनाती है।`;
      case 'red-fort':
        return `लाल किले के शाही मुख्य द्वार पर आपका स्वागत है! 17वीं सदी में मुगल सम्राट शाहजहाँ द्वारा निर्मित यह किला लाल बलुआ पत्थर की भव्यता की मिसाल है। हर साल स्वतंत्रता दिवस पर भारत के प्रधानमंत्री यहीं से तिरंगा फहराते हैं। पुराने दिल्ली का यह दिल इतिहास और देशभक्ति की गूँज से भरा हुआ है।`;
      case 'qutub-minar':
        return `कुतुब मीनार के प्रांगण में आपका स्वागत है! 73 मीटर ऊँची यह मीनार 12वीं शताब्दी की स्थापत्य कला का एक अद्भुत नमूना है। इसके पास खड़ा लोह स्तंभ 1600 से अधिक वर्षों से बिना जंग लगे खड़ा है। चारों ओर फैली हरियाली और प्राचीन पत्थर इसकी सुंदरता में चार चांद लगाते हैं।`;
      case 'humayuns-tomb':
        return `हुमायूँ के मक़बरे में आपका स्वागत है! 1570 में बनी यह भव्य इमारत चारबाग शैली का भारत में पहला उदाहरण है। ध्यान से देखें तो इसकी संगमरमर की जालीदार खिड़कियाँ और विशाल गुंबद बाद में बने ताज महल की प्रेरणा बने थे। यहाँ का शांत माहौल आपका दिल जीत लेगा।`;
      default:
        return `${name} में आपका स्वागत है! ${historicalContext} यह स्थान अपनी अनूठी पहचान और खूबसूरत माहौल के लिए जाना जाता है।`;
    }
  }

  if (language === 'hinglish') {
    switch (place.id) {
      case 'india-gate':
        return `Hey there, welcome to India Gate! Bas ek minute ruk kar is majestic 42-meter sandstone arch ko dekhiye. Iski walls par 84,000 brave soldiers ke names engraved hain. Shaam ko jab amar jawan jyoti glow karti hai aur thandi hawa chalti hai, tab yahan ka vibe bilkul unmatchable hota hai!`;
      case 'red-fort':
        return `Welcome to the iconic Lal Qila! 1638 me Shah Jahan dwara banwaya gaya ye qila Red Sandstone ki royal architectural brilliance hai. Every Independence Day, yahan se hamari country ka flag hoise hota hai. Old Delhi ki energy aur history ka ye sabse bada landmark hai!`;
      case 'qutub-minar':
        return `Hey, welcome to Qutub Minar! Look at this massive 73-meter tall victory tower built in the 12th century. Iske paas jo 1600 saal purana Iron Pillar hai, uspe aaj tak ek bit bhi rust nahi laga hai! Peaceful lawns me walk karte hue yahan ki ancient carving feel karein.`;
      case 'humayuns-tomb':
        return `Welcome to Humayun's Tomb! 1570 me bana ye garden tomb itna stunning hai ki isne Taj Mahal ki architecture ko inspire kiya tha. Persian design, symmetrical water channels aur marble domes ise Delhi ka sabse peaceful heritage spot banate hain.`;
      default:
        return `Welcome to ${name}! ${historicalContext} Is place ka vibe and architectural beauty sach me mind-blowing hai!`;
    }
  }

  // Default: English Local Guide
  switch (place.id) {
    case 'india-gate':
      return `Welcome to India Gate! Take a moment to stand beneath this soaring 42-meter war memorial arch. Designed by Sir Edwin Lutyens and unveiled in 1931, its sandstone walls carry the inscribed names of over 84,000 brave soldiers. As evening sets in, the illuminated arches and cool breeze along Rajpath create an unforgettable Indian heritage atmosphere.`;
    case 'red-fort':
      return `Welcome to the legendary Red Fort! Commissioned by Mughal Emperor Shah Jahan in 1638, these massive 33-meter red sandstone walls housed the imperial seat of power for centuries. Today, it stands as the majestic stage where the Indian Prime Minister hoists the national flag on Independence Day.`;
    case 'qutub-minar':
      return `Welcome to Qutub Minar! Standing 73 meters tall, this UNESCO World Heritage victory tower was begun in 1192 and features exquisite fluted red sandstone and intricate Arabic calligraphy. Nearby stands the famous 4th-century Iron Pillar, which has miraculously resisted rust for over 1,600 years!`;
    case 'humayuns-tomb':
      return `Welcome to Humayun's Tomb! Built in 1570 by Empress Bega Begum, this magnificent garden tomb introduced the Persian charbagh style to India. Notice the symmetrical marble dome and graceful arched alcoves—this very design served as the architectural inspiration for the Taj Mahal!`;
    case 'lotus-temple':
      return `Welcome to the Lotus Temple! Shaped like a blooming lotus with 27 free-standing marble petals, this Baháʼí House of Worship is open to people of all faiths and backgrounds. Step inside the silent central hall to experience deep peace and quiet reflection.`;
    case 'jantar-mantar':
      return `Welcome to Jantar Mantar! Built in 1724 by Maharaja Jai Singh II of Jaipur, this geometric stone playground contains 13 architectural astronomy instruments. The giant central sundial, Samrat Yantra, can measure local time with remarkable precision!`;
    case 'national-war-memorial':
      return `Welcome to the National War Memorial! Spread across 40 serene acres around the central canopy, this modern tribute features golden inscriptions honoring Indian military personnel who sacrificed their lives post-1947.`;
    case 'rashtrapati-bhavan':
      return `Welcome to Rashtrapati Bhavan! Sitting proudly atop Raisina Hill, this 340-room mansion serves as the official residence of the President of India. Designed by Sir Edwin Lutyens, its majestic dome anchors the central vista of New Delhi.`;
    default:
      return `Welcome to ${name}! ${historicalContext} Enjoy exploring this extraordinary heritage destination!`;
  }
}

/**
 * POST /api/narrate
 * Primary AI Narration Generation Endpoint
 */
app.post('/api/narrate', (req, res) => {
  try {
    const { placeId, language = 'en', mode = 'discover', duration = 'short' } = req.body;

    if (!placeId) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Missing required field: placeId',
      });
    }

    const place = PLACES_DATA[placeId];
    if (!place) {
      return res.status(404).json({
        error: 'PLACE_NOT_FOUND',
        message: `No place found in database matching ID '${placeId}'`,
      });
    }

    // Generate local guide narration text
    const narrationText = generateLocalGuideNarration(place, language, mode, duration);

    // Compute estimated audio duration (avg speaking rate ~ 2.2 words per sec)
    const wordCount = narrationText.split(/\s+/).length;
    const estimatedAudioDurationSeconds = Math.round(wordCount / 2.2);

    const responsePayload = {
      placeId: place.id,
      placeName: place.name,
      category: place.category,
      language,
      mode,
      duration,
      narration: narrationText,
      wordCount,
      estimatedAudioDurationSeconds,
      timestamp: new Date().toISOString(),
    };

    console.log(`[Backend API] Served AI narration for '${place.name}' in language '${language}' (${wordCount} words)`);
    return res.json(responsePayload);
  } catch (error) {
    console.error('[Backend API] Narration generation error:', error);
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Failed to generate AI narration',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Revelis AI Tourism Backend Server Running!`);
  console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/narrate`);
  console.log(`====================================================`);
});
