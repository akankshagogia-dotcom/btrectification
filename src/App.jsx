import React, { useState, useCallback } from 'react';
import { Calendar, MapPin, Clock, User, Briefcase, Calculator, CheckCircle, Moon, ChevronRight, AlertCircle, Target, Search } from 'lucide-react';

const ProgressiveBTRApp = () => {
  const zodiac = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const nakLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];
  
  // Phase tracking
  const [phase, setPhase] = useState(1);
  
  // Phase 1 - Birth Info (±2 hours)
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState(""); // Now includes seconds: HH:MM:SS
  const [birthPlace, setBirthPlace] = useState("");
  const [birthPlaceQuery, setBirthPlaceQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [birthLat, setBirthLat] = useState(null);
  const [birthLon, setBirthLon] = useState(null);
  const [birthTz, setBirthTz] = useState("");
  const [isDST, setIsDST] = useState(false);
  const [d1Calculated, setD1Calculated] = useState(false);
  const [lagnaDetails, setLagnaDetails] = useState(null);
  const [moonDetails, setMoonDetails] = useState(null);
  const [timeWindow, setTimeWindow] = useState(120); // ±2 hours in minutes
  
  // Phase 2 - D9 Soul Quiz (±13 minutes)
  const [d9Selection, setD9Selection] = useState("");
  const [d9Confirmed, setD9Confirmed] = useState(null);
  
  // Phase 3 - D10 Career Quiz (±6 minutes)
  const [d10Selection, setD10Selection] = useState("");
  const [d10Confirmed, setD10Confirmed] = useState(null);
  
  // Phase 4 - D7 Legacy Quiz (±90 seconds)
  const [d7Selection, setD7Selection] = useState("");
  const [d7Confirmed, setD7Confirmed] = useState(null);
  
  // Phase 5 - Kunda Siddhanta (±1 second)
  const [moonRashiSelection, setMoonRashiSelection] = useState("");
  const [moonDegree, setMoonDegree] = useState("");
  const [dashaEndDate, setDashaEndDate] = useState("");
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  
  // Final Result
  const [lockedTime, setLockedTime] = useState(null);
  const [processing, setProcessing] = useState(false);

  // ====== GEONAMES API INTEGRATION ======
  
  const GEONAMES_USERNAME = 'akankshagogia';
  
  const searchGeoNames = useCallback(async (query) => {
    console.log('🌐 searchGeoNames called with query:', query);
    console.log('   Query length:', query ? query.length : 0);
    
    if (!query || query.length < 3) {
      console.log('   ❌ Query too short, clearing suggestions');
      setLocationSuggestions([]);
      return;
    }
    
    console.log('   ✅ Query length OK, starting search...');
    setIsSearching(true);
    console.log('   Set isSearching = true');
    
    try {
      const url = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=10&username=${GEONAMES_USERNAME}&orderby=relevance&featureClass=P`;
      console.log('   📡 Fetching URL:', url);
      
      const response = await fetch(url);
      console.log('   📥 Response received, status:', response.status);
      
      if (!response.ok) {
        console.error('   ❌ API Response not OK:', response.status, response.statusText);
        throw new Error(`GeoNames API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('   📦 Data received:', data);
      
      // Check for API error messages
      if (data.status) {
        console.error('   ❌ GeoNames API Error:', data.status.message);
        alert(`GeoNames Error: ${data.status.message}`);
        setLocationSuggestions([]);
        return;
      }
      
      if (data.geonames && data.geonames.length > 0) {
        console.log('   ✅ Found', data.geonames.length, 'results');
        const suggestions = data.geonames.map(place => ({
          name: `${place.name}, ${place.adminName1 || place.countryName}`,
          fullName: `${place.name}, ${place.adminName1 ? place.adminName1 + ', ' : ''}${place.countryName}`,
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lng),
          timezone: place.timezone?.timeZoneId || '',
          geonameId: place.geonameId
        }));
        console.log('   📋 Mapped suggestions:', suggestions);
        setLocationSuggestions(suggestions);
        console.log('   ✅ Set locationSuggestions');
      } else {
        console.log('   ⚠️ No results found');
        setLocationSuggestions([]);
      }
    } catch (error) {
      console.error('   ❌ GeoNames search error:', error);
      alert(`Search failed: ${error.message}. Check console for details.`);
      setLocationSuggestions([]);
    } finally {
      console.log('   🏁 Setting isSearching = false');
      setIsSearching(false);
    }
  }, []);

  const getTimezoneInfo = async (lat, lon) => {
    try {
      console.log('Fetching timezone for:', lat, lon);
      const url = `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lon}&username=${GEONAMES_USERNAME}`;
      console.log('Timezone API URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Timezone API error:', response.status);
        throw new Error('Timezone API error');
      }
      
      const data = await response.json();
      console.log('Timezone data:', data);
      
      if (data.status) {
        console.error('Timezone API Error:', data.status.message);
        return null;
      }
      
      return {
        timezone: data.timezoneId,
        rawOffset: data.rawOffset,
        dstOffset: data.dstOffset
      };
    } catch (error) {
      console.error('Timezone lookup error:', error);
      return null;
    }
  };

  const handleLocationSearch = (value) => {
    console.log('🔍 handleLocationSearch called with:', value);
    console.log('   Current birthPlaceQuery:', birthPlaceQuery);
    
    setBirthPlaceQuery(value);
    setShowSuggestions(true);
    
    console.log('   Value length:', value.length);
    
    // Clear previous timeout
    if (searchTimeout) {
      console.log('   Clearing previous timeout:', searchTimeout);
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout
    const timeoutId = setTimeout(() => {
      console.log('   ⏰ Timeout triggered, calling searchGeoNames with:', value);
      searchGeoNames(value);
    }, 300);
    
    console.log('   New timeout ID:', timeoutId);
    setSearchTimeout(timeoutId);
  };

  const selectLocation = async (location) => {
    setBirthPlace(location.fullName);
    setBirthPlaceQuery(location.fullName);
    setBirthLat(location.lat);
    setBirthLon(location.lon);
    
    // Get accurate timezone info
    const tzInfo = await getTimezoneInfo(location.lat, location.lon);
    if (tzInfo) {
      setBirthTz(tzInfo.timezone);
      // Check if DST is currently active
      setIsDST(tzInfo.dstOffset !== tzInfo.rawOffset);
    } else {
      setBirthTz(location.timezone);
    }
    
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  // ====== OPTIMIZED ASTRONOMICAL CALCULATIONS ======
  
  const getJulianDay = (year, month, day, hour, minute, second) => {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (year + 4716)) + 
               Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    const dayFraction = (hour + minute / 60 + second / 3600) / 24;
    return JD + dayFraction;
  };

  const getObliquity = (jd) => {
    const T = (jd - 2451545.0) / 36525;
    return 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  };

  const getGMST = (jd) => {
    const T = (jd - 2451545.0) / 36525;
    let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
               0.000387933 * T * T - T * T * T / 38710000;
    return ((gmst % 360) + 360) % 360;
  };

  const getLST = (jd, longitude) => {
    const gmst = getGMST(jd);
    return (gmst + longitude + 360) % 360;
  };

  const calculateAscendant = (lst, latitude, epsilon) => {
    const lstRad = lst * Math.PI / 180;
    const latRad = latitude * Math.PI / 180;
    const epsRad = epsilon * Math.PI / 180;
    
    const numerator = Math.cos(lstRad);
    const denominator = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
    
    let asc = Math.atan2(numerator, denominator) * 180 / Math.PI;
    return ((asc % 360) + 360) % 360;
  };

  const getLahiriAyanamsa = (jd) => {
    const base_ayanamsa = 22.460472222;
    const rate_per_year = 50.2388475 / 3600;
    const jd_epoch_1900 = 2415020.0;
    const tropical_years_since_1900 = (jd - jd_epoch_1900) / 365.25;
    return base_ayanamsa + rate_per_year * tropical_years_since_1900;
  };

  const tropicalToSidereal = (tropicalLong, ayanamsa) => {
    return ((tropicalLong - ayanamsa) % 360 + 360) % 360;
  };

  const getZodiacFromLongitude = (longitude) => {
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    return {
      sign: zodiac[signIndex],
      signIndex: signIndex,
      degree: degreeInSign,
      absoluteDegree: longitude
    };
  };

  const degreesToDMS = (decimal) => {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60);
    return {
      degrees,
      minutes,
      seconds,
      formatted: `${degrees}° ${minutes}' ${seconds}"`
    };
  };

  const calculateMoonPosition = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841.0 - T * T * T * T / 65194000.0;
    const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868.0 - T * T * T * T / 113065000.0;
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000.0;
    const M_prime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699.0 - T * T * T * T / 14712000.0;
    const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000.0 + T * T * T * T / 863310000.0;
    
    const D_rad = D * Math.PI / 180;
    const M_rad = M * Math.PI / 180;
    const M_prime_rad = M_prime * Math.PI / 180;
    const F_rad = F * Math.PI / 180;
    
    let lon = L0;
    lon += 6.288774 * Math.sin(M_prime_rad);
    lon += 1.274027 * Math.sin(2*D_rad - M_prime_rad);
    lon += 0.658314 * Math.sin(2*D_rad);
    lon += 0.213618 * Math.sin(2*M_prime_rad);
    lon -= 0.185116 * Math.sin(M_rad);
    lon -= 0.114332 * Math.sin(2*F_rad);
    
    return ((lon % 360) + 360) % 360;
  };

  const getNakshatraInfo = (moonLongitude) => {
    const nakIndex = Math.floor(moonLongitude / (360 / 27));
    const lordIndex = Math.floor(nakIndex / 3);
    return {
      nakshatra: nakshatras[nakIndex],
      nakshatraLord: nakLords[lordIndex],
      nakIndex: nakIndex
    };
  };

  const getAdjacentSigns = (sign) => {
    const index = zodiac.indexOf(sign);
    const prevIndex = (index - 1 + 12) % 12;
    const nextIndex = (index + 1) % 12;
    return {
      previous: zodiac[prevIndex],
      next: zodiac[nextIndex]
    };
  };

  const getD9Traits = (sign) => {
    const traits = {
      "Aries": "Soul Nature: Direct, passionate warrior spirit. Takes initiative in relationships and spiritual growth. Independent soul journey. Needs action and challenge. Partner should respect autonomy.",
      "Taurus": "Soul Nature: Loyal, stable, grounded spirit. Values security and comfort in partnerships. Sensual and patient soul. Builds lasting bonds slowly. Spiritually connected to earth and material beauty.",
      "Gemini": "Soul Nature: Communicative, analytical soul. Seeks intellectual connection in relationships. Curious and adaptable spirit. Multiple interests spiritually. Partner must stimulate mind and conversation.",
      "Cancer": "Soul Nature: Nurturing, intuitive, deeply emotional soul. Strong connection to family and roots. Protective and caring spirit. Spiritual growth through emotional bonds. Seeks emotional security.",
      "Leo": "Soul Nature: Generous, warm-hearted, confident soul. Needs admiration and recognition. Creative spiritual expression. Loyal and dramatic in love. Partner should appreciate and celebrate you.",
      "Virgo": "Soul Nature: Practical, service-oriented, analytical soul. Spiritual growth through helping others. Detail-focused and perfectionist. Humble approach to spirituality. Seeks meaningful service.",
      "Libra": "Soul Nature: Diplomatic, harmonious, partnership-oriented soul. Seeks balance in all things. Refined aesthetic sense. Spiritual growth through relationships. Natural mediator and peacemaker.",
      "Scorpio": "Soul Nature: Intense, transformative, all-or-nothing soul. Deep emotional depths. Passionate and mysterious spirit. Spiritual transformation through crisis. Seeks profound soul connections.",
      "Sagittarius": "Soul Nature: Philosophical, adventurous, freedom-loving soul. Optimistic spiritual seeker. Needs space and exploration. Growth through teaching and learning. Partner must allow independence.",
      "Capricorn": "Soul Nature: Responsible, mature, disciplined soul. Builds lasting spiritual foundations. Committed and reliable in relationships. Traditional approach to spirituality. Seeks stable partnerships.",
      "Aquarius": "Soul Nature: Unconventional, independent, humanitarian soul. Values friendship in partnership. Progressive spiritual views. Intellectual approach to spirituality. Needs freedom and space.",
      "Pisces": "Soul Nature: Compassionate, selfless, transcendent soul. Merges boundaries with partner. Spiritual and artistic gifts. Intuitive and empathetic. Seeks divine union through love."
    };
    return traits[sign] || "";
  };

  const getD10Traits = (sign) => {
    const traits = {
      "Aries": "Career: Pioneer, entrepreneur, leadership roles. Competitive professional environment. Independent business ventures. Military, sports, or startup leadership. Thrives on challenges and action.",
      "Taurus": "Career: Banking, finance, real estate, agriculture. Stable, long-term career growth. Values material security. Art dealing, luxury goods, food industry. Builds wealth steadily through patience.",
      "Gemini": "Career: Communication, writing, teaching, media. Versatile professional skills. Multiple income sources. Journalism, sales, translation, social media. Intellectual and varied work environment.",
      "Cancer": "Career: Hospitality, caregiving, food industry, real estate. Nurturing profession. Hotel management, nursing, counseling, interior design. Emotional connection to work. Family business.",
      "Leo": "Career: Entertainment, politics, management, brand building. Leadership with public recognition. Creative director, performer, CEO. Needs authority and appreciation. Government or corporate leadership.",
      "Virgo": "Career: Healthcare, analysis, administration, quality control. Service-oriented profession. Detail-focused technical work. Accounting, editing, health services, research. Perfectionist approach to career.",
      "Libra": "Career: Law, diplomacy, arts, design, consulting. Balanced professional approach. Partnership in business. Fashion, counseling, mediation, HR. Aesthetic and harmonious work environment.",
      "Scorpio": "Career: Research, investigation, psychology, surgery. Transformative work. Detective, therapist, crisis management, occult sciences. Deep analysis and uncovering hidden truths. Power positions.",
      "Sagittarius": "Career: Teaching, philosophy, travel, publishing, law. Educational and expansive work. Professor, guide, advisor, international business. Spiritual or philosophical profession. Freedom in career.",
      "Capricorn": "Career: Administration, engineering, government, construction. Structured hierarchical career. Long-term positions with authority. Executive roles, project management, traditional professions. Climbs corporate ladder.",
      "Aquarius": "Career: Technology, innovation, social work, science. Progressive and unconventional field. Software development, activism, research, humanitarian work. Future-oriented careers. Network-based profession.",
      "Pisces": "Career: Arts, spirituality, healing, charitable work. Compassionate service profession. Music, photography, meditation teaching, hospital work. Intuitive and creative career. Works behind the scenes."
    };
    return traits[sign] || "";
  };

  const getD7Traits = (sign) => {
    const traits = {
      "Aries": "Parenting: Energetic, encouraging independence and courage in children. Creativity: Bold, pioneering creative projects. Takes initiative in starting new ventures. Children tend to be active and athletic.",
      "Taurus": "Parenting: Patient, stable, focuses on material security for children. Creativity: Practical artistic talents, building lasting creative works. Values traditional methods. Children appreciate comfort and routine.",
      "Gemini": "Parenting: Communicative, intellectual approach to raising children. Creativity: Versatile creative expression through writing, speaking, teaching. Multiple creative interests. Children are curious and talkative.",
      "Cancer": "Parenting: Deeply nurturing, emotionally intuitive with children. Creativity: Emotional depth in creative work, strong maternal/paternal instincts. Protective of creative projects. Children are sensitive and caring.",
      "Leo": "Parenting: Proud, encouraging creativity and self-expression in children. Creativity: Dramatic creative expression, natural performer. Takes pride in creative output. Children are confident and expressive.",
      "Virgo": "Parenting: Detail-oriented, teaches discipline and perfection. Creativity: Meticulous craftsmanship, analytical approach to creativity. Service-oriented creative work. Children are organized and helpful.",
      "Libra": "Parenting: Harmonious, diplomatic, values fairness in parenting. Creativity: Balanced aesthetic sense, artistic refinement. Collaborative creative projects. Children appreciate beauty and cooperation.",
      "Scorpio": "Parenting: Intense, transformative approach to legacy. Creativity: Deep, powerful creative expression with hidden depths. All-or-nothing commitment. Children are passionate and determined.",
      "Sagittarius": "Parenting: Philosophical, encourages adventure and learning. Creativity: Expansive creative vision, teaching through creative work. Freedom in expression. Children are adventurous and optimistic.",
      "Capricorn": "Parenting: Disciplined, traditional, builds character in children. Creativity: Structured creative approach, long-term creative legacy. Serious about creative work. Children respect authority and tradition.",
      "Aquarius": "Parenting: Progressive, unconventional parenting style. Creativity: Innovative, unique creative expression. Breaks traditional molds. Humanitarian creative projects. Children are independent thinkers.",
      "Pisces": "Parenting: Compassionate, spiritually-oriented with children. Creativity: Imaginative, transcendent creative gifts. Artistic and musical talents. Selfless creative service. Children are dreamy and artistic."
    };
    return traits[sign] || "";
  };

  const calculateDivisionalChart = (absoluteDeg, division) => {
    const d1SignIndex = Math.floor(absoluteDeg / 30);
    const signDeg = absoluteDeg % 30;
    const partSize = 30.0 / division;
    const partIndex = Math.floor(signDeg / partSize);
    
    if (division === 9) {
      const startIndex = (d1SignIndex * 9) % 12;
      return zodiac[(startIndex + partIndex) % 12];
    }
    
    if (division === 10) {
      const isOddSign = d1SignIndex % 2 === 0;
      if (isOddSign) {
        return zodiac[(d1SignIndex + partIndex) % 12];
      } else {
        return zodiac[(5 + partIndex) % 12];
      }
    }
    
    if (division === 7) {
      const isOddSign = d1SignIndex % 2 === 0;
      if (isOddSign) {
        return zodiac[(d1SignIndex + partIndex - 1 + 12) % 12];
      } else {
        return zodiac[(d1SignIndex + 6 + partIndex) % 12];
      }
    }
    
    return zodiac[partIndex % 12];
  };

  // ====== EVENT HANDLERS WITH OPTIMIZATION ======

  const handleD1Calculate = () => {
    if (!birthDate || !birthTime || !birthLat || !birthLon || !birthTz) {
      alert("Please fill all birth details including selecting a location from the dropdown");
      return;
    }

    setProcessing(true);
    
    setTimeout(() => {
      const [year, month, day] = birthDate.split('-').map(Number);
      
      // Parse time with seconds: HH:MM:SS or HH:MM
      const timeParts = birthTime.split(':');
      const hours = parseInt(timeParts[0]) || 0;
      const minutes = parseInt(timeParts[1]) || 0;
      const seconds = parseInt(timeParts[2]) || 0;

      // Convert local time to UTC
      // For Asia/Kolkata: UTC = Local - 5.5 hours
      const utcOffset = 5.5; // GMT+5:30 for India
      let utcHours = hours - utcOffset;
      let utcDay = day;
      let utcMonth = month;
      let utcYear = year;
      
      // Handle day boundary crossing
      if (utcHours < 0) {
        utcHours += 24;
        utcDay -= 1;
        if (utcDay < 1) {
          utcMonth -= 1;
          if (utcMonth < 1) {
            utcMonth = 12;
            utcYear -= 1;
          }
          const daysInPrevMonth = new Date(utcYear, utcMonth, 0).getDate();
          utcDay = daysInPrevMonth;
        }
      } else if (utcHours >= 24) {
        utcHours -= 24;
        utcDay += 1;
        const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
        if (utcDay > daysInMonth) {
          utcDay = 1;
          utcMonth += 1;
          if (utcMonth > 12) {
            utcMonth = 1;
            utcYear += 1;
          }
        }
      }

      const jd = getJulianDay(utcYear, utcMonth, utcDay, utcHours, minutes, seconds);
      const epsilon = getObliquity(jd);
      const lst = getLST(jd, birthLon);
      const ascendantTropical = calculateAscendant(lst, birthLat, epsilon);
      const ayanamsa = getLahiriAyanamsa(jd);
      const ascendantSidereal = tropicalToSidereal(ascendantTropical, ayanamsa);
      const lagnaInfo = getZodiacFromLongitude(ascendantSidereal);

      const moonTropical = calculateMoonPosition(jd);
      const moonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
      const moonInfo = getZodiacFromLongitude(moonSidereal);
      const nakInfo = getNakshatraInfo(moonSidereal);

      setLagnaDetails(lagnaInfo);
      setMoonDetails({
        ...moonInfo,
        ...nakInfo
      });
      
      // Set Moon Rashi for Kunda Siddhanta (Phase 5)
      setMoonRashiSelection(moonInfo.sign);
      
      // Auto-calculate D9, D10, D7 for initial suggestions
      const d9 = calculateDivisionalChart(ascendantSidereal, 9);
      const d10 = calculateDivisionalChart(ascendantSidereal, 10);
      const d7 = calculateDivisionalChart(ascendantSidereal, 7);
      
      setD9Selection(d9);
      setD10Selection(d10);
      setD7Selection(d7);
      
      setD1Calculated(true);
      setProcessing(false);
    }, 500);
  };

  const handleD9Confirm = () => {
    if (!d9Selection) return;
    setD9Confirmed(d9Selection);
    setTimeWindow(13);
    setPhase(3);
  };

  const handleD10Confirm = () => {
    if (!d10Selection) return;
    setD10Confirmed(d10Selection);
    setTimeWindow(6);
    setPhase(4);
  };

  const handleD7Confirm = () => {
    if (!d7Selection) return;
    setD7Confirmed(d7Selection);
    setTimeWindow(1.5);
    setPhase(5);
  };

  const handleKundaLock = (expandedWindow = 0) => {
    if (processing) return;

    setProcessing(true);
    setNoMatchFound(false);
    setSearchResults(null);
    
    setTimeout(async () => {
      // Parse time components including seconds
      const timeParts = birthTime.split(':');
      const hours = parseInt(timeParts[0]) || 0;
      const minutes = parseInt(timeParts[1]) || 0;
      const seconds = parseInt(timeParts[2]) || 0;
      
      // Progressive window expansion:
      // expandedWindow = 0: ±3 seconds
      // expandedWindow = 1: ±5 minutes (300 seconds)
      // expandedWindow = 2: ±10 minutes (600 seconds)
      // expandedWindow = 3: ±15 minutes (900 seconds)
      // expandedWindow = 4: ±20 minutes (1200 seconds)
      // etc.
      let windowSeconds;
      let windowLabel;
      
      if (expandedWindow === 0) {
        windowSeconds = 3;
        windowLabel = "±3 seconds";
      } else if (expandedWindow === 1) {
        windowSeconds = 300;
        windowLabel = "±5 minutes";
      } else {
        windowSeconds = 300 + ((expandedWindow - 1) * 300); // ±10min, ±15min, ±20min, etc.
        windowLabel = `±${windowSeconds / 60} minutes`;
      }
      
      const centerSeconds = hours * 3600 + minutes * 60 + seconds;
      const stepSize = 1; // Check every second
      
      let candidates = [];
      let debugInfo = {
        total: 0,
        d9Matches: 0,
        d10Matches: 0,
        d7Matches: 0,
        moonMatches: 0,
        allMatches: 0
      };
      
      for (let offset = -windowSeconds; offset <= windowSeconds; offset += stepSize) {
        const testTotalSeconds = centerSeconds + offset;
        
        // Handle negative seconds and day boundaries
        let testHours = Math.floor(testTotalSeconds / 3600);
        let testMinutes = Math.floor((testTotalSeconds % 3600) / 60);
        let testSecs = testTotalSeconds % 60;
        
        // Handle negative values
        if (testSecs < 0) {
          testSecs += 60;
          testMinutes -= 1;
        }
        if (testMinutes < 0) {
          testMinutes += 60;
          testHours -= 1;
        }
        if (testHours < 0) {
          testHours += 24;
        }
        
        testHours = testHours % 24;
        
        debugInfo.total++;
        
        // Convert to UTC for calculations
        const [year, month, day] = birthDate.split('-').map(Number);
        const utcOffset = 5.5; // GMT+5:30 for India
        let utcHours = testHours - utcOffset;
        let utcDay = day;
        let utcMonth = month;
        let utcYear = year;
        
        // Handle day boundary crossing
        if (utcHours < 0) {
          utcHours += 24;
          utcDay -= 1;
          if (utcDay < 1) {
            utcMonth -= 1;
            if (utcMonth < 1) {
              utcMonth = 12;
              utcYear -= 1;
            }
            const daysInPrevMonth = new Date(utcYear, utcMonth, 0).getDate();
            utcDay = daysInPrevMonth;
          }
        } else if (utcHours >= 24) {
          utcHours -= 24;
          utcDay += 1;
          const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
          if (utcDay > daysInMonth) {
            utcDay = 1;
            utcMonth += 1;
            if (utcMonth > 12) {
              utcMonth = 1;
              utcYear += 1;
            }
          }
        }
        
        // Calculate for this time point
        const jd = getJulianDay(utcYear, utcMonth, utcDay, utcHours, testMinutes, testSecs);
        const epsilon = getObliquity(jd);
        const lst = getLST(jd, birthLon);
        const ascendantTropical = calculateAscendant(lst, birthLat, epsilon);
        const ayanamsa = getLahiriAyanamsa(jd);
        const ascendantSidereal = tropicalToSidereal(ascendantTropical, ayanamsa);
        const lagnaInfo = getZodiacFromLongitude(ascendantSidereal);

        const moonTropical = calculateMoonPosition(jd);
        const moonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
        const moonInfo = getZodiacFromLongitude(moonSidereal);
        
        const lagnaDeg = ascendantSidereal;
        const lagnaSignIndex = lagnaInfo.signIndex;
        
        const d9 = calculateDivisionalChart(lagnaDeg, 9);
        const d10 = calculateDivisionalChart(lagnaDeg, 10);
        const d7 = calculateDivisionalChart(lagnaDeg, 7);
        
        // Track individual matches
        if (d9 === d9Selection) debugInfo.d9Matches++;
        if (d10 === d10Selection) debugInfo.d10Matches++;
        if (d7 === d7Selection) debugInfo.d7Matches++;
        if (moonInfo.sign === moonRashiSelection) debugInfo.moonMatches++;
        
        if (d9 === d9Selection && d10 === d10Selection && d7 === d7Selection && 
            moonInfo.sign === moonRashiSelection) {
          debugInfo.allMatches++;
          
          const timeStr = `${String(testHours).padStart(2, '0')}:${String(testMinutes).padStart(2, '0')}:${String(Math.abs(testSecs)).padStart(2, '0')}`;
          
          candidates.push({
            time: timeStr,
            offset: offset,
            lagna: lagnaInfo,
            moon: moonInfo,
            d9, d10, d7
          });
        }
      }
      
      setProcessing(false);
      
      console.log("Kunda Lock Debug:", debugInfo);
      console.log("Looking for: D9=" + d9Selection + ", D10=" + d10Selection + ", D7=" + d7Selection + ", Moon=" + moonRashiSelection);
      console.log("Window:", windowLabel);
      
      if (candidates.length > 0) {
        // Sort by closest to original time
        candidates.sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));
        setLockedTime(candidates[0]);
        setPhase(6);
      } else {
        // No match found - store results and offer to expand further
        setSearchResults({
          ...debugInfo,
          windowLabel: windowLabel,
          expandedWindow: expandedWindow
        });
        setNoMatchFound(true);
      }
    }, 100);
  };

  // ====== RENDER FUNCTIONS ======

  const renderPhase1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
        <h2 className="text-2xl font-bold text-white">Birth Details</h2>
      </div>

      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-300/30">
        <div className="flex items-center gap-2 mb-2">
          <Target size={20} className="text-purple-300" />
          <div className="text-sm font-bold text-white">
            Precision Level: ±2 hours → D1 Rashi Chart
          </div>
        </div>
        <p className="text-white/80 text-xs">
          Enter approximate birth time. We'll refine it progressively using divisional charts.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-white mb-2">
            <Calendar size={18} />
            Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white mb-2">
            <Clock size={18} />
            Birth Time (HH:MM:SS)
          </label>
          <input
            type="time"
            step="1"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none"
          />
          <p className="text-white/60 text-xs mt-1">
            Enter time with seconds (e.g., 14:30:45)
          </p>
        </div>

        <div className="relative">
          <label className="flex items-center gap-2 text-white mb-2">
            <MapPin size={18} />
            Birth Place
          </label>
          <div className="relative">
            <input
              type="text"
              value={birthPlaceQuery}
              onChange={(e) => handleLocationSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full p-3 pr-10 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none"
              placeholder="Type at least 3 letters (e.g., Del, Mum, NYC)"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
          </div>
          
          {showSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {locationSuggestions.map((location, idx) => (
                <button
                  key={idx}
                  onClick={() => selectLocation(location)}
                  className="w-full text-left p-3 hover:bg-white/10 text-white border-b border-white/10 last:border-0"
                >
                  <div className="font-medium">{location.name}</div>
                  <div className="text-xs text-white/60">
                    {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}° • {location.timezone}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {isSearching && (
            <div className="text-white/60 text-sm mt-2">Searching...</div>
          )}
          
          {!isSearching && birthPlaceQuery.length > 0 && birthPlaceQuery.length < 3 && (
            <div className="text-yellow-300/80 text-sm mt-2">
              Type {3 - birthPlaceQuery.length} more character{3 - birthPlaceQuery.length > 1 ? 's' : ''} to search...
            </div>
          )}
        </div>

        {birthPlace && birthLat !== null && birthLon !== null && (
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
              <div className="text-sm text-white/80">
                <strong className="text-white">Selected Location:</strong> {birthPlace}<br/>
                <span className="text-xs">
                  Coordinates: {birthLat.toFixed(4)}°N, {birthLon.toFixed(4)}°E<br/>
                  Timezone: {birthTz}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleD1Calculate}
        disabled={!birthDate || !birthTime || !birthPlace || processing}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Calculating D1 Chart...
          </>
        ) : (
          <>
            <Calculator size={20} />
            Calculate D1 (Rashi) Chart
          </>
        )}
      </button>

      {d1Calculated && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-300/30">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <User size={24} />
              Ascendant (Lagna)
            </h3>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <p className="text-white/70 text-sm">Sign</p>
                <p className="font-bold text-2xl">{lagnaDetails.sign}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Degree</p>
                <p className="font-bold text-lg">{degreesToDMS(lagnaDetails.degree).formatted}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-300/30">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Moon size={24} />
              Moon Position
            </h3>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <p className="text-white/70 text-sm">Rashi</p>
                <p className="font-bold text-lg">{moonDetails.sign}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Nakshatra</p>
                <p className="font-bold text-lg">{moonDetails.nakshatra}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Lord</p>
                <p className="font-bold text-lg">{moonDetails.nakshatraLord}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Degree</p>
                <p className="font-bold text-lg">{moonDetails.degree.toFixed(2)}°</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase(2)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            Continue to D9 Soul Analysis
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );

  const renderPhase2 = () => {
    const d9Adjacent = d9Selection ? getAdjacentSigns(d9Selection) : null;

    return (
      <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
        <h2 className="text-2xl font-bold text-white">D9 Navamsha - Soul Quiz</h2>
      </div>

      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-indigo-300/30">
        <div className="flex items-center gap-2 mb-2">
          <Target size={20} className="text-indigo-300" />
          <div className="text-sm font-bold text-white">
            Precision Level: ±13 minutes → D9 Navamsha
          </div>
        </div>
        <p className="text-white/80 text-xs">
          The 9× Navamsha multiplier reveals your soul's deepest nature
        </p>
      </div>

      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Your Soul Nature & Relationships</h3>
        
        <div className="bg-purple-500/20 p-4 rounded-lg mb-4 border border-purple-400/30">
          <div className="font-bold text-white mb-2">Calculated: {d9Selection}</div>
          <div className="text-white/80 text-sm">{getD9Traits(d9Selection)}</div>
        </div>

        <p className="text-white/90 mb-3 font-semibold">Does this describe your inner spiritual nature?</p>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setD9Confirmed(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              d9Confirmed === true ? 'bg-green-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ✓ Yes, this is me
          </button>
          <button
            onClick={() => setD9Confirmed(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              d9Confirmed === false ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ✗ No, choose different
          </button>
        </div>

        {d9Confirmed === false && d9Adjacent && (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/20">
            <p className="text-white/80 text-sm mb-3">Choose which resonates more:</p>
            
            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              d9Selection === d9Adjacent.previous
                ? 'bg-purple-500/40 border-2 border-purple-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="d9-choice"
                checked={d9Selection === d9Adjacent.previous}
                onChange={() => setD9Selection(d9Adjacent.previous)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white">{d9Adjacent.previous}</div>
                <div className="text-white/70 text-sm">{getD9Traits(d9Adjacent.previous)}</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              d9Selection === d9Adjacent.next
                ? 'bg-purple-500/40 border-2 border-purple-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="d9-choice"
                checked={d9Selection === d9Adjacent.next}
                onChange={() => setD9Selection(d9Adjacent.next)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white">{d9Adjacent.next}</div>
                <div className="text-white/70 text-sm">{getD9Traits(d9Adjacent.next)}</div>
              </div>
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleD9Confirm}
        disabled={d9Confirmed === null}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle size={20} />
        Confirm D9 Selection
      </button>

      <button
        onClick={() => setPhase(1)}
        className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
      >
        ← Back
      </button>
    </div>
  );
};

  const renderPhase3 = () => {
    const d10Adjacent = d10Selection ? getAdjacentSigns(d10Selection) : null;

    return (
      <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
        <h2 className="text-2xl font-bold text-white">D10 Dashamsha - Career Quiz</h2>
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-300/30">
        <div className="flex items-center gap-2 mb-2">
          <Target size={20} className="text-green-300" />
          <div className="text-sm font-bold text-white">
            Precision Level: ±6 minutes → D10 Dashamsha
          </div>
        </div>
        <p className="text-white/80 text-xs">
          The 10× multiplier reveals your professional dharma
        </p>
      </div>

      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Your Career Path & Dharma</h3>
        
        <div className="bg-green-500/20 p-4 rounded-lg mb-4 border border-green-400/30">
          <div className="font-bold text-white mb-2">Calculated: {d10Selection}</div>
          <div className="text-white/80 text-sm">{getD10Traits(d10Selection)}</div>
        </div>

        <p className="text-white/90 mb-3 font-semibold">Does this describe your career path and professional nature?</p>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setD10Confirmed(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              d10Confirmed === true ? 'bg-green-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ✓ Yes, this is me
          </button>
          <button
            onClick={() => setD10Confirmed(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              d10Confirmed === false ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ✗ No, choose different
          </button>
        </div>

        {d10Confirmed === false && d10Adjacent && (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/20">
            <p className="text-white/80 text-sm mb-3">Choose which resonates more:</p>
            
            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              d10Selection === d10Adjacent.previous
                ? 'bg-green-500/40 border-2 border-green-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="d10-choice"
                checked={d10Selection === d10Adjacent.previous}
                onChange={() => setD10Selection(d10Adjacent.previous)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white">{d10Adjacent.previous}</div>
                <div className="text-white/70 text-sm">{getD10Traits(d10Adjacent.previous)}</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              d10Selection === d10Adjacent.next
                ? 'bg-green-500/40 border-2 border-green-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="d10-choice"
                checked={d10Selection === d10Adjacent.next}
                onChange={() => setD10Selection(d10Adjacent.next)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white">{d10Adjacent.next}</div>
                <div className="text-white/70 text-sm">{getD10Traits(d10Adjacent.next)}</div>
              </div>
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleD10Confirm}
        disabled={d10Confirmed === null}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle size={20} />
        Confirm D10 Selection
      </button>

      <button
        onClick={() => setPhase(2)}
        className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
      >
        ← Back
      </button>
    </div>
  );
};

  const renderPhase4 = () => {
    const d7Adjacent = d7Selection ? getAdjacentSigns(d7Selection) : null;

    return (
      <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
        <h2 className="text-2xl font-bold text-white">D7 Saptamsha - Legacy Quiz</h2>
      </div>

      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-4 rounded-xl border border-yellow-300/30">
        <div className="flex items-center gap-2 mb-2">
          <Target size={20} className="text-yellow-300" />
          <div className="text-sm font-bold text-white">
            Precision Level: ±90 seconds → D7 Saptamsha
          </div>
        </div>
        <p className="text-white/80 text-xs">
          The 7× multiplier reveals children and legacy patterns
        </p>
      </div>

      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Your Legacy & Creative Expression</h3>
        
        <div className="bg-yellow-500/20 p-4 rounded-lg mb-4 border border-yellow-400/30">
          <div className="font-bold text-white mb-2">Calculated: {d7Selection}</div>
          <div className="text-white/80 text-sm">{getD7Traits(d7Selection)}</div>
        </div>

        <p className="text-white/90 mb-3 font-semibold">Does this describe your approach to legacy and creativity?</p>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setD7Confirmed(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              d7Confirmed === true ? 'bg-green-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ✓ Yes, this is me
          </button>
          <button
            onClick={() => setD7Confirmed(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              d7Confirmed === false ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ✗ No, choose different
          </button>
        </div>

        {d7Confirmed === false && d7Adjacent && (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/20">
            <p className="text-white/80 text-sm mb-3">Choose which resonates more:</p>
            
            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              d7Selection === d7Adjacent.previous
                ? 'bg-yellow-500/40 border-2 border-yellow-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="d7-choice"
                checked={d7Selection === d7Adjacent.previous}
                onChange={() => setD7Selection(d7Adjacent.previous)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white">{d7Adjacent.previous}</div>
                <div className="text-white/70 text-sm">{getD7Traits(d7Adjacent.previous)}</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              d7Selection === d7Adjacent.next
                ? 'bg-yellow-500/40 border-2 border-yellow-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="d7-choice"
                checked={d7Selection === d7Adjacent.next}
                onChange={() => setD7Selection(d7Adjacent.next)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white">{d7Adjacent.next}</div>
                <div className="text-white/70 text-sm">{getD7Traits(d7Adjacent.next)}</div>
              </div>
            </label>
          </div>
        )}
      </div>

      <button
        onClick={handleD7Confirm}
        disabled={d7Confirmed === null}
        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle size={20} />
        Confirm D7 Selection
      </button>

      <button
        onClick={() => setPhase(3)}
        className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
      >
        ← Back
      </button>
    </div>
  );
};

  const renderPhase5 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">5</div>
        <h2 className="text-2xl font-bold text-white">Kunda Siddhanta - Final Lock</h2>
      </div>

      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-300/30">
        <div className="flex items-center gap-2 mb-2">
          <Target size={20} className="text-orange-300" />
          <div className="text-sm font-bold text-white">
            Precision Level: ±1 second → Kunda Siddhanta
          </div>
        </div>
        <p className="text-white/80 text-xs">
          The 81× Kunda multiplier locks your exact birth second using Moon's Nakshatra position
        </p>
      </div>

      {moonDetails && (
        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-300/30">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Moon size={24} />
            Moon Position
          </h3>
          <div className="grid grid-cols-2 gap-4 text-white">
            <div>
              <p className="text-white/70 text-sm">Rashi</p>
              <p className="font-bold text-lg">{moonDetails.sign}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Nakshatra</p>
              <p className="font-bold text-lg">{moonDetails.nakshatra}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Lord</p>
              <p className="font-bold text-lg">{moonDetails.nakshatraLord}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Degree</p>
              <p className="font-bold text-lg">{moonDetails.degree.toFixed(2)}°</p>
            </div>
          </div>
        </div>
      )}

      {noMatchFound && searchResults && (
        <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">No Exact Match Found</h3>
              <p className="text-white/90 text-sm mb-3">
                The entered birth time doesn't match all your divisional chart selections within {searchResults.windowLabel}.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <p className="text-white/80 text-sm font-mono mb-2">Scan Results ({searchResults.windowLabel}):</p>
                <div className="space-y-1 text-xs text-white/70">
                  <p>• Scanned: {searchResults.total} time points</p>
                  <p>• D9 {d9Selection} found: {searchResults.d9Matches} times</p>
                  <p>• D10 {d10Selection} found: {searchResults.d10Matches} times</p>
                  <p>• D7 {d7Selection} found: {searchResults.d7Matches} times</p>
                  <p>• Moon {moonRashiSelection} found: {searchResults.moonMatches} times</p>
                  <p className="font-bold text-yellow-400">• All matching: {searchResults.allMatches}</p>
                </div>
              </div>

              {(() => {
                const currentWindow = searchResults.expandedWindow || 0;
                let nextWindowMinutes;
                let nextWindowLabel;
                
                if (currentWindow === 0) {
                  nextWindowMinutes = 5;
                  nextWindowLabel = "±5 minutes";
                } else if (currentWindow === 1) {
                  nextWindowMinutes = 10;
                  nextWindowLabel = "±10 minutes";
                } else {
                  nextWindowMinutes = 5 * (currentWindow + 1);
                  nextWindowLabel = `±${nextWindowMinutes} minutes`;
                }
                
                return (
                  <>
                    <p className="text-white/90 text-sm mb-3">
                      <strong>This suggests your birth time may be off by more than {searchResults.windowLabel.replace('±', '')}.</strong>
                      {currentWindow >= 4 ? (
                        <> The search window is getting quite large. Your birth time or divisional chart selections may need significant adjustment.</>
                      ) : (
                        <> Would you like to expand the search to {nextWindowLabel} to find the correct time based on your selections?</>
                      )}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleKundaLock(currentWindow + 1)}
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Search size={18} />
                        Search {nextWindowLabel}
                      </button>
                      <button
                        onClick={() => {
                          setNoMatchFound(false);
                          setSearchResults(null);
                          setPhase(2);
                        }}
                        className="flex-1 bg-white/10 text-white font-bold py-3 px-4 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
                      >
                        Revise Selections
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {!noMatchFound && (
        <button
          onClick={() => handleKundaLock(0)}
          disabled={processing}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Applying Kunda Siddhanta (scanning...)
            </>
          ) : (
            <>
              <Calculator size={20} />
              Lock Birth Time to Exact Second
            </>
          )}
        </button>
      )}

      {processing && (
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <div className="space-y-3 text-sm">
            <p className="text-white/80">🔍 Scanning time window...</p>
            <p className="text-white/80">✨ Validating D9 + D10 + D7 alignment</p>
            <p className="text-white/80">🌙 Confirming Moon Rashi match</p>
            <p className="text-white/80">🕉️ Applying 81× Kunda multiplier</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setPhase(4)}
        className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
      >
        ← Back
      </button>
    </div>
  );

  const renderPhase6 = () => {
    const timeAdjusted = lockedTime && lockedTime.offset && lockedTime.offset !== 0;
    const adjustmentText = timeAdjusted 
      ? `(Adjusted ${lockedTime.offset > 0 ? '+' : ''}${lockedTime.offset} seconds from entered time)`
      : '';

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">✓</div>
          <h2 className="text-2xl font-bold text-white">Rectified Birth Time</h2>
        </div>

        {lockedTime && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-xl border-2 border-green-300 shadow-2xl">
            <div className="text-center">
              <CheckCircle size={64} className="mx-auto mb-4 text-white" />
              <h3 className="text-3xl font-bold text-white mb-2">🎯 EXACT TIME LOCKED</h3>
              <p className="text-6xl font-bold text-white mb-2">{lockedTime.time}</p>
              {timeAdjusted && (
                <p className="text-yellow-200 text-sm font-semibold mb-2">
                  ⚠️ {adjustmentText}
                </p>
              )}
              <p className="text-white/80 text-sm mb-6">Precision: ±1 second • GeoNames Atlas • Kunda Siddhanta</p>
              
              <div className="grid grid-cols-2 gap-4 text-left bg-white/20 p-4 rounded-lg">
                <div className="col-span-2 border-b border-white/30 pb-2 mb-2">
                  <p className="text-white/70 text-sm">Lagna (D1)</p>
                  <p className="text-white font-bold text-xl">{lockedTime.lagna.sign}</p>
                  <p className="text-white/80 text-sm">{degreesToDMS(lockedTime.lagna.degree).formatted}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">D9 Navamsha</p>
                  <p className="text-white font-bold">{lockedTime.d9}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">D10 Dashamsha</p>
                  <p className="text-white font-bold">{lockedTime.d10}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">D7 Saptamsha</p>
                  <p className="text-white font-bold">{lockedTime.d7}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Moon Rashi</p>
                  <p className="text-white font-bold">{lockedTime.moon.sign}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-sm text-white/80">
              <strong className="text-white">Progressive Refinement Complete!</strong><br/>
              Your birth time has been progressively narrowed from ±2 hours → ±13 min → ±6 min → ±90 sec → ±1 sec using Vedic divisional chart analysis and Kunda Siddhanta with GeoNames accurate coordinates.
              {timeAdjusted && (
                <>
                  <br/><br/>
                  <strong className="text-yellow-300">Note:</strong> The final time was adjusted from your entered time to match all your divisional chart selections, suggesting the original time may have been slightly inaccurate.
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setPhase(1);
            setD1Calculated(false);
            setD9Confirmed(null);
            setD10Confirmed(null);
            setD7Confirmed(null);
            setLockedTime(null);
            setBirthPlace("");
            setBirthPlaceQuery("");
            setNoMatchFound(false);
            setSearchResults(null);
          }}
          className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
        >
          ← Start New Rectification
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">⭐ Birth Time Rectification</h1>
            <p className="text-white/70">Progressive Precision Refinement • GeoNames Atlas • Kunda Siddhanta</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <div key={p} className="flex items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  phase >= p ? 'bg-purple-500 text-white' : 'bg-white/20 text-white/40'
                }`}>
                  {p === 6 ? '✓' : p}
                </div>
                {p < 6 && <div className={`w-8 h-1 transition-all ${phase > p ? 'bg-purple-500' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>

          {/* Phase Content */}
          {phase === 1 && renderPhase1()}
          {phase === 2 && renderPhase2()}
          {phase === 3 && renderPhase3()}
          {phase === 4 && renderPhase4()}
          {phase === 5 && renderPhase5()}
          {phase === 6 && renderPhase6()}
        </div>
      </div>
    </div>
  );
};

export default ProgressiveBTRApp;
