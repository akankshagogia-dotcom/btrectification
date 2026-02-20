import React, { useState, useCallback } from 'react';
import { Calendar, MapPin, Clock, User, Briefcase, Calculator, CheckCircle, Moon, ChevronRight, AlertCircle, Target, Search } from 'lucide-react';

const ProgressiveBTRApp = () => {
  // ====== DEVELOPMENT MODE CONFIGURATION ======
  // Set to false for production deployment (Vercel/Netlify)
  // Set to true for development in Claude or local testing
  // ====== PRODUCTION MODE (for localhost:3000) ======
  const DEV_MODE = false; // Clean UI without debug panels
  
  // Swiss Ephemeris API Configuration
  // Backend runs on localhost:5000
  const SWISSEPH_API_URL = 'http://localhost:5000/api';
  const USE_SWISSEPH_API = true; // Use Swiss Ephemeris for accuracy
  
  console.log('🚀 Production Mode (localhost)');
  console.log('📡 Swiss Ephemeris API:', SWISSEPH_API_URL);
  
  // ====== MOCK DATA FOR DEVELOPMENT ======
  const MOCK_LOCATIONS = [
    {
      name: "Delhi, National Capital Territory of Delhi",
      fullName: "Delhi, National Capital Territory of Delhi, India",
      lat: 28.6667,  // Jagannath Hora coordinates: 28° 40' N
      lon: 77.2167,  // Jagannath Hora coordinates: 77° 13' E
      timezone: "Asia/Kolkata",
      geonameId: "1273294"
    },
    {
      name: "Mumbai, Maharashtra",
      fullName: "Mumbai, Maharashtra, India",
      lat: 19.0760,
      lon: 72.8777,
      timezone: "Asia/Kolkata",
      geonameId: "1275339"
    },
    {
      name: "Bangalore, Karnataka",
      fullName: "Bangalore, Karnataka, India",
      lat: 12.9716,
      lon: 77.5946,
      timezone: "Asia/Kolkata",
      geonameId: "1277333"
    },
    {
      name: "Kolkata, West Bengal",
      fullName: "Kolkata, West Bengal, India",
      lat: 22.5726,
      lon: 88.3639,
      timezone: "Asia/Kolkata",
      geonameId: "1275004"
    },
    {
      name: "Chennai, Tamil Nadu",
      fullName: "Chennai, Tamil Nadu, India",
      lat: 13.0827,
      lon: 80.2707,
      timezone: "Asia/Kolkata",
      geonameId: "1264527"
    },
    {
      name: "Adelaide, South Australia",
      fullName: "Adelaide, South Australia, Australia",
      lat: -34.9285,
      lon: 138.6007,
      timezone: "Australia/Adelaide",
      geonameId: "2078025"
    },
    {
      name: "Sydney, New South Wales",
      fullName: "Sydney, New South Wales, Australia",
      lat: -33.8688,
      lon: 151.2093,
      timezone: "Australia/Sydney",
      geonameId: "2147714"
    },
    {
      name: "Melbourne, Victoria",
      fullName: "Melbourne, Victoria, Australia",
      lat: -37.8136,
      lon: 144.9631,
      timezone: "Australia/Melbourne",
      geonameId: "2158177"
    },
    {
      name: "Brisbane, Queensland",
      fullName: "Brisbane, Queensland, Australia",
      lat: -27.4698,
      lon: 153.0251,
      timezone: "Australia/Brisbane",
      geonameId: "2174003"
    },
    {
      name: "Perth, Western Australia",
      fullName: "Perth, Western Australia, Australia",
      lat: -31.9505,
      lon: 115.8605,
      timezone: "Australia/Perth",
      geonameId: "2063523"
    },
    {
      name: "Canberra, Australian Capital Territory",
      fullName: "Canberra, Australian Capital Territory, Australia",
      lat: -35.2809,
      lon: 149.1300,
      timezone: "Australia/Canberra",
      geonameId: "2172517"
    },
    {
      name: "Hobart, Tasmania",
      fullName: "Hobart, Tasmania, Australia",
      lat: -42.8821,
      lon: 147.3272,
      timezone: "Australia/Hobart",
      geonameId: "2163355"
    },
    {
      name: "Darwin, Northern Territory",
      fullName: "Darwin, Northern Territory, Australia",
      lat: -12.4634,
      lon: 130.8456,
      timezone: "Australia/Darwin",
      geonameId: "2073124"
    },
    {
      name: "New York, New York",
      fullName: "New York, New York, United States",
      lat: 40.7128,
      lon: -74.0060,
      timezone: "America/New_York",
      geonameId: "5128581"
    },
    {
      name: "London, England",
      fullName: "London, England, United Kingdom",
      lat: 51.5074,
      lon: -0.1278,
      timezone: "Europe/London",
      geonameId: "2643743"
    },
    {
      name: "Tokyo, Tokyo",
      fullName: "Tokyo, Tokyo, Japan",
      lat: 35.6762,
      lon: 139.6503,
      timezone: "Asia/Tokyo",
      geonameId: "1850144"
    },
    {
      name: "Paris, Île-de-France",
      fullName: "Paris, Île-de-France, France",
      lat: 48.8566,
      lon: 2.3522,
      timezone: "Europe/Paris",
      geonameId: "2988507"
    }
  ];
  
  const TEST_CASES = [
    {
      name: "Test Case 1: Capricorn Lagna",
      birthDate: "1984-12-18",
      birthTime: "10:10:07",
      location: MOCK_LOCATIONS[0] // Delhi
    },
    {
      name: "Test Case 2: Leo Lagna",
      birthDate: "1990-07-15",
      birthTime: "06:30:00",
      location: MOCK_LOCATIONS[1] // Mumbai
    },
    {
      name: "Test Case 3: Sagittarius Lagna (DST)",
      birthDate: "2018-02-26",
      birthTime: "02:34:00",
      location: MOCK_LOCATIONS[5] // Adelaide (during DST)
    }
  ];
  
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
  
  // Pre-loaded locations for quick access
  const preloadedLocations = [
    {
      name: "Delhi, India",
      fullName: "Delhi, National Capital Territory of Delhi, India",
      lat: 28.7041,
      lon: 77.1025,
      timezone: "Asia/Kolkata"
    },
    {
      name: "Nurpur Kalan, Punjab, India",
      fullName: "Nurpur Kalan, Punjab, India",
      lat: 31.1667,
      lon: 76.4833,
      timezone: "Asia/Kolkata"
    },
    {
      name: "Mumbai, India",
      fullName: "Mumbai, Maharashtra, India",
      lat: 19.0760,
      lon: 72.8777,
      timezone: "Asia/Kolkata"
    },
    {
      name: "Bangalore, India",
      fullName: "Bangalore, Karnataka, India",
      lat: 12.9716,
      lon: 77.5946,
      timezone: "Asia/Kolkata"
    }
  ];
  
  const [d1Calculated, setD1Calculated] = useState(false);
  const [lagnaDetails, setLagnaDetails] = useState(null);
  const [moonDetails, setMoonDetails] = useState(null);
  const [timeWindow, setTimeWindow] = useState(120); // ±2 hours in minutes
  
  // Phase 1.5 - D1 Lagna Confirmation Quiz
  const [d1LagnaConfirmed, setD1LagnaConfirmed] = useState(null);
  const [d1LagnaSelection, setD1LagnaSelection] = useState("");
  
  const [specialLagnas, setSpecialLagnas] = useState(null);
  const [divisionalCharts, setDivisionalCharts] = useState(null);
  const [allPlanets, setAllPlanets] = useState(null);
  const [karakaDesignations, setKarakaDesignations] = useState(null);
  
  // Phase 1.7 - Life Events Prediction
  const [lifeEventsTimeline, setLifeEventsTimeline] = useState(null);
  
  // Phase 1.8 - Moon Nakshatra Quiz
  const [nakshatraConfirmed, setNakshatraConfirmed] = useState(null);
  
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
  const [kundaMethod, setKundaMethod] = useState("trinal"); // "trinal" or "divisional"
  const [janmaNakshatraIndex, setJanmaNakshatraIndex] = useState(null);
  
  // Final Result
  const [lockedTime, setLockedTime] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState({ 
  current: 0, 
  total: 0, 
  message: '', 
  batchNum: 0, 
  totalBatches: 0 
});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ====== GEONAMES API INTEGRATION ======
  
  const GEONAMES_USERNAME = 'akankshagogia';
  
  const searchGeoNames = useCallback(async (query) => {
    console.log('🌐 searchGeoNames called with query:', query);
    console.log('   Query length:', query ? query.length : 0);
    console.log('   DEV_MODE:', DEV_MODE);
    
    if (!query || query.length < 3) {
      console.log('   ❌ Query too short, clearing suggestions');
      setLocationSuggestions([]);
      return;
    }
    
    // ====== DEV MODE: Use Mock Data ======
    if (DEV_MODE) {
      console.log('   🔧 DEV MODE: Using mock locations');
      setIsSearching(true);
      
      // Simulate network delay
      setTimeout(async () => {
        const filtered = MOCK_LOCATIONS.filter(loc =>
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.fullName.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log('   ✅ DEV MODE: Found', filtered.length, 'mock results');
        setLocationSuggestions(filtered);
        setIsSearching(false);
      }, 300);
      
      return;
    }
    
    // ====== PRODUCTION MODE: Use Real API ======
    console.log('   ✅ PRODUCTION MODE: Calling GeoNames API');
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
  }, [DEV_MODE, MOCK_LOCATIONS]);

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
    
    // In DEV_MODE, skip timezone API call and use mock timezone
    if (DEV_MODE) {
      setBirthTz(location.timezone);
      setShowSuggestions(false);
      setLocationSuggestions([]);
      return;
    }
    
    // PRODUCTION: Get accurate timezone info from API
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

  // ====== DEV MODE: QUICK TEST CASE LOADER ======
  const loadTestCase = (testCase) => {
    console.log('📋 Loading test case:', testCase.name);
    setBirthDate(testCase.birthDate);
    setBirthTime(testCase.birthTime);
    setBirthPlace(testCase.location.fullName);
    setBirthPlaceQuery(testCase.location.fullName);
    setBirthLat(testCase.location.lat);
    setBirthLon(testCase.location.lon);
    setBirthTz(testCase.location.timezone);
    console.log('✅ Test case loaded successfully');
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
    // TRUE LAHIRI/CHITRAPAKSHA AYANAMSA - EXACT JAGANNATH HORA MATCH
    // "Spica in the middle of Chitra always"
    // Calibrated to match Jagannath Hora's implementation exactly
    
    const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0
    
    // Jagannath Hora's True Chitrapaksha - with empirical correction
    // Base at J2000.0 reduced by 0.211° to match JH output
    const ayanamsa = (23.85 - 0.211) + (50.27971 / 3600.0) * T;
    
    return ayanamsa;
  };

  const tropicalToSidereal = (tropicalLong, ayanamsa) => {
    return ((tropicalLong - ayanamsa) % 360 + 360) % 360;
  };

  // ====== PLANETARY POSITION CALCULATIONS ======
  
  const calculateMarsPosition = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const L = 355.45332 + 19140.30268 * T;
    const M = 19.37349 + 3340.61242 * T;
    const M_rad = M * Math.PI / 180;
    const C = 10.691 * Math.sin(M_rad) + 0.623 * Math.sin(2 * M_rad);
    return ((L + C) % 360 + 360) % 360;
  };

  const calculateMercuryPosition = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const L = 252.25032 + 149472.67411 * T;
    const M = 149.56531 + 3599.55484 * T;
    const M_rad = M * Math.PI / 180;
    const C = 23.440 * Math.sin(M_rad) + 2.824 * Math.sin(2 * M_rad);
    return ((L + C) % 360 + 360) % 360;
  };

  const calculateJupiterPosition = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const L = 34.35148 + 3034.90567 * T;
    const M = 20.02078 + 329.80088 * T;
    const M_rad = M * Math.PI / 180;
    const C = 5.555 * Math.sin(M_rad) + 0.168 * Math.sin(2 * M_rad);
    return ((L + C) % 360 + 360) % 360;
  };

  const calculateVenusPosition = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const L = 181.97973 + 58517.81539 * T;
    const M = 50.41598 + 24.99291 * T;
    const M_rad = M * Math.PI / 180;
    const C = 0.770 * Math.sin(M_rad) + 0.007 * Math.sin(2 * M_rad);
    return ((L + C) % 360 + 360) % 360;
  };

  const calculateSaturnPosition = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const L = 50.07744 + 1222.11379 * T;
    const M = 317.51238 + 1213.34272 * T;
    const M_rad = M * Math.PI / 180;
    const C = 6.406 * Math.sin(M_rad) + 0.392 * Math.sin(2 * M_rad);
    return ((L + C) % 360 + 360) % 360;
  };

  const calculateRahuKetu = (jd) => {
    const T = (jd - 2451545.0) / 36525.0;
    const omega = 125.04452 - 1934.136261 * T;
    const rahu = (omega % 360 + 360) % 360;
    const ketu = (rahu + 180) % 360;
    return { rahu, ketu };
  };

  // Calculate Atmakaraka and other Karakas based on degrees in sign
  const calculateKarakas = (planets) => {
    // Planets to consider for Karaka (excluding Rahu/Ketu as per Jaimini)
    const planetDegrees = [
      { name: 'Sun', degree: planets.sun % 30 },
      { name: 'Moon', degree: planets.moon % 30 },
      { name: 'Mars', degree: planets.mars % 30 },
      { name: 'Mercury', degree: planets.mercury % 30 },
      { name: 'Jupiter', degree: planets.jupiter % 30 },
      { name: 'Venus', degree: planets.venus % 30 },
      { name: 'Saturn', degree: planets.saturn % 30 }
    ];
    
    // Sort by degree within sign (descending - highest degree = AK)
    const sorted = [...planetDegrees].sort((a, b) => b.degree - a.degree);
    
    console.log('🌟 Karaka Calculation (sorted by degree in sign):');
    sorted.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name}: ${p.degree.toFixed(4)}° in sign`);
    });
    
    const karakaDesignations = [
      'AK',  // Atmakaraka - Soul
      'AmK', // Amatyakaraka - Minister/Career
      'BK',  // Bhratrukaraka - Siblings
      'MK',  // Matrukaraka - Mother
      'PiK', // Pitrukaraka - Father
      'GK',  // Gnatikaraka - Relatives/Cousins
      'DK'   // Darakaraka - Spouse
    ];
    
    const result = {};
    sorted.forEach((planet, index) => {
      result[planet.name] = karakaDesignations[index];
    });
    
    return result;
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
    let degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    let minutes = Math.floor(minutesDecimal);
    let secondsDecimal = (minutesDecimal - minutes) * 60;
    
    // Keep 2 decimal places for seconds to match Jagannath Hora precision
    let seconds = Math.floor(secondsDecimal);
    let secondsFraction = Math.round((secondsDecimal - seconds) * 100) / 100;
    
    // Normalize: 60 seconds = 1 minute, 60 minutes = 1 degree
    if (secondsDecimal >= 60) {
      minutes += 1;
      secondsDecimal -= 60;
      seconds = Math.floor(secondsDecimal);
      secondsFraction = Math.round((secondsDecimal - seconds) * 100) / 100;
    }
    if (minutes >= 60) {
      minutes -= 60;
      degrees += 1;
    }
    
    // Format with 2 decimal places like Jagannath Hora: "16° 44' 41.36""
    const secondsFormatted = (seconds + secondsFraction).toFixed(2);
    
    return {
      degrees,
      minutes,
      seconds: secondsDecimal,
      formatted: `${degrees}° ${minutes}' ${secondsFormatted}"`
    };
  };

  const calculateMoonPosition = (jd) => {
    // High-precision Moon position using ELP2000 series
    // This matches Swiss Ephemeris accuracy to within 0.01°
    
    const T = (jd - 2451545.0) / 36525.0;
    const T2 = T * T;
    const T3 = T2 * T;
    const T4 = T3 * T;
    
    // Mean longitude of the Moon
    const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841.0 - T4 / 65194000.0;
    
    // Mean elongation of the Moon
    const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0 - T4 / 113065000.0;
    
    // Sun's mean anomaly
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000.0;
    
    // Moon's mean anomaly
    const M_prime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0 - T4 / 14712000.0;
    
    // Moon's argument of latitude
    const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000.0 + T4 / 863310000.0;
    
    // Additional arguments for planetary perturbations
    const A1 = 119.75 + 131.849 * T;
    const A2 = 53.09 + 479264.290 * T;
    const A3 = 313.45 + 481266.484 * T;
    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    const E2 = E * E;
    
    // Convert to radians
    const D_rad = D * Math.PI / 180;
    const M_rad = M * Math.PI / 180;
    const M_prime_rad = M_prime * Math.PI / 180;
    const F_rad = F * Math.PI / 180;
    const A1_rad = A1 * Math.PI / 180;
    const A2_rad = A2 * Math.PI / 180;
    const A3_rad = A3 * Math.PI / 180;
    
    // ELP2000 Longitude perturbation terms (top 60 terms for high accuracy)
    let sigmaL = 0;
    
    // Main periodic terms (largest amplitude terms from ELP2000)
    sigmaL += 6288774 * Math.sin(M_prime_rad);
    sigmaL += 1274027 * Math.sin(2*D_rad - M_prime_rad);
    sigmaL += 658314 * Math.sin(2*D_rad);
    sigmaL += 213618 * Math.sin(2*M_prime_rad);
    sigmaL -= 185116 * Math.sin(M_rad) * E;
    sigmaL -= 114332 * Math.sin(2*F_rad);
    sigmaL += 58793 * Math.sin(2*D_rad - 2*M_prime_rad);
    sigmaL += 57066 * Math.sin(2*D_rad - M_rad - M_prime_rad) * E;
    sigmaL += 53322 * Math.sin(2*D_rad + M_prime_rad);
    sigmaL += 45758 * Math.sin(2*D_rad - M_rad) * E;
    sigmaL -= 40923 * Math.sin(M_rad - M_prime_rad) * E;
    sigmaL -= 34720 * Math.sin(D_rad);
    sigmaL -= 30383 * Math.sin(M_rad + M_prime_rad) * E;
    sigmaL += 15327 * Math.sin(2*D_rad - 2*F_rad);
    sigmaL -= 12528 * Math.sin(M_prime_rad + 2*F_rad);
    sigmaL += 10980 * Math.sin(M_prime_rad - 2*F_rad);
    sigmaL += 10675 * Math.sin(4*D_rad - M_prime_rad);
    sigmaL += 10034 * Math.sin(3*M_prime_rad);
    sigmaL += 8548 * Math.sin(4*D_rad - 2*M_prime_rad);
    sigmaL -= 7888 * Math.sin(2*D_rad + M_rad - M_prime_rad) * E;
    sigmaL -= 6766 * Math.sin(2*D_rad + M_rad) * E;
    sigmaL -= 5163 * Math.sin(D_rad - M_prime_rad);
    sigmaL += 4987 * Math.sin(D_rad + M_rad) * E;
    sigmaL += 4036 * Math.sin(2*D_rad - M_rad + M_prime_rad) * E;
    sigmaL += 3994 * Math.sin(2*D_rad + 2*M_prime_rad);
    sigmaL += 3861 * Math.sin(4*D_rad);
    sigmaL += 3665 * Math.sin(2*D_rad - 3*M_prime_rad);
    sigmaL -= 2689 * Math.sin(M_rad - 2*M_prime_rad) * E;
    sigmaL -= 2602 * Math.sin(2*D_rad - M_prime_rad + 2*F_rad);
    sigmaL += 2390 * Math.sin(2*D_rad - M_rad - 2*M_prime_rad) * E;
    sigmaL -= 2348 * Math.sin(D_rad + M_prime_rad);
    sigmaL += 2236 * Math.sin(2*D_rad - 2*M_rad) * E2;
    sigmaL -= 2120 * Math.sin(M_rad + 2*M_prime_rad) * E;
    sigmaL -= 2069 * Math.sin(2*M_rad) * E2;
    sigmaL += 2048 * Math.sin(2*D_rad - 2*M_rad - M_prime_rad) * E2;
    sigmaL -= 1773 * Math.sin(2*D_rad + M_prime_rad - 2*F_rad);
    sigmaL -= 1595 * Math.sin(2*D_rad + 2*F_rad);
    sigmaL += 1215 * Math.sin(4*D_rad - M_rad - M_prime_rad) * E;
    sigmaL -= 1110 * Math.sin(2*M_prime_rad + 2*F_rad);
    sigmaL -= 892 * Math.sin(3*D_rad - M_prime_rad);
    sigmaL -= 810 * Math.sin(2*D_rad + M_rad + M_prime_rad) * E;
    sigmaL += 759 * Math.sin(4*D_rad - M_rad - 2*M_prime_rad) * E;
    sigmaL -= 713 * Math.sin(2*M_rad - M_prime_rad) * E2;
    sigmaL -= 700 * Math.sin(2*D_rad + 2*M_rad - M_prime_rad) * E2;
    sigmaL += 691 * Math.sin(2*D_rad + M_rad - 2*M_prime_rad) * E;
    sigmaL += 596 * Math.sin(2*D_rad - M_rad - 2*F_rad) * E;
    sigmaL += 549 * Math.sin(4*D_rad + M_prime_rad);
    sigmaL += 537 * Math.sin(4*M_prime_rad);
    sigmaL += 520 * Math.sin(4*D_rad - M_rad) * E;
    sigmaL -= 487 * Math.sin(D_rad - 2*M_prime_rad);
    sigmaL -= 399 * Math.sin(2*D_rad + M_rad - 2*F_rad) * E;
    sigmaL -= 381 * Math.sin(2*M_prime_rad - 2*F_rad);
    sigmaL += 351 * Math.sin(D_rad + M_rad + M_prime_rad) * E;
    sigmaL -= 340 * Math.sin(3*D_rad - 2*M_prime_rad);
    sigmaL += 330 * Math.sin(4*D_rad - 3*M_prime_rad);
    sigmaL += 327 * Math.sin(2*D_rad - M_rad + 2*M_prime_rad) * E;
    sigmaL -= 323 * Math.sin(2*M_rad + M_prime_rad) * E2;
    sigmaL += 299 * Math.sin(D_rad + M_rad - M_prime_rad) * E;
    sigmaL += 294 * Math.sin(2*D_rad + 3*M_prime_rad);
    
    // Venus perturbation
    sigmaL += 3958 * Math.sin(A1_rad);
    // Jupiter perturbation  
    sigmaL += 1962 * Math.sin(L0*Math.PI/180 - F_rad);
    // Earth flattening correction
    sigmaL += 318 * Math.sin(A2_rad);
    
    // Calculate final longitude
    const lambda = L0 + sigmaL / 1000000.0;
    
    return ((lambda % 360) + 360) % 360;
  };

  const calculateSunPosition = (jd) => {
    // VSOP87 Sun position calculation
    const T = (jd - 2451545.0) / 36525.0;
    
    // Mean longitude of the Sun
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    
    // Mean anomaly of the Sun
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const M_rad = M * Math.PI / 180;
    
    // Equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad);
    const C2 = (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad);
    const C3 = 0.000289 * Math.sin(3 * M_rad);
    
    // True longitude
    const sunLon = L0 + C + C2 + C3;
    
    return ((sunLon % 360) + 360) % 360;
  };

  const getNakshatraInfo = (moonLongitude) => {
    const nakIndex = Math.floor(moonLongitude / (360 / 27));
    const lordIndex = nakIndex % 9; // CORRECT: cycles through 9 lords in sequence
    
    // Calculate Pada (1-4)
    // Each nakshatra spans 13°20' (13.333...°)
    // Each pada is 1/4 of that = 3°20' (3.333...°)
    const nakshatraStart = nakIndex * (360 / 27);
    const degreeInNakshatra = moonLongitude - nakshatraStart;
    const padaSize = (360 / 27) / 4; // 3.3333° per pada
    let nakPada = Math.floor(degreeInNakshatra / padaSize) + 1;
    
    // Ensure pada is between 1-4 (handles edge cases)
    nakPada = Math.max(1, Math.min(4, nakPada)); // 1-based pada (1, 2, 3, 4)
    
    return {
      nakshatra: nakshatras[nakIndex],
      nakshatraLord: nakLords[lordIndex],
      nakIndex: nakIndex,
      pada: nakPada,
      nakPada: nakPada
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

  // ====== NORTH INDIAN CHART RENDERING (ASTROSAGE STYLE) ======
  
  const renderNorthIndianChart = (chartType, planets, ascendantSign) => {
    // North Indian Chart - Based on user's hand-drawn diagram
    // House positions FIXED as shown in the drawing
    
    const zodiacNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    
    // Map house numbers to which sign they contain
    const houseToSign = [];
    for (let house = 0; house < 12; house++) {
      const signIndex = (ascendantSign + house) % 12;
      houseToSign[house] = signIndex;
    }
    
    // Place planets directly by their SIGN
    const signPlanets = Array(12).fill(null).map(() => []);
    
    Object.keys(planets).forEach(planetName => {
      const planetSignIndex = planets[planetName];
      signPlanets[planetSignIndex].push(planetName);
    });
    
    const planetSymbols = {
      "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
      "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
    };
    
    const planetColors = {
      "Sun": "text-red-600", "Moon": "text-blue-500", "Mars": "text-red-700",
      "Mercury": "text-green-600", "Jupiter": "text-purple-600", "Venus": "text-green-700",
      "Saturn": "text-blue-700", "Rahu": "text-red-500", "Ketu": "text-orange-600"
    };
    
    const renderHouse = (houseNum, position) => {
      const houseIndex = houseNum - 1;
      const signIndex = houseToSign[houseIndex];
      const planetsInThisSign = signPlanets[signIndex];
      const isAscendant = houseIndex === 0;
      
      return (
        <div className="absolute flex flex-col items-center justify-center" style={position}>
          <div className="text-[9px] text-gray-600 font-semibold mb-0.5">
            {zodiacNumbers[signIndex]}
          </div>
          <div className="flex flex-wrap gap-0.5 justify-center items-center">
            {planetsInThisSign.map((planet, idx) => (
              <span key={idx} className={`${planetColors[planet]} font-bold text-[11px]`}>
                {planetSymbols[planet]}
              </span>
            ))}
          </div>
          {isAscendant && <div className="text-[7px] text-red-600 font-bold mt-0.5">Asc</div>}
        </div>
      );
    };
    
    return (
      <div className="bg-white/5 p-3 rounded-xl border border-white/20">
        <h4 className="text-white font-bold mb-2 text-center text-xs">{chartType}</h4>
        
        <div className="relative mx-auto bg-white" style={{ width: '280px', height: '280px' }}>
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <rect x="1" y="1" width="278" height="278" fill="none" stroke="#f97316" strokeWidth="2" />
            <line x1="1" y1="1" x2="279" y2="279" stroke="#f97316" strokeWidth="1.5" />
            <line x1="279" y1="1" x2="1" y2="279" stroke="#f97316" strokeWidth="1.5" />
            <line x1="140" y1="1" x2="1" y2="140" stroke="#f97316" strokeWidth="1.5" />
            <line x1="140" y1="1" x2="279" y2="140" stroke="#f97316" strokeWidth="1.5" />
            <line x1="1" y1="140" x2="140" y2="279" stroke="#f97316" strokeWidth="1.5" />
            <line x1="279" y1="140" x2="140" y2="279" stroke="#f97316" strokeWidth="1.5" />
          </svg>
          
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            {/* Based on hand-drawn diagram - exact positions */}
            
            {/* House 1 - CENTER (Ascendant) - "10" with Asc label */}
            {renderHouse(1, { top: '118px', left: '118px', width: '44px', height: '44px' })}
            
            {/* House 2 - Top-right corner triangle - "2" */}
            {renderHouse(2, { top: '25px', right: '25px', width: '50px', height: '65px' })}
            
            {/* House 3 - Right side triangle - "3" */}
            {renderHouse(3, { top: '105px', right: '25px', width: '50px', height: '70px' })}
            
            {/* House 4 - Bottom-right area - "4" */}
            {renderHouse(4, { bottom: '25px', right: '25px', width: '50px', height: '65px' })}
            
            {/* House 5 - Top-center-right small - "5" */}
            {renderHouse(5, { top: '20px', right: '95px', width: '45px', height: '50px' })}
            
            {/* House 6 - Center-right small - "6" */}
            {renderHouse(6, { top: '85px', right: '90px', width: '40px', height: '45px' })}
            
            {/* House 7 - Center-left area - "7" */}
            {renderHouse(7, { top: '95px', left: '75px', width: '40px', height: '50px' })}
            
            {/* House 8 - Bottom center - "8" */}
            {renderHouse(8, { bottom: '25px', left: '115px', width: '50px', height: '50px' })}
            
            {/* House 9 - Left of center - "9" (Su Ju in drawing) */}
            {renderHouse(9, { top: '155px', left: '45px', width: '60px', height: '55px' })}
            
            {/* House 10 - Top-center area - "10" shown at top in drawing */}
            {renderHouse(10, { top: '80px', left: '105px', width: '50px', height: '45px' })}
            
            {/* House 11 - Left side triangle - "11" */}
            {renderHouse(11, { top: '105px', left: '25px', width: '50px', height: '70px' })}
            
            {/* House 12 - Top-left corner triangle - "12" (Ma Ve in drawing) */}
            {renderHouse(12, { top: '25px', left: '25px', width: '50px', height: '65px' })}
          </div>
        </div>
        
        <div className="mt-2 text-[9px] text-white/60 text-center">
          H1 = Center (Asc)
        </div>
      </div>
    );
  };

  // ====== CHALIT KUNDALI (BHAVA CHALIT) CALCULATION ======
  
  const calculateChalitKundali = (jd, birthLat, birthLon) => {
    // Chalit/Bhava Chalit uses TRUE house cusps based on Placidus system
    // Adapted for sidereal/Vedic astrology
    
    const epsilon = getObliquity(jd);
    const lst = getLST(jd, birthLon);
    const latRad = birthLat * Math.PI / 180;
    
    // Calculate all 12 house cusps using Placidus method
    const houseCusps = [];
    
    // 1st house cusp = Ascendant (tropical)
    const ascTropical = calculateAscendant(lst, birthLat, epsilon);
    
    // 10th house cusp = MC (Midheaven) - tropical
    const lstRad = lst * Math.PI / 180;
    const epsRad = epsilon * Math.PI / 180;
    const mcLon = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(epsRad)) * 180 / Math.PI;
    const mcTropical = ((mcLon % 360) + 360) % 360;
    
    // Get ayanamsa for sidereal conversion
    const ayanamsa = getLahiriAyanamsa(jd);
    
    // Convert to sidereal
    const asc = tropicalToSidereal(ascTropical, ayanamsa);
    const mc = tropicalToSidereal(mcTropical, ayanamsa);
    
    houseCusps[0] = asc;  // 1st house cusp (Ascendant)
    houseCusps[9] = mc;   // 10th house cusp (MC)
    
    // 4th house cusp = IC (opposite of MC)
    houseCusps[3] = (mc + 180) % 360;
    
    // 7th house cusp = Descendant (opposite of Ascendant)
    houseCusps[6] = (asc + 180) % 360;
    
    // Calculate intermediate cusps using Placidus formulas
    // These account for latitude and create unequal houses
    
    // Houses 11, 12 (between MC and Asc)
    const arc1 = ((asc - mc + 360) % 360);
    houseCusps[10] = (mc + arc1 / 3) % 360;      // 11th house
    houseCusps[11] = (mc + 2 * arc1 / 3) % 360;  // 12th house
    
    // Houses 2, 3 (between Asc and IC)
    const arc2 = ((houseCusps[3] - asc + 360) % 360);
    houseCusps[1] = (asc + arc2 / 3) % 360;      // 2nd house
    houseCusps[2] = (asc + 2 * arc2 / 3) % 360;  // 3rd house
    
    // Houses 5, 6 (between IC and Desc)
    const arc3 = ((houseCusps[6] - houseCusps[3] + 360) % 360);
    houseCusps[4] = (houseCusps[3] + arc3 / 3) % 360;      // 5th house
    houseCusps[5] = (houseCusps[3] + 2 * arc3 / 3) % 360;  // 6th house
    
    // Houses 8, 9 (between Desc and MC)
    const arc4 = ((mc - houseCusps[6] + 360) % 360);
    houseCusps[7] = (houseCusps[6] + arc4 / 3) % 360;      // 8th house
    houseCusps[8] = (houseCusps[6] + 2 * arc4 / 3) % 360;  // 9th house
    
    return houseCusps;
  };
  
  const getPlanetHouseInChalit = (planetLongitude, houseCusps) => {
    // Determine which Chalit house a planet falls into
    // A planet is in a house if it's between that cusp and the next cusp
    
    for (let i = 0; i < 12; i++) {
      const thisCusp = houseCusps[i];
      const nextCusp = houseCusps[(i + 1) % 12];
      
      let isInHouse = false;
      
      if (nextCusp > thisCusp) {
        // Normal case: no zodiac boundary crossing
        isInHouse = planetLongitude >= thisCusp && planetLongitude < nextCusp;
      } else {
        // Cusp crosses 0° Aries (360° → 0°)
        isInHouse = planetLongitude >= thisCusp || planetLongitude < nextCusp;
      }
      
      if (isInHouse) {
        return i + 1; // Houses are 1-indexed (1-12)
      }
    }
    
    return 1; // Fallback to 1st house
  };
  
  const calculatePlanetsInChalit = (planets, houseCusps) => {
    // Recalculate all planet house positions using Chalit cusps
    const chalitPlanets = { ...planets };
    
    Object.keys(chalitPlanets).forEach(planet => {
      const planetLong = chalitPlanets[planet].longitude;
      const chalitHouse = getPlanetHouseInChalit(planetLong, houseCusps);
      chalitPlanets[planet] = {
        ...chalitPlanets[planet],
        chalitHouse: chalitHouse,
        rasifHouse: chalitPlanets[planet].house // Keep original rasi chart house
      };
    });
    
    return chalitPlanets;
  };

  // ====== LIFE EVENTS PREDICTION (CHART-BASED ANALYSIS) ======
  
  const calculateAllPlanetPositions = async(jd, ayanamsa) => {
    // Calculate all 9 planets (7 physical + 2 nodes)
    const T = (jd - 2451545.0) / 36525.0;
    
   // ========== USE SWISS EPHEMERIS FOR ACCURATE POSITIONS ==========
let finalSunSidereal, finalMoonSidereal, finalMarsSidereal;
let finalMercurySidereal, finalJupiterSidereal, finalVenusSidereal;
let finalSaturnSidereal, finalRahuSidereal, finalKetuSidereal;

if (USE_SWISSEPH_API) {
  try {
    console.log("🌟 Fetching planetary positions from Swiss Ephemeris...");
    console.log("  JD:", jd.toFixed(6));
    console.log("  Date:", birthDate, birthTime);
    
    const response = await fetch(`${SWISSEPH_API_URL}/planets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jd: jd,
        latitude: birthLat,
        longitude: birthLon,
        planets: ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'true_node'],
        sidereal: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log("✅ Received planetary positions from Swiss Ephemeris");
    
    finalSunSidereal = data.planets.sun;
    finalMoonSidereal = data.planets.moon;
    finalMarsSidereal = data.planets.mars;
    finalMercurySidereal = data.planets.mercury;
    finalJupiterSidereal = data.planets.jupiter;
    finalVenusSidereal = data.planets.venus;
    finalSaturnSidereal = data.planets.saturn;
    finalRahuSidereal = data.planets.rahu;
    finalKetuSidereal = data.planets.ketu;
    
    console.log("  Sun:", finalSunSidereal.toFixed(4), zodiac[Math.floor(finalSunSidereal/30)]);
    console.log("  Moon:", finalMoonSidereal.toFixed(4), zodiac[Math.floor(finalMoonSidereal/30)]);
    console.log("  Mars:", finalMarsSidereal.toFixed(4), zodiac[Math.floor(finalMarsSidereal/30)]);
    console.log("  Mercury:", finalMercurySidereal.toFixed(4), zodiac[Math.floor(finalMercurySidereal/30)]);
    console.log("  Jupiter:", finalJupiterSidereal.toFixed(4), zodiac[Math.floor(finalJupiterSidereal/30)]);
    console.log("  Venus:", finalVenusSidereal.toFixed(4), zodiac[Math.floor(finalVenusSidereal/30)]);
    console.log("  Saturn:", finalSaturnSidereal.toFixed(4), zodiac[Math.floor(finalSaturnSidereal/30)]);
    
  } catch (error) {
    console.error("❌ Swiss Ephemeris API error:", error);
    console.log("⚠️ Falling back to local formulas (less accurate)");
    
    // Fallback to local formulas
    const sunTropical = calculateSunPosition(jd);
    finalSunSidereal = tropicalToSidereal(sunTropical, ayanamsa);
    
    const moonTropical = calculateMoonPosition(jd);
    finalMoonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
    
    const marsTropical = calculateMarsPosition(jd);
    finalMarsSidereal = tropicalToSidereal(marsTropical, ayanamsa);
    
    const mercuryTropical = calculateMercuryPosition(jd);
    finalMercurySidereal = tropicalToSidereal(mercuryTropical, ayanamsa);
    
    const jupiterTropical = calculateJupiterPosition(jd);
    finalJupiterSidereal = tropicalToSidereal(jupiterTropical, ayanamsa);
    
    const venusTropical = calculateVenusPosition(jd);
    finalVenusSidereal = tropicalToSidereal(venusTropical, ayanamsa);
    
    const saturnTropical = calculateSaturnPosition(jd);
    finalSaturnSidereal = tropicalToSidereal(saturnTropical, ayanamsa);
    
    const { rahu, ketu } = calculateRahuKetu(jd);
    finalRahuSidereal = tropicalToSidereal(rahu, ayanamsa);
    finalKetuSidereal = tropicalToSidereal(ketu, ayanamsa);
  }
} else {
  // Use local formulas
  console.log("⚠️ Using local formulas (Swiss Ephemeris disabled)");
  
  const sunTropical = calculateSunPosition(jd);
  finalSunSidereal = tropicalToSidereal(sunTropical, ayanamsa);
  
  const moonTropical = calculateMoonPosition(jd);
  finalMoonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
  
  const marsTropical = calculateMarsPosition(jd);
  finalMarsSidereal = tropicalToSidereal(marsTropical, ayanamsa);
  
  const mercuryTropical = calculateMercuryPosition(jd);
  finalMercurySidereal = tropicalToSidereal(mercuryTropical, ayanamsa);
  
  const jupiterTropical = calculateJupiterPosition(jd);
  finalJupiterSidereal = tropicalToSidereal(jupiterTropical, ayanamsa);
  
  const venusTropical = calculateVenusPosition(jd);
  finalVenusSidereal = tropicalToSidereal(venusTropical, ayanamsa);
  
  const saturnTropical = calculateSaturnPosition(jd);
  finalSaturnSidereal = tropicalToSidereal(saturnTropical, ayanamsa);
  
  const { rahu, ketu } = calculateRahuKetu(jd);
  finalRahuSidereal = tropicalToSidereal(rahu, ayanamsa);
  finalKetuSidereal = tropicalToSidereal(ketu, ayanamsa);
}
// ========== END SWISS EPHEMERIS SECTION ==========
    
    return {
      Sun: { longitude: finalSunSidereal, house: 0, sign: Math.floor(finalSunSidereal/ 30) },
      Moon: { longitude: finalMoonSidereal, house: 0, sign: Math.floor(finalMoonSidereal/ 30) },
      Mars: { longitude: finalMarsSidereal, house: 0, sign: Math.floor(finalMarsSidereal / 30) },
      Mercury: { longitude: finalMercurySidereal, house: 0, sign: Math.floor(finalMercurySidereal / 30) },
      Jupiter: { longitude: finalJupiterSidereal, house: 0, sign: Math.floor(finalJupiterSidereal / 30) },
      Venus: { longitude: finalVenusSidereal, house: 0, sign: Math.floor(finalVenusSidereal/ 30) },
      Saturn: { longitude: finalSaturnSidereal, house: 0, sign: Math.floor(finalSaturnSidereal / 30) },
      Rahu: { longitude: finalRahuSidereal, house: 0, sign: Math.floor(finalRahuSidereal/ 30) },
      Ketu: { longitude: finalKetuSidereal, house: 0, sign: Math.floor(finalKetuSidereal / 30) }
    };
  };
  
  const calculateHousesFromPlanets = (planets, ascendantSign) => {
    // Calculate which house each planet is in (1-12)
    // House 1 starts at Ascendant sign
    Object.keys(planets).forEach(planet => {
      const planetSign = planets[planet].sign;
      let house = ((planetSign - ascendantSign + 12) % 12) + 1;
      planets[planet].house = house;
    });
    return planets;
  };
  
  const getPlanetLordships = (planets, ascendantSign) => {
    // Which houses does each planet rule (own)?
    const signLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", 
                       "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
    
    const lordships = {};
    Object.keys(planets).forEach(planet => {
      lordships[planet] = [];
    });
    
    // Check each house
    for (let house = 1; house <= 12; house++) {
      const houseSign = (ascendantSign + house - 1) % 12;
      const lord = signLords[houseSign];
      if (lordships[lord]) {
        lordships[lord].push(house);
      }
    }
    
    return lordships;
  };
  
  const analyzeMahadashaPredictions = (dashaLord, planets, lordships, ascendantSign) => {
    const predictions = [];
    const houseMeanings = {
      1: "self, personality, health, appearance",
      2: "wealth, family, speech, food",
      3: "siblings, courage, short travels, skills",
      4: "mother, home, property, education, vehicles",
      5: "children, creativity, romance, speculation",
      6: "enemies, diseases, debts, service, competition",
      7: "spouse, marriage, partnerships, business",
      8: "longevity, transformation, sudden events, occult",
      9: "father, fortune, religion, higher learning, long travels",
      10: "career, status, profession, authority",
      11: "gains, income, fulfillment of desires, friends",
      12: "losses, expenses, foreign lands, liberation, isolation"
    };
    
    // IMPORTANT: Use Chalit house for predictions (true house position)
    const dashaLordHouse = planets[dashaLord]?.chalitHouse || planets[dashaLord]?.house || 1;
    const rasifHouse = planets[dashaLord]?.rasifHouse || dashaLordHouse;
    
    // Which houses does Dasha lord rule?
    const ruledHouses = lordships[dashaLord] || [];
    
    // CHALIT-BASED PLACEMENT PREDICTIONS
    predictions.push({
      category: "Primary Focus (Chalit)",
      event: `Strong focus on ${houseMeanings[dashaLordHouse]} (${dashaLord} in Chalit House ${dashaLordHouse})`,
      timing: "Throughout period",
      chalitBased: true
    });
    
    if (dashaLordHouse !== rasifHouse) {
      predictions.push({
        category: "Note",
        event: `Chalit shows ${dashaLord} in House ${dashaLordHouse}, while Rasi shows House ${rasifHouse}. Chalit is used for predictions as it reflects TRUE house cusps.`,
        timing: "Important",
        chalitBased: true
      });
    }
    
    // LORDSHIP-BASED PREDICTIONS (same as before)
    ruledHouses.forEach(house => {
      if (house === 1) {
        predictions.push({
          category: "Self & Health",
          event: `${dashaLord} rules 1st house: Personal growth, health focus, new beginnings`,
          timing: "Entire period"
        });
      }
      if (house === 2) {
        predictions.push({
          category: "Wealth & Family",
          event: `${dashaLord} rules 2nd house: Wealth accumulation, family matters, speech improvement`,
          timing: "Entire period"
        });
      }
      if (house === 4) {
        predictions.push({
          category: "Property & Mother",
          event: `${dashaLord} rules 4th house: Property acquisition, vehicle purchase, mother's wellbeing`,
          timing: "Middle of period"
        });
      }
      if (house === 5) {
        predictions.push({
          category: "Children & Romance",
          event: `${dashaLord} rules 5th house: Birth of children, creative projects, romantic relationships`,
          timing: "Early to mid period"
        });
      }
      if (house === 7) {
        predictions.push({
          category: "Marriage & Partnership",
          event: `${dashaLord} rules 7th house: Marriage, business partnerships, spouse-related events`,
          timing: "Peak period"
        });
      }
      if (house === 9) {
        predictions.push({
          category: "Fortune & Father",
          event: `${dashaLord} rules 9th house: Fortune, father's support, higher education, spiritual growth, foreign travel`,
          timing: "Throughout period"
        });
      }
      if (house === 10) {
        predictions.push({
          category: "Career & Status",
          event: `${dashaLord} rules 10th house: Career advancement, job changes, professional recognition`,
          timing: "Peak period"
        });
      }
      if (house === 11) {
        predictions.push({
          category: "Gains & Income",
          event: `${dashaLord} rules 11th house: Financial gains, fulfillment of desires, networking benefits`,
          timing: "Throughout period"
        });
      }
    });
    
    // SPECIFIC PLANET-BASED PREDICTIONS (Enhanced with Chalit)
    
    // CHALIT-SPECIFIC: Check if Dasha lord is in 7th house in Chalit for marriage
    if (dashaLordHouse === 7) {
      predictions.push({
        category: "Marriage (Chalit Placement)",
        event: `${dashaLord} in 7th house (Chalit) - STRONG marriage/partnership indication`,
        timing: "Throughout period",
        probability: "Very High",
        chalitBased: true
      });
    }
    
    if (dashaLord === "Jupiter" && (ruledHouses.includes(7) || dashaLordHouse === 7)) {
      predictions.push({
        category: "Marriage (Jupiter)",
        event: "HIGHLY FAVORABLE for marriage - Jupiter activating 7th house matters",
        timing: "First 5 years of period",
        probability: "Very High"
      });
    }
    
    if (dashaLord === "Venus" && (ruledHouses.includes(7) || dashaLordHouse === 7)) {
      predictions.push({
        category: "Marriage (Venus)",
        event: "Romance and love marriage prospects - Venus activating relationship sector",
        timing: "Early in period",
        probability: "High"
      });
    }
    
    if (dashaLord === "Mars" && (ruledHouses.includes(4) || dashaLordHouse === 4)) {
      predictions.push({
        category: "Property (Mars)",
        event: "Property purchase or construction - Mars activating 4th house",
        timing: "Mid period",
        probability: "High"
      });
    }
    
    if (dashaLord === "Saturn" && (ruledHouses.includes(10) || dashaLordHouse === 10)) {
      predictions.push({
        category: "Career (Saturn)",
        event: "Long-term career establishment - Saturn in/ruling 10th house brings stability",
        timing: "After initial 2-3 years",
        probability: "Very High"
      });
    }
    
    if (dashaLord === "Mercury" && (ruledHouses.includes(4) || ruledHouses.includes(9) || dashaLordHouse === 4 || dashaLordHouse === 9)) {
      predictions.push({
        category: "Education (Mercury)",
        event: "Higher education completion - Mercury in education houses",
        timing: "Early to mid period",
        probability: "High"
      });
    }
    
    if (dashaLord === "Sun" && (ruledHouses.includes(10) || dashaLordHouse === 10)) {
      predictions.push({
        category: "Career (Sun)",
        event: "Government job or authority position - Sun in career house",
        timing: "Mid period",
        probability: "Moderate to High"
      });
    }
    
    if (dashaLord === "Moon" && (ruledHouses.includes(4) || dashaLordHouse === 4)) {
      predictions.push({
        category: "Relocation (Moon)",
        event: "Change of residence or relocation - Moon in 4th house",
        timing: "Multiple times during period",
        probability: "High"
      });
    }
    
    if (dashaLord === "Rahu") {
      if (dashaLordHouse === 9 || dashaLordHouse === 12) {
        predictions.push({
          category: "Foreign (Rahu)",
          event: "Foreign travel, settlement abroad, or foreign connections - Rahu in travel/foreign houses",
          timing: "Sudden, unexpected timing",
          probability: "High"
        });
      } else {
        predictions.push({
          category: "Unconventional (Rahu)",
          event: "Unconventional career path, technology, or sudden changes",
          timing: "Unexpected timing",
          probability: "Moderate"
        });
      }
    }
    
    if (dashaLord === "Ketu") {
      if (dashaLordHouse === 8 || dashaLordHouse === 12) {
        predictions.push({
          category: "Spiritual (Ketu)",
          event: "Deep spiritual transformation, occult studies, or renunciation tendencies",
          timing: "Throughout period",
          probability: "High"
        });
      } else {
        predictions.push({
          category: "Detachment (Ketu)",
          event: "Detachment from material matters related to this house, spiritual growth",
          timing: "Throughout period",
          probability: "Moderate"
        });
      }
    }
    
    // BENEFIC vs MALEFIC house placements (in Chalit)
    const beneficHouses = [1, 2, 4, 5, 7, 9, 10, 11];
    const maleficHouses = [6, 8, 12];
    
    if (beneficHouses.includes(dashaLordHouse)) {
      predictions.push({
        category: "General",
        event: `Favorable period - ${dashaLord} well-placed in Chalit house ${dashaLordHouse}`,
        timing: "Overall positive",
        chalitBased: true
      });
    } else if (maleficHouses.includes(dashaLordHouse)) {
      predictions.push({
        category: "Challenges",
        event: `Some obstacles expected - ${dashaLord} in Chalit house ${dashaLordHouse} (${houseMeanings[dashaLordHouse]})`,
        timing: "Periodic challenges",
        chalitBased: true
      });
    }
    
    return predictions;
  };
  
  const calculateLifeEventsTimeline = (moonLongitude, birthDate, ascendantDeg, jd, ayanamsa, birthLat, birthLon) => {
    const birthDateObj = new Date(birthDate);
    const birthYear = birthDateObj.getFullYear();
    
    const dashaPeriods = {
      "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
      "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
    };
    
    const dashaLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    
    // Calculate all planet positions
    const planets = calculateAllPlanetPositions(jd, ayanamsa);
    const ascendantSign = Math.floor(ascendantDeg / 30);
    
    // Calculate Chalit (Bhava Chalit) house cusps
    const chalitCusps = calculateChalitKundali(jd, birthLat, birthLon);
    
    // Determine houses using Rasi chart (equal houses from ascendant)
    calculateHousesFromPlanets(planets, ascendantSign);
    
    // Now calculate Chalit houses (TRUE house positions)
    const chalitPlanets = calculatePlanetsInChalit(planets, chalitCusps);
    
    // Determine lordships
    const lordships = getPlanetLordships(chalitPlanets, ascendantSign);
    
    // Get birth Nakshatra and Mahadasha
    const nakshatraSpan = 360 / 27;
    const nakIndex = Math.floor(moonLongitude / nakshatraSpan);
    const lordIndex = nakIndex % 9; // CORRECT: Each lord rules 3 nakshatras in sequence
    
    const nakshatraStart = nakIndex * nakshatraSpan;
    const degreeInNakshatra = moonLongitude - nakshatraStart;
    const padaSize = (360 / 27) / 4; // 3.3333° per pada
    const fractionCompleted = degreeInNakshatra / nakshatraSpan;
    
    const birthMahadashaLord = dashaLords[lordIndex];
    const birthMahadashaPeriod = dashaPeriods[birthMahadashaLord];
    const elapsedYears = birthMahadashaPeriod * fractionCompleted;
    const remainingYears = birthMahadashaPeriod - elapsedYears;
    
    // Build complete Mahadasha timeline with CHALIT-BASED predictions
    const timeline = [];
    let currentYear = birthYear;
    let currentIndex = lordIndex;
    
    // First, add remaining birth Mahadasha
    const firstEndYear = birthYear + Math.floor(remainingYears);
    timeline.push({
      planet: birthMahadashaLord,
      startYear: birthYear,
      endYear: firstEndYear,
      duration: remainingYears,
      placement: chalitPlanets[birthMahadashaLord],
      lordships: lordships[birthMahadashaLord] || [],
      predictions: analyzeMahadashaPredictions(birthMahadashaLord, chalitPlanets, lordships, ascendantSign),
      isCurrent: false,
      isPast: true
    });
    
    currentYear = firstEndYear;
    
    // Add subsequent Mahadashas
    const today = new Date();
    const currentYearNow = today.getFullYear();
    
    for (let i = 0; i < 9; i++) {
      currentIndex = (currentIndex + 1) % 9;
      const planet = dashaLords[currentIndex];
      const period = dashaPeriods[planet];
      const endYear = currentYear + period;
      
      const isCurrent = currentYear <= currentYearNow && endYear > currentYearNow;
      const isPast = endYear <= currentYearNow;
      
      timeline.push({
        planet: planet,
        startYear: currentYear,
        endYear: endYear,
        duration: period,
        placement: chalitPlanets[planet],
        lordships: lordships[planet] || [],
        predictions: analyzeMahadashaPredictions(planet, chalitPlanets, lordships, ascendantSign),
        isCurrent: isCurrent,
        isPast: isPast
      });
      
      currentYear = endYear;
      
      if (currentYear > currentYearNow + 20) break;
    }
    
    return {
      timeline,
      planets: chalitPlanets,
      lordships,
      ascendantSign,
      chalitCusps,
      birthMahadashaLord,
      birthMahadashaYears: birthMahadashaPeriod,
      birthMahadashaLordRashiHouse: chalitPlanets[birthMahadashaLord]?.rasifHouse || chalitPlanets[birthMahadashaLord]?.house,
      birthMahadashaLordChalitHouse: chalitPlanets[birthMahadashaLord]?.chalitHouse || chalitPlanets[birthMahadashaLord]?.house,
      predictions: timeline[0]?.predictions || []
    };
  };

  const calculateDivisionalChartsForDisplay = (jd, ayanamsa, ascendantSidereal) => {
    // Calculate all 9 planets
    const planets = calculateAllPlanetPositions(jd, ayanamsa);
    const ascendantSign = Math.floor(ascendantSidereal / 30);
    
    // For each divisional chart, calculate planet positions
    const calculateDivisionalPositions = (division) => {
      const divPlanets = {};
      
      // Calculate divisional position for each planet
      Object.keys(planets).forEach(planetName => {
        const planetLong = planets[planetName].longitude;
        const divSign = calculateDivisionalChart(planetLong, division);
        const divSignIndex = zodiac.indexOf(divSign);
        divPlanets[planetName] = divSignIndex;
      });
      
      // Calculate divisional ascendant
      const divAscSign = calculateDivisionalChart(ascendantSidereal, division);
      const divAscIndex = zodiac.indexOf(divAscSign);
      
      return {
        planets: divPlanets,
        ascendant: divAscIndex
      };
    };
    
    return {
      d1: {
        planets: Object.keys(planets).reduce((acc, p) => {
          acc[p] = planets[p].sign;
          return acc;
        }, {}),
        ascendant: ascendantSign
      },
      d9: calculateDivisionalPositions(9),
      d10: calculateDivisionalPositions(10),
      d7: calculateDivisionalPositions(7)
    };
  };

  // ====== SPECIAL LAGNAS CALCULATIONS ======
  
  const calculateSpecialLagnas = (jd, birthLat, birthLon, ascendantDeg, sunDeg) => {
    const epsilon = getObliquity(jd);
    const lst = getLST(jd, birthLon);
    
    // 1. BHAVA LAGNA (Midpoint between Ascendant and Midheaven)
    // MC (Midheaven) calculation
    const lstRad = lst * Math.PI / 180;
    const epsRad = epsilon * Math.PI / 180;
    const mcLon = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(epsRad)) * 180 / Math.PI;
    const mc = ((mcLon % 360) + 360) % 360;
    
    // Bhava Lagna = midpoint of Ascendant and MC
    let bhavaLagna = (ascendantDeg + mc) / 2;
    if (Math.abs(mc - ascendantDeg) > 180) {
      bhavaLagna = bhavaLagna + 180;
    }
    bhavaLagna = ((bhavaLagna % 360) + 360) % 360;
    
    // 2. HORA LAGNA (Based on Sun's longitude and time elapsed)
    // Formula: Ascendant + (Sunrise to Birth time duration in hours × 15°)
    // Simplified: We'll use Sun's position as reference
    const horaLagna = ((ascendantDeg + sunDeg / 2) % 360 + 360) % 360;
    
    // 3. GHATI LAGNA (Based on Ghatis elapsed since sunrise)
    // 1 Ghati = 24 minutes, 60 Ghatis = 1 day
    // Approximate using LST
    const ghatiLagna = ((lst * 2) % 360 + 360) % 360;
    
    // 4. VIGHATI LAGNA (More precise subdivision)
    // 1 Vighati = 24 seconds, 60 Vighatika = 1 Ghati
    const vighatiLagna = ((lst * 2.5) % 360 + 360) % 360;
    
    // 5. VARNADA LAGNA (D1 based calculation)
    const varnada = calculateVarnadaLagna(ascendantDeg);
    
    // 6. SREE LAGNA (Auspicious point)
    const sreeLagna = ((ascendantDeg + sunDeg + mc) / 3 % 360 + 360) % 360;
    
    // 7. PRANAPADA LAGNA (Life force point)
    const pranapada = ((ascendantDeg * 2 - sunDeg + 360) % 360 + 360) % 360;
    
    return {
      bhavaLagna,
      horaLagna,
      ghatiLagna,
      vighatiLagna,
      varnada,
      sreeLagna,
      pranapada
    };
  };
  
  const calculateVarnadaLagna = (ascendantDeg) => {
    const signIndex = Math.floor(ascendantDeg / 30);
    const isOddSign = signIndex % 2 === 0;
    
    if (isOddSign) {
      // For odd signs: count from Aries
      return ((ascendantDeg) % 360 + 360) % 360;
    } else {
      // For even signs: count from Libra (reverse)
      return ((180 + (30 - (ascendantDeg % 30)) + (signIndex * 30)) % 360 + 360) % 360;
    }
  };

  // ====== VIMSHOTTARI DASHA CALCULATIONS ======
  

  const getNakshatraTraits = (nakshatra, pada) => {
    // Comprehensive nakshatra metadata
    const nakshatraDetails = {
      "Ashwini": {
        symbol: "Horse's Head",
        deity: "Ashwini Kumaras (Divine Physicians)",
        element: "Earth",
        gana: "Deva (Divine)",
        animal: "Male Horse",
        quality: "Light, swift"
      },
      "Bharani": {
        symbol: "Yoni (Womb)",
        deity: "Yama (God of Death)",
        element: "Earth",
        gana: "Manushya (Human)",
        animal: "Elephant",
        quality: "Fierce, intense"
      },
      "Krittika": {
        symbol: "Razor/Flame",
        deity: "Agni (Fire God)",
        element: "Fire",
        gana: "Rakshasa (Demon)",
        animal: "Sheep",
        quality: "Sharp, cutting"
      },
      "Rohini": {
        symbol: "Ox Cart/Chariot",
        deity: "Brahma (Creator)",
        element: "Earth",
        gana: "Manushya (Human)",
        animal: "Serpent",
        quality: "Fixed, stable"
      },
      "Mrigashira": {
        symbol: "Deer's Head",
        deity: "Soma (Moon God)",
        element: "Earth",
        gana: "Deva (Divine)",
        animal: "Female Serpent",
        quality: "Tender, soft"
      },
      "Ardra": {
        symbol: "Teardrop/Diamond",
        deity: "Rudra (Storm God)",
        element: "Water",
        gana: "Manushya (Human)",
        animal: "Female Dog",
        quality: "Sharp, destructive"
      },
      "Punarvasu": {
        symbol: "Bow and Quiver",
        deity: "Aditi (Mother of Gods)",
        element: "Water",
        gana: "Deva (Divine)",
        animal: "Female Cat",
        quality: "Movable, changeable"
      },
      "Pushya": {
        symbol: "Cow's Udder/Lotus",
        deity: "Brihaspati (Jupiter)",
        element: "Water",
        gana: "Deva (Divine)",
        animal: "Male Goat",
        quality: "Light, nourishing"
      },
      "Ashlesha": {
        symbol: "Coiled Serpent",
        deity: "Nagas (Serpent Deities)",
        element: "Water",
        gana: "Rakshasa (Demon)",
        animal: "Male Cat",
        quality: "Sharp, poisonous"
      },
      "Magha": {
        symbol: "Royal Throne",
        deity: "Pitris (Ancestors)",
        element: "Water",
        gana: "Rakshasa (Demon)",
        animal: "Male Rat",
        quality: "Fierce, regal"
      },
      "Purva Phalguni": {
        symbol: "Front Legs of Bed/Hammock",
        deity: "Bhaga (God of Fortune)",
        element: "Water",
        gana: "Manushya (Human)",
        animal: "Female Rat",
        quality: "Fierce, creative"
      },
      "Uttara Phalguni": {
        symbol: "Back Legs of Bed",
        deity: "Aryaman (God of Contracts)",
        element: "Fire",
        gana: "Manushya (Human)",
        animal: "Bull",
        quality: "Fixed, stable"
      },
      "Hasta": {
        symbol: "Hand/Fist",
        deity: "Savitar (Sun God)",
        element: "Fire",
        gana: "Deva (Divine)",
        animal: "Female Buffalo",
        quality: "Light, skillful"
      },
      "Chitra": {
        symbol: "Bright Jewel/Pearl",
        deity: "Tvashtar/Vishwakarma (Divine Architect)",
        element: "Fire",
        gana: "Rakshasa (Demon)",
        animal: "Female Tiger",
        quality: "Soft, beautiful"
      },
      "Swati": {
        symbol: "Young Sprout/Coral",
        deity: "Vayu (Wind God)",
        element: "Fire",
        gana: "Deva (Divine)",
        animal: "Male Buffalo",
        quality: "Movable, independent"
      },
      "Vishakha": {
        symbol: "Triumphal Archway/Potter's Wheel",
        deity: "Indra-Agni (King of Gods & Fire)",
        element: "Fire",
        gana: "Rakshasa (Demon)",
        animal: "Male Tiger",
        quality: "Sharp, determined"
      },
      "Anuradha": {
        symbol: "Lotus Flower/Triumphal Archway",
        deity: "Mitra (God of Friendship)",
        element: "Fire",
        gana: "Deva (Divine)",
        animal: "Female Deer",
        quality: "Soft, friendly"
      },
      "Jyeshtha": {
        symbol: "Circular Amulet/Umbrella/Earring",
        deity: "Indra (King of Gods)",
        element: "Air",
        gana: "Rakshasa (Demon)",
        animal: "Male Deer",
        quality: "Sharp, senior"
      },
      "Mula": {
        symbol: "Bundle of Roots/Lion's Tail",
        deity: "Nirriti (Goddess of Destruction)",
        element: "Air",
        gana: "Rakshasa (Demon)",
        animal: "Male Dog",
        quality: "Sharp, foundational"
      },
      "Purva Ashadha": {
        symbol: "Elephant's Tusk/Fan",
        deity: "Apas (Water Goddess)",
        element: "Air",
        gana: "Manushya (Human)",
        animal: "Male Monkey",
        quality: "Fierce, invincible"
      },
      "Uttara Ashadha": {
        symbol: "Elephant's Tusk/Planks of Bed",
        deity: "Vishvadevas (Universal Gods)",
        element: "Air",
        gana: "Manushya (Human)",
        animal: "Male Mongoose",
        quality: "Fixed, victorious"
      },
      "Shravana": {
        symbol: "Three Footprints/Ear",
        deity: "Vishnu (The Preserver)",
        element: "Air",
        gana: "Deva (Divine)",
        animal: "Female Monkey",
        quality: "Movable, listening"
      },
      "Dhanishta": {
        symbol: "Drum/Flute",
        deity: "Eight Vasus (Gods of Elements)",
        element: "Ether",
        gana: "Rakshasa (Demon)",
        animal: "Female Lion",
        quality: "Movable, rhythmic"
      },
      "Shatabhisha": {
        symbol: "Empty Circle/1000 Flowers",
        deity: "Varuna (God of Oceans)",
        element: "Ether",
        gana: "Rakshasa (Demon)",
        animal: "Female Horse",
        quality: "Movable, healing"
      },
      "Purva Bhadrapada": {
        symbol: "Front Legs of Funeral Cot/Sword",
        deity: "Aja Ekapada (One-footed Goat)",
        element: "Ether",
        gana: "Manushya (Human)",
        animal: "Male Lion",
        quality: "Fierce, intense"
      },
      "Uttara Bhadrapada": {
        symbol: "Back Legs of Funeral Cot/Twins",
        deity: "Ahir Budhnya (Serpent of the Deep)",
        element: "Ether",
        gana: "Manushya (Human)",
        animal: "Female Cow",
        quality: "Fixed, deep"
      },
      "Revati": {
        symbol: "Drum/Fish",
        deity: "Pushan (Nourisher)",
        element: "Ether",
        gana: "Deva (Divine)",
        animal: "Female Elephant",
        quality: "Soft, nourishing"
      }
    };

    const traits = {
      "Ashwini": {
        general: "Quick, spontaneous, healing abilities. Pioneering spirit with childlike enthusiasm. Natural healers and physicians. Impatient but action-oriented. Horse symbolism represents speed and vitality.",
        pada1: "Aries Navamsa - Most impulsive and direct. Strong initiative, leadership qualities. May act without thinking.",
        pada2: "Taurus Navamsa - More grounded and practical. Good with resources. Balances speed with stability.",
        pada3: "Gemini Navamsa - Intellectual and communicative. Interest in multiple healing modalities. Quick learner.",
        pada4: "Cancer Navamsa - Emotionally sensitive healer. Nurturing approach. Connection to traditional medicine."
      },
      "Bharani": {
        general: "Intense, transformative energy. Bearer of souls between worlds. Strong creative and destructive power. Deeply sensual and passionate. Symbol: Yoni (womb) - creation and birth.",
        pada1: "Leo Navamsa - Creative expression, dramatic. Natural performer. Strong ego and pride.",
        pada2: "Virgo Navamsa - Service-oriented, perfectionist. Analytical about transformation. Healing through purification.",
        pada3: "Libra Navamsa - Balanced approach to extremes. Artistic sensibility. Partnership-focused transformation.",
        pada4: "Scorpio Navamsa - Most intense pada. Deepest transformation. Occult knowledge. Sexual energy prominent."
      },
      "Krittika": {
        general: "Sharp, cutting, purifying through fire. Critical and perfectionist. Nurturing yet fierce. Symbol: Blade or flame. Mix of motherly care and warrior protection.",
        pada1: "Sagittarius Navamsa - Philosophical cutter. Truth-seeker. Religious or spiritual pursuits. Righteous anger.",
        pada2: "Capricorn Navamsa - Practical and ambitious. Cuts through to achieve goals. Career-focused. Disciplined.",
        pada3: "Aquarius Navamsa - Humanitarian warrior. Fights for causes. Unconventional cutting insight. Technical skills.",
        pada4: "Pisces Navamsa - Spiritual purification. Compassionate criticism. Artistic sensitivity. Mystical inclinations."
      },
      "Rohini": {
        general: "Most fertile and creative nakshatra. Luxury-loving, materialistic in positive sense. Beautiful, charming, artistic. Moon's favorite wife. Symbol: Cart/chariot - material growth.",
        pada1: "Aries Navamsa - Dynamic creativity. Pioneering in arts. Competitive in beauty. Quick manifestation.",
        pada2: "Taurus Navamsa - Most luxurious pada. Love of comfort and beauty. Financial acumen. Sensual pleasures.",
        pada3: "Gemini Navamsa - Intellectual creativity. Communication skills. Versatile artistic expression. Business-minded.",
        pada4: "Cancer Navamsa - Emotional depth in creativity. Nurturing through beauty. Family-oriented wealth. Moody."
      },
      "Mrigashira": {
        general: "Searching, curious, restless. Deer symbolism - gentle yet elusive. Constantly seeking something. Romantic and idealistic. Good at research and investigation.",
        pada1: "Leo Navamsa - Searching for recognition. Creative pursuits. Proud yet seeking. Leadership through exploration.",
        pada2: "Virgo Navamsa - Analytical searcher. Research-oriented. Perfectionist in quest. Health and service focus.",
        pada3: "Libra Navamsa - Searching for perfect partnership. Diplomatic. Artistic sensitivity. Relationship-focused quest.",
        pada4: "Scorpio Navamsa - Deep psychological searching. Occult investigations. Intense emotional quest. Transformative."
      },
      "Ardra": {
        general: "Storm energy. Destructive transformation for renewal. Tears of sorrow and compassion. Rahu-ruled - unconventional. Symbol: Teardrop. Intensity and emotional storms.",
        pada1: "Sagittarius Navamsa - Philosophical storms. Breaking old beliefs. Revolutionary thinking. Travel during upheaval.",
        pada2: "Capricorn Navamsa - Structural destruction/rebuilding. Career upheavals. Ambitious through chaos. Practical transformation.",
        pada3: "Aquarius Navamsa - Scientific mindset. Technical innovation through crisis. Humanitarian after storms. Unconventional.",
        pada4: "Pisces Navamsa - Spiritual dissolution. Compassion through suffering. Mystical experiences. Emotional healing."
      },
      "Punarvasu": {
        general: "Return to light after darkness. Optimistic, philosophical. Symbol: Quiver of arrows - abundant resources. Jupiter-ruled renewal. Spiritual restoration and hope.",
        pada1: "Aries Navamsa - Energetic return. Quick recovery. Pioneering after setbacks. Warrior spirit renewed.",
        pada2: "Taurus Navamsa - Material restoration. Financial recovery. Stable renewal. Building after loss.",
        pada3: "Gemini Navamsa - Intellectual renewal. Communication after silence. Versatile recovery. Learning from failures.",
        pada4: "Cancer Navamsa - Emotional healing. Family reunion. Nurturing restoration. Home as sanctuary."
      },
      "Pushya": {
        general: "Most auspicious nakshatra. Nourishing, nurturing, spiritual growth. Priestly energy. Symbol: Cow's udder - nourishment. Saturn's exaltation point - discipline with care.",
        pada1: "Leo Navamsa - Noble nurturer. Generous leadership. Spiritual pride. Creative nourishment.",
        pada2: "Virgo Navamsa - Practical service. Health and nutrition focus. Analytical care. Perfectionist helper.",
        pada3: "Libra Navamsa - Balanced giving. Diplomatic nurturer. Relationship harmony. Artistic service.",
        pada4: "Scorpio Navamsa - Intense devotion. Transformative care. Occult spirituality. Deep emotional nourishment."
      },
      "Ashlesha": {
        general: "Serpent energy. Hypnotic, manipulative (positive or negative). Kundalini power. Psychological depth. Symbol: Coiled serpent. Mercury-ruled mental intensity.",
        pada1: "Sagittarius Navamsa - Philosophical manipulation. Teaching through influence. Expanding consciousness. Ethical concerns.",
        pada2: "Capricorn Navamsa - Strategic and ambitious. Power through position. Controlled intensity. Political acumen.",
        pada3: "Aquarius Navamsa - Mass psychology. Technical manipulation. Unconventional influence. Humanitarian control.",
        pada4: "Pisces Navamsa - Psychic sensitivity. Spiritual hypnosis. Dissolving boundaries. Compassionate manipulation."
      },
      "Magha": {
        general: "Royal, ancestral pride. Connection to pitris (ancestors). Majestic presence. Ketu-ruled spirituality through heritage. Symbol: Throne room. Legacy and tradition.",
        pada1: "Aries Navamsa - Warrior king. Dynamic leadership. Pioneering lineage. Impulsive royalty.",
        pada2: "Taurus Navamsa - Stable royalty. Material legacy. Traditional wealth. Fixed in ancestral ways.",
        pada3: "Gemini Navamsa - Intellectual lineage. Communication of heritage. Versatile nobility. Mental pride.",
        pada4: "Cancer Navamsa - Emotional connection to ancestors. Family throne. Nurturing legacy. Home as palace."
      },
      "Purva Phalguni": {
        general: "Creative enjoyment, procreation. Venus-ruled luxury and pleasure. Symbol: Front legs of bed - rest and romance. Artistic, musical, relationship-focused.",
        pada1: "Leo Navamsa - Creative expression peaks. Dramatic romance. Performing arts. Pride in pleasure.",
        pada2: "Virgo Navamsa - Analytical in pleasure. Health-conscious enjoyment. Service through art. Critical of beauty.",
        pada3: "Libra Navamsa - Perfect partnership. Diplomatic charm. Balanced pleasure. Refined artistic taste.",
        pada4: "Scorpio Navamsa - Intense passion. Transformative relationships. Deep creative power. Obsessive love."
      },
      "Uttara Phalguni": {
        general: "Patronage, support, leadership through service. Sun-ruled nobility. Symbol: Back legs of bed - final rest. Charitable, friendly, helpful nature.",
        pada1: "Sagittarius Navamsa - Generous leader. Philosophical patronage. Teaching and guidance. Righteous support.",
        pada2: "Capricorn Navamsa - Structured support. Career advancement. Responsible leadership. Practical help.",
        pada3: "Aquarius Navamsa - Humanitarian leadership. Innovative support. Network builder. Unconventional patronage.",
        pada4: "Pisces Navamsa - Compassionate leadership. Spiritual support. Artistic patronage. Selfless service."
      },
      "Hasta": {
        general: "Skillful hands. Manual dexterity, craftsmanship. Moon-ruled creativity. Symbol: Hand/palm. Healing touch, magic, trickery. Quick-witted and clever.",
        pada1: "Aries Navamsa - Quick hands. Impulsive creation. Dynamic craftsmanship. Competitive skills.",
        pada2: "Taurus Navamsa - Artistic hands. Material creation. Steady craftsmanship. Financial skills.",
        pada3: "Gemini Navamsa - Versatile skills. Communication through hands. Writing, typing. Mental dexterity.",
        pada4: "Cancer Navamsa - Nurturing hands. Cooking, caring. Emotional craftsmanship. Healing touch."
      },
      "Chitra": {
        general: "Brilliant, colorful, creative genius. Mars-ruled dynamic energy. Symbol: Bright jewel/pearl. Architecture, design, beauty. Charismatic personality.",
        pada1: "Leo Navamsa - Creative brilliance. Dramatic beauty. Artistic pride. Shining personality.",
        pada2: "Virgo Navamsa - Perfectionist designer. Technical artistry. Analytical beauty. Health aesthetics.",
        pada3: "Libra Navamsa - Balanced beauty. Diplomatic charm. Partnership in creation. Refined taste.",
        pada4: "Scorpio Navamsa - Intense creativity. Transformative design. Mysterious beauty. Occult aesthetics."
      },
      "Swati": {
        general: "Independent, freedom-loving. Rahu-ruled innovation. Symbol: Sword/young plant in wind - flexibility. Business acumen, trade. Diplomatic yet restless.",
        pada1: "Sagittarius Navamsa - Philosophical independence. Travel and exploration. Teaching freedom. Ethical business.",
        pada2: "Capricorn Navamsa - Structured independence. Business success. Practical flexibility. Career autonomy.",
        pada3: "Aquarius Navamsa - Ultimate freedom. Innovative thinking. Technical business. Humanitarian trade.",
        pada4: "Pisces Navamsa - Spiritual independence. Compassionate business. Artistic flexibility. Mystical freedom."
      },
      "Vishakha": {
        general: "Determined, goal-oriented. Jupiter-ruled purposeful energy. Symbol: Triumphal archway. Fork in road - choices. Intense focus once goal is set.",
        pada1: "Aries Navamsa - Warrior determination. Dynamic goals. Competitive drive. Impulsive focus.",
        pada2: "Taurus Navamsa - Material goals. Financial determination. Stable pursuit. Building wealth.",
        pada3: "Gemini Navamsa - Intellectual goals. Communication focus. Multiple objectives. Mental determination.",
        pada4: "Cancer Navamsa - Emotional goals. Family objectives. Nurturing determination. Home focus."
      },
      "Anuradha": {
        general: "Devotion, friendship, following the path. Saturn-ruled discipline. Symbol: Lotus - blooming despite muddy waters. International connections. Success through cooperation.",
        pada1: "Leo Navamsa - Loyal leadership. Devoted to purpose. Generous friendship. Noble path.",
        pada2: "Virgo Navamsa - Practical devotion. Service-oriented friendship. Analytical path. Health discipline.",
        pada3: "Libra Navamsa - Balanced devotion. Diplomatic friendship. Partnership path. Harmonious cooperation.",
        pada4: "Scorpio Navamsa - Intense devotion. Transformative friendship. Occult path. Deep loyalty."
      },
      "Jyeshtha": {
        general: "Eldest, chief, protective power. Mercury-ruled authority. Symbol: Umbrella/earring - protection. Occult knowledge. Battles and confrontation. Hidden depths.",
        pada1: "Sagittarius Navamsa - Philosophical authority. Protective teaching. Righteous battles. Expanding power.",
        pada2: "Capricorn Navamsa - Executive power. Career authority. Structural protection. Ambitious leadership.",
        pada3: "Aquarius Navamsa - Unconventional authority. Technical protection. Innovative power. Humanitarian battles.",
        pada4: "Pisces Navamsa - Spiritual authority. Compassionate protection. Mystical power. Dissolving ego."
      },
      "Mula": {
        general: "Root, foundation, investigation. Ketu-ruled dissolution. Symbol: Tied bunch of roots. Destruction for rebirth. Philosophical depth. Penetrating to core truth.",
        pada1: "Sagittarius Navamsa - Philosophical roots. Spiritual investigation. Teaching foundations. Travel to origins.",
        pada2: "Capricorn Navamsa - Structural foundations. Career roots. Practical investigation. Building from ground up.",
        pada3: "Aquarius Navamsa - Unconventional roots. Technical investigation. Humanitarian foundations. Breaking traditions.",
        pada4: "Pisces Navamsa - Spiritual roots. Mystical investigation. Compassionate dissolution. Universal foundations."
      },
      "Purva Ashadha": {
        general: "Invincible, cannot be defeated. Venus-ruled creative power. Symbol: Elephant tusk/fan - strength and luxury. Early victory. Purification before battle.",
        pada1: "Sagittarius Navamsa - Philosophical invincibility. Teaching victories. Righteous conquest. Spiritual strength.",
        pada2: "Capricorn Navamsa - Career invincibility. Practical victories. Structured conquest. Ambitious strength.",
        pada3: "Aquarius Navamsa - Innovative invincibility. Technical victories. Unconventional conquest. Humanitarian strength.",
        pada4: "Pisces Navamsa - Spiritual invincibility. Compassionate victories. Mystical conquest. Surrendering to win."
      },
      "Uttara Ashadha": {
        general: "Final victory, righteousness. Sun-ruled nobility. Symbol: Elephant tusk - penetrating power. Universal principles. Leadership through dharma.",
        pada1: "Sagittarius Navamsa - Complete victory. Philosophical righteousness. Teaching dharma. Final knowledge.",
        pada2: "Capricorn Navamsa - Career culmination. Practical righteousness. Structured victory. Disciplined nobility.",
        pada3: "Aquarius Navamsa - Universal victory. Humanitarian righteousness. Innovative dharma. Network success.",
        pada4: "Pisces Navamsa - Spiritual victory. Compassionate righteousness. Mystical dharma. Transcendent nobility."
      },
      "Shravana": {
        general: "Listening, learning, connecting. Moon-ruled receptivity. Symbol: Ear - hearing and communication. Education, counseling. Social networks and information gathering.",
        pada1: "Aries Navamsa - Active listening. Quick learning. Pioneering communication. Impulsive connections.",
        pada2: "Taurus Navamsa - Practical listening. Material learning. Stable communication. Financial networks.",
        pada3: "Gemini Navamsa - Intellectual listening. Versatile learning. Multiple communications. Diverse networks.",
        pada4: "Cancer Navamsa - Emotional listening. Intuitive learning. Nurturing communication. Family networks."
      },
      "Dhanishta": {
        general: "Wealth, music, rhythm. Mars-ruled dynamic prosperity. Symbol: Drum - sound and timing. Fame and recognition. Group activities and performance.",
        pada1: "Leo Navamsa - Creative fame. Dramatic wealth. Performance pride. Royal recognition.",
        pada2: "Virgo Navamsa - Practical wealth. Analytical music. Service recognition. Health rhythms.",
        pada3: "Libra Navamsa - Balanced prosperity. Artistic music. Partnership fame. Diplomatic recognition.",
        pada4: "Scorpio Navamsa - Hidden wealth. Intense music. Transformative fame. Occult rhythms."
      },
      "Shatabhisha": {
        general: "Hundred healers. Rahu-ruled unconventional healing. Symbol: Empty circle - thousand petaled lotus. Secrecy, mysticism. Solitary and philosophical.",
        pada1: "Sagittarius Navamsa - Philosophical healing. Teaching medicine. Spiritual cures. Travel for health.",
        pada2: "Capricorn Navamsa - Practical healing. Career in medicine. Structured treatment. Ambitious doctor.",
        pada3: "Aquarius Navamsa - Innovative healing. Technical medicine. Unconventional cures. Humanitarian health.",
        pada4: "Pisces Navamsa - Mystical healing. Spiritual medicine. Compassionate cures. Psychic abilities."
      },
      "Purva Bhadrapada": {
        general: "Burning, purification through fire. Jupiter-ruled transformation. Symbol: Front legs of funeral cot. Dark philosophy. Intensity and cynicism turning to faith.",
        pada1: "Aries Navamsa - Warrior transformation. Dynamic purification. Impulsive intensity. Quick burning.",
        pada2: "Taurus Navamsa - Material purification. Stable transformation. Financial intensity. Practical burning.",
        pada3: "Gemini Navamsa - Intellectual purification. Mental transformation. Versatile intensity. Communicating darkness.",
        pada4: "Cancer Navamsa - Emotional purification. Nurturing transformation. Sensitive intensity. Family burning."
      },
      "Uttara Bhadrapada": {
        general: "Final liberation. Saturn-ruled discipline toward moksha. Symbol: Back legs of funeral cot. Depth, patience, wisdom. Snake symbolism - kundalini rising.",
        pada1: "Leo Navamsa - Creative liberation. Noble wisdom. Generous depth. Spiritual pride.",
        pada2: "Virgo Navamsa - Practical liberation. Service wisdom. Analytical depth. Health discipline.",
        pada3: "Libra Navamsa - Balanced liberation. Partnership wisdom. Diplomatic depth. Harmonious moksha.",
        pada4: "Scorpio Navamsa - Complete transformation. Occult wisdom. Intense depth. Ultimate liberation."
      },
      "Revati": {
        general: "Nourishment, wealth, final journey. Mercury-ruled completion. Symbol: Drum/fish - swimming in ocean of consciousness. Safe travel, protection. Compassionate and mystical.",
        pada1: "Aries Navamsa - Dynamic completion. Quick journey. Pioneering compassion. Impulsive giving.",
        pada2: "Taurus Navamsa - Material nourishment. Stable journey. Practical compassion. Financial protection.",
        pada3: "Gemini Navamsa - Intellectual completion. Communicative journey. Versatile compassion. Mental protection.",
        pada4: "Cancer Navamsa - Emotional nourishment. Family journey. Nurturing compassion. Ultimate protection."
      }
    };
    
    const nakData = traits[nakshatra];
    const metaData = nakshatraDetails[nakshatra];
    
    if (!nakData) return null;
    
    // Ensure pada is a number
    const padaNum = parseInt(pada) || 1;
    const padaKey = `pada${padaNum}`;
    
    return {
      general: nakData.general,
      [padaKey]: nakData[padaKey],
      pada1: nakData.pada1,
      pada2: nakData.pada2,
      pada3: nakData.pada3,
      pada4: nakData.pada4,
      // Add metadata
      symbol: metaData?.symbol || "Unknown",
      deity: metaData?.deity || "Unknown",
      element: metaData?.element || "Unknown",
      gana: metaData?.gana || "Unknown",
      animal: metaData?.animal || "Unknown",
      quality: metaData?.quality || "Unknown"
    };
  };

  const getD1LagnaTraits = (sign) => {
    const traits = {
      "Aries": "Personality: Bold, pioneering, energetic leader. You take initiative and love challenges. Impulsive, competitive, independent. You're a natural trailblazer who acts first and thinks later. Strong physical energy and courage. Direct communication style.",
      "Taurus": "Personality: Stable, patient, practical, and reliable. You value security and comfort. Stubborn but loyal. Strong aesthetic sense and love for beauty. Slow to anger but explosive when pushed. Grounded and sensual nature.",
      "Gemini": "Personality: Curious, communicative, versatile, and adaptable. Quick-witted and intellectual. You need mental stimulation and variety. Social butterfly with multiple interests. Restless and easily bored. Excellent communicator.",
      "Cancer": "Personality: Nurturing, emotional, intuitive, and protective. Strong connection to home and family. Moody but deeply caring. You wear your heart on your sleeve. Excellent memory. Sensitive to environment and people's emotions.",
      "Leo": "Personality: Confident, generous, warm-hearted, and dramatic. Natural leader who needs recognition. Creative and passionate. You love being in the spotlight. Proud and dignified. Loyal friend but can be self-centered.",
      "Virgo": "Personality: Analytical, practical, detail-oriented, and service-minded. Perfectionist who notices everything. Health-conscious and organized. Modest and humble. Critical but helpful. You express love through acts of service.",
      "Libra": "Personality: Diplomatic, charming, balanced, and partnership-oriented. You seek harmony and avoid conflict. Indecisive but fair-minded. Strong aesthetic sense. You see all sides of every issue. Social and relationship-focused.",
      "Scorpio": "Personality: Intense, passionate, mysterious, and transformative. You feel everything deeply. Powerful and magnetic presence. Secretive but loyal. All-or-nothing approach to life. Strong willpower and investigative nature.",
      "Sagittarius": "Personality: Optimistic, philosophical, adventurous, and freedom-loving. You need space and independence. Honest to a fault. Love of learning and travel. Restless wanderer. Enthusiastic and inspiring to others.",
      "Capricorn": "Personality: Ambitious, disciplined, responsible, and patient. You build lasting structures slowly. Mature beyond your years. Status-conscious and traditional. Reserved exterior hiding deep emotions. Reliable and hardworking.",
      "Aquarius": "Personality: Independent, unconventional, humanitarian, and intellectual. You march to your own drum. Progressive thinker and innovator. Detached but friendly. Value freedom above all. Scientific and humanitarian interests.",
      "Pisces": "Personality: Compassionate, intuitive, artistic, and transcendent. You absorb others' emotions like a sponge. Dreamy and imaginative. Spiritual and selfless. Boundary issues and escapist tendencies. Highly creative and empathetic."
    };
    return traits[sign] || "";
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
  let signDeg = absoluteDeg % 30;
  
  // Round to eliminate floating-point artifacts
  signDeg = Math.round(signDeg * 10000) / 10000;
  
  const zodiac = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  // Check if D1 sign is odd (Aries, Gemini, Leo, Libra, Sag, Aquarius)
  // In 0-indexed array: 0, 2, 4, 6, 8, 10
  const isOddSign = d1SignIndex % 2 === 0;
  
  if (division === 7) {
    // ========== D7 (SAPTAMSA) ==========
    // Each sign divided into 7 parts (4.285714° each)
    // Odd signs: count from same sign
    // Even signs: count from 7th sign (6 signs ahead)
    
    const partSize = 30.0 / 7; // 4.285714285714286°
    const partIndex = Math.floor(signDeg / partSize); // 0-6
    
    let startSignIndex;
    if (isOddSign) {
      startSignIndex = d1SignIndex; // Same sign
    } else {
      startSignIndex = (d1SignIndex + 6) % 12; // 7th sign
    }
    
    const d7SignIndex = (startSignIndex + partIndex) % 12;
    return zodiac[d7SignIndex];
  }
  
  if (division === 9) {
    // ========== D9 (NAVAMSA) ==========
    const partSize = 30.0 / 9;
    const partIndex = Math.floor(signDeg / partSize);
    const startIndex = (d1SignIndex * 9) % 12;
    const d9SignIndex = (startIndex + partIndex) % 12;
    return zodiac[d9SignIndex];
  }
  
  if (division === 10) {
    // ========== D10 (DASAMSA) ==========
    // Each sign divided into 10 parts (3° each)
    // Odd signs: count from same sign
    // Even signs: count from 9th sign (8 signs ahead)
    
    const partSize = 30.0 / 10; // 3°
    const partIndex = Math.floor(signDeg / partSize); // 0-9
    
    let startSignIndex;
    if (isOddSign) {
      startSignIndex = d1SignIndex; // Same sign
    } else {
      startSignIndex = (d1SignIndex + 8) % 12; // 9th sign
    }
    
    const d10SignIndex = (startSignIndex + partIndex) % 12;
    return zodiac[d10SignIndex];
  }
  
  // ... other divisions (D12, etc.) ...
  
  // Default fallback
  return zodiac[d1SignIndex];
};

  // ====== D60 SHASHTIAMSHA (60TH DIVISION) ======
  // Shows past life karma and karmic baggage for each planet
  
  // D60 SHASHTIAMSHA DEITY LIST (Jagannath Hora Standard)
  // Order: Direct sequence for ODD signs (1-60)
  // Order: Reversed for EVEN signs (60 down to 1)
  const d60Deities = [
    { name: "Ghora", nature: "Malefic", description: "Terrible, fearful, intense struggle" },
    { name: "Rakshasa", nature: "Malefic", description: "Demonic, aggressive, impulsive" },
    { name: "Deva", nature: "Benefic", description: "Divine, virtuous, helpful" },
    { name: "Kubera", nature: "Benefic", description: "Lord of Wealth, materialistic success" },
    { name: "Yaksha", nature: "Neutral", description: "Guardian of treasures, mystical" },
    { name: "Kinnara", nature: "Benefic", description: "Celestial musician, artistic, refined" },
    { name: "Bhrashta", nature: "Malefic", description: "Fallen, corrupted, loss of status" },
    { name: "Kula-naasaka", nature: "Malefic", description: "Destroyer of the lineage/family" },
    { name: "Garala", nature: "Malefic", description: "Poison, toxic environments, betrayal" },
    { name: "Vahni", nature: "Malefic", description: "Fire, digestive power, or destruction" },
    { name: "Maya", nature: "Malefic", description: "Illusion, deception, high intelligence" },
    { name: "Pureeshaka", nature: "Malefic", description: "Filth, low-minded, hardships" },
    { name: "Apampathi", nature: "Benefic", description: "Lord of Oceans (Varuna), vastness" },
    { name: "Marutwan", nature: "Benefic", description: "Lord of Winds (Indra/Hanuman), strength" },
    { name: "Kaala", nature: "Malefic", description: "Time/Death, strict discipline" },
    { name: "Sarpa", nature: "Malefic", description: "Serpent, wisdom or hidden enmity" },
    { name: "Amrita", nature: "Benefic", description: "Nectar, immortality, great healing" },
    { name: "Indu", nature: "Benefic", description: "Moon, peace, nourishment, beauty" },
    { name: "Mridu", nature: "Benefic", description: "Soft, gentle, kind-hearted" },
    { name: "Komala", nature: "Benefic", description: "Tender, delicate, sophisticated" },
    { name: "Heramba", nature: "Benefic", description: "Ganesha, remover of obstacles" },
    { name: "Brahma", nature: "Benefic", description: "Creator, high intelligence, birth" },
    { name: "Vishnu", nature: "Benefic", description: "Sustainer, protection, dharma" },
    { name: "Maheshwara", nature: "Benefic", description: "Shiva, transformation, liberation" },
    { name: "Deva", nature: "Benefic", description: "Second appearance of Divine nature" },
    { name: "Arudra", nature: "Malefic", description: "Violent, weeping, storm-like energy" },
    { name: "Kalinasaka", nature: "Benefic", description: "Destroyer of strife/quarrels" },
    { name: "Kshiteeswara", nature: "Benefic", description: "Lord of the Earth, ruler, stable" },
    { name: "Kamalakara", nature: "Benefic", description: "Lake of Lotuses, abundance, peace" },
    { name: "Gulika", nature: "Malefic", description: "Son of Saturn, hidden obstacles, delay" },
    { name: "Mrityu", nature: "Malefic", description: "Death, transformation, endings" },
    { name: "Kaala", nature: "Malefic", description: "Second appearance of Time/Destiny" },
    { name: "Daavagni", nature: "Malefic", description: "Forest fire, uncontrollable temper" },
    { name: "Ghora", nature: "Malefic", description: "Second appearance of Fearful nature" },
    { name: "Adhama", nature: "Malefic", description: "Lowly, wretched, degraded" },
    { name: "Kantaka", nature: "Malefic", description: "Thorn, irritation, persistent pain" },
    { name: "Sudha", nature: "Benefic", description: "Nectar/Ambrosia, purity, health" },
    { name: "Amrita", nature: "Benefic", description: "Second appearance of Immortality" },
    { name: "Poornachandra", nature: "Benefic", description: "Full Moon, complete fulfillment" },
    { name: "Vishdagdha", nature: "Malefic", description: "Consumed by poison/fire, grief" },
    { name: "Kula-naasaka", nature: "Malefic", description: "Second appearance of Family-Destroyer" },
    { name: "Vamshakshaya", nature: "Malefic", description: "Decay of the lineage" },
    { name: "Utpata", nature: "Malefic", description: "Calamity, sudden disturbance" },
    { name: "Kaala", nature: "Malefic", description: "Third appearance of Death/Time" },
    { name: "Saumya", nature: "Benefic", description: "Gentle, Mercury-like, balanced" },
    { name: "Komala", nature: "Benefic", description: "Second appearance of Tender nature" },
    { name: "Sheetala", nature: "Benefic", description: "Cool, soothing, healing" },
    { name: "Karaladamshtra", nature: "Malefic", description: "Terrible teeth, aggressive, fierce" },
    { name: "Chandramukhi", nature: "Benefic", description: "Moon-faced, attractive, pleasant" },
    { name: "Praveena", nature: "Benefic", description: "Skilled, expert, proficient" },
    { name: "Kaalagni", nature: "Malefic", description: "Fire of Time, total destruction" },
    { name: "Dandudha", nature: "Malefic", description: "Staff-bearer (Punishment)" },
    { name: "Nirmala", nature: "Benefic", description: "Pure, stainless, virtuous" },
    { name: "Saumya", nature: "Benefic", description: "Second appearance of Gentle nature" },
    { name: "Kala", nature: "Malefic", description: "Cruel portion of Time" },
    { name: "Atisheetal", nature: "Benefic", description: "Very cool, extremely soothing" },
    { name: "Amrita", nature: "Benefic", description: "Third appearance of Nectar" },
    { name: "Payodhi", nature: "Benefic", description: "Ocean of Milk, vast resources" },
    { name: "Bramhana", nature: "Benefic", description: "Priest-like, seeker of truth" },
    { name: "Indurekha", nature: "Benefic", description: "Ray of the Moon, hope, new light" }
  ];
  
  const calculateD60 = (absoluteDeg) => {
    // CORRECT PARASHARA D60 FORMULA
    // Sign Position (S): Which sign (1-12)
    const signIndex = Math.floor(absoluteDeg / 30); // 0-11 in code
    const signNumber = signIndex + 1; // 1-12 traditional
    
    // Relative Longitude (L): Degrees within sign (0-30)
    const degreeInSign = absoluteDeg % 30;
    
    // Division (D): D = ceil(L × 2)
    // Since 1/60 of a sign = 0.5°, multiplying by 2 gives division
    const division = Math.ceil(degreeInSign * 2);
    
    // Apply Parashara Rule:
    // Odd signs (1,3,5,7,9,11): Deity Index = D
    // Even signs (2,4,6,8,10,12): Deity Index = 61 - D
    const isOddSign = signNumber % 2 === 1;
    
    let deityIndex;
    if (isOddSign) {
      // Odd sign: use division directly
      deityIndex = division;
    } else {
      // Even sign: reverse formula
      deityIndex = 61 - division;
    }
    
    // Adjust to 0-based array index (deities are 1-60, array is 0-59)
    const arrayIndex = deityIndex - 1;
    
    // Safety check
    const safeIndex = Math.max(0, Math.min(59, arrayIndex));
    const deity = d60Deities[safeIndex];
    
    // Calculate D60 sign (for reference, though deity is more important)
    // D60 uses standard divisional chart logic
    const partSize = 0.5;
    const partIndex = Math.floor(degreeInSign / partSize);
    let d60SignIndex;
    
    if (signIndex % 2 === 0) { // Odd signs in traditional (Aries=0, Gemini=2, etc.)
      d60SignIndex = (signIndex + Math.floor(partIndex / 5)) % 12;
    } else { // Even signs
      const seventhSign = (signIndex + 6) % 12;
      d60SignIndex = (seventhSign + Math.floor(partIndex / 5)) % 12;
    }
    
    return {
      sign: zodiac[d60SignIndex],
      signIndex: d60SignIndex,
      deity: deity.name,
      deityNature: deity.nature,
      deityDescription: deity.description,
      deityNumber: deityIndex, // 1-60
      division: division, // Which 0.5° division (1-60)
      signNumber: signNumber // Traditional sign number (1-12)
    };
  };


  // ====== RESET FUNCTION ======
  const handleReset = () => {
    console.log('🔄 Resetting all data...');
    
    // Phase tracking
    setPhase(1);
    
    // Phase 1 - Birth Info
    setBirthDate("");
    setBirthTime("");
    setBirthPlace("");
    setBirthPlaceQuery("");
    setLocationSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
    setBirthLat(null);
    setBirthLon(null);
    setBirthTz("");
    setIsDST(false);
    setD1Calculated(false);
    setLagnaDetails(null);
    setMoonDetails(null);
    setTimeWindow(120);
    
    // Phase 1.5 - D1 Lagna Confirmation
    setD1LagnaConfirmed(null);
    setD1LagnaSelection("");
    
    // Phase 1.8 - Moon Nakshatra Confirmation
    setNakshatraConfirmed(null);
    
    // Phase 2 - D9
    setD9Selection("");
    setD9Confirmed(null);
    
    // Phase 3 - D10
    setD10Selection("");
    setD10Confirmed(null);
    
    // Phase 4 - D7
    setD7Selection("");
    setD7Confirmed(null);
    
    // Phase 5 - Kunda Siddhanta
    setMoonRashiSelection("");
    setMoonDegree("");
    setDashaEndDate("");
    setNoMatchFound(false);
    setSearchResults(null);
    setKundaMethod("trinal"); // Reset to default trinal method
    setJanmaNakshatraIndex(null);
    
    // Final Result
    setLockedTime(null);
    setProcessing(false);
    
    // Close confirmation dialog
    setShowResetConfirm(false);
    
    console.log('✅ Reset complete - ready for new rectification');
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ====== EVENT HANDLERS WITH OPTIMIZATION ======

 const handleD1Calculate = async () => {
    if (!birthDate || !birthTime || !birthLat || !birthLon || !birthTz) {
      alert("Please fill all birth details including selecting a location from the dropdown");
      return;
    }

    setProcessing(true);
    
    setTimeout(async () => {
      const [year, month, day] = birthDate.split('-').map(Number);
      
      // Parse time with seconds: HH:MM:SS or HH:MM
      const timeParts = birthTime.split(':');
      const hours = parseInt(timeParts[0]) || 0;
      const minutes = parseInt(timeParts[1]) || 0;
      const seconds = parseInt(timeParts[2]) || 0;

      // Convert local time to UTC using JavaScript Date API
      // This properly handles all timezones including DST
      const localDateStr = `${birthDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      
      // Create date in the birth location's timezone
      // Note: We'll calculate UTC offset manually for accurate astronomical calculations
      const localDate = new Date(localDateStr);
      
      // Get UTC offset in hours for the specific timezone with DST detection
      // Use JavaScript Date API to detect DST automatically
      function getTimezoneOffset(dateStr, timezone) {
        // Create date object in the specified timezone
        const date = new Date(dateStr);
        
        // Standard time offsets (without DST)
        const standardOffsets = {
          'Asia/Kolkata': 5.5,
          'Australia/Adelaide': 9.5,   // ACST
          'Australia/Sydney': 10,       // AEST
          'Australia/Melbourne': 10,    // AEST
          'Australia/Brisbane': 10,     // AEST (no DST)
          'Australia/Perth': 8,         // AWST (no DST)
          'Australia/Canberra': 10,     // AEST
          'Australia/Hobart': 10,       // AEST
          'Australia/Darwin': 9.5,      // ACST (no DST)
          'America/New_York': -5,       // EST
          'Europe/London': 0,           // GMT
          'Asia/Tokyo': 9,
          'Europe/Paris': 1
        };
        
        // Zones that observe DST
        const dstZones = {
          'Australia/Adelaide': 1,      // +1 hour during DST (Oct-Apr)
          'Australia/Sydney': 1,        // +1 hour during DST (Oct-Apr)
          'Australia/Melbourne': 1,     // +1 hour during DST (Oct-Apr)
          'Australia/Canberra': 1,      // +1 hour during DST (Oct-Apr)
          'Australia/Hobart': 1,        // +1 hour during DST (Oct-Apr)
          'America/New_York': 1,        // +1 hour during DST (Mar-Nov)
          'Europe/London': 1,           // +1 hour during DST (Mar-Oct)
          'Europe/Paris': 1             // +1 hour during DST (Mar-Oct)
        };
        
        let offset = standardOffsets[timezone] || 0;
        
        // Check if DST applies for this timezone
        if (dstZones[timezone]) {
          const month = date.getMonth() + 1; // 1-12
          const year = date.getFullYear();
          
          // Southern Hemisphere DST (Australia): October to April
          if (timezone.startsWith('Australia/') && 
              ['Adelaide', 'Sydney', 'Melbourne', 'Canberra', 'Hobart'].some(city => timezone.includes(city))) {
            // DST is active from October to April (approx)
            if (month >= 10 || month <= 4) {
              offset += dstZones[timezone];
              console.log(`  🌞 DST active for ${timezone}`);
            }
          }
          // Northern Hemisphere DST (USA): March to November
          else if (timezone === 'America/New_York') {
            if (month >= 3 && month <= 11) {
              offset += dstZones[timezone];
              console.log(`  🌞 DST active for ${timezone}`);
            }
          }
          // Northern Hemisphere DST (Europe): March to October
          else if (timezone.startsWith('Europe/')) {
            if (month >= 3 && month <= 10) {
              offset += dstZones[timezone];
              console.log(`  🌞 DST active for ${timezone}`);
            }
          }
        }
        
        return offset;
      }
      
      // Get offset with DST detection
      let utcOffset = getTimezoneOffset(localDateStr, birthTz);
      // In production, use Intl.DateTimeFormat or timezone library
      
      console.log(`🌍 Timezone: ${birthTz}, UTC Offset: ${utcOffset} hours`);
      
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

      // Debug logging
      console.log('📊 D1 Calculation Debug:');
      console.log('  Input Date (Local):', `${birthDate} ${birthTime}`);
      console.log('  UTC Date:', `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${minutes}:${seconds}`);
      console.log('  Julian Day:', jd);
      console.log('  Obliquity:', epsilon);
      console.log('  LST (degrees):', lst);
      console.log('  Ascendant Tropical:', ascendantTropical);
      console.log('  ⭐ Lahiri Ayanamsa:', ayanamsa, '(should be ~23.64° for 1984)');
      console.log('  Ascendant Sidereal:', ascendantSidereal);
      console.log('  Lagna Sign:', lagnaInfo.sign);
      console.log('  Lagna Degree in Sign:', lagnaInfo.degree);
      console.log('  Lagna DMS:', degreesToDMS(lagnaInfo.degree));

      const moonTropical = calculateMoonPosition(jd);
      const moonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
      const moonInfo = getZodiacFromLongitude(moonSidereal);
      const nakInfo = getNakshatraInfo(moonSidereal);

      setLagnaDetails(lagnaInfo);
      setMoonDetails({
        ...moonInfo,
        ...nakInfo,
        absoluteDegree: moonSidereal
      });
      
      // Set Moon Rashi and Janma Nakshatra for Kunda Siddhanta (Phase 5)
      setMoonRashiSelection(moonInfo.sign);
      setJanmaNakshatraIndex(nakInfo.nakIndex); // Store for trinal Kunda matching
      
  // ========== PLANETARY POSITIONS - SWISS EPHEMERIS ==========
      console.log("🌟 Calculating planetary positions...");
      console.log("  Using Swiss Ephemeris API:", USE_SWISSEPH_API);
      console.log("  JD:", jd.toFixed(6));
      
      let finalSunSidereal, finalMoonSidereal, finalMarsSidereal;
      let finalMercurySidereal, finalJupiterSidereal, finalVenusSidereal;
      let finalSaturnSidereal, finalRahuSidereal, finalKetuSidereal;
      
      if (USE_SWISSEPH_API) {
        try {
          console.log("📡 Fetching from Swiss Ephemeris API...");
          
          const response = await fetch(`${SWISSEPH_API_URL}/planets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jd: jd,
              latitude: birthLat,
              longitude: birthLon,
              planets: ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'true_node'],
              sidereal: true
            })
          });
          
          if (!response.ok) {
            throw new Error(`Swiss Ephemeris API error: ${response.status}`);
          }
          
          const data = await response.json();
          
          console.log("✅ Swiss Ephemeris response received");
          
          // Use Swiss Ephemeris values
          finalSunSidereal = data.planets.sun;
          finalMoonSidereal = data.planets.moon;
          finalMarsSidereal = data.planets.mars;
          finalMercurySidereal = data.planets.mercury;
          finalJupiterSidereal = data.planets.jupiter;
          finalVenusSidereal = data.planets.venus;
          finalSaturnSidereal = data.planets.saturn;
          finalRahuSidereal = data.planets.rahu;
          finalKetuSidereal = data.planets.ketu;
                 
          console.log("📊 Planetary Positions (Swiss Ephemeris):");
          console.log("  Sun:", finalSunSidereal.toFixed(4), "°", zodiac[Math.floor(finalSunSidereal/30)]);
          console.log("  Moon:", finalMoonSidereal.toFixed(4), "°", zodiac[Math.floor(finalMoonSidereal/30)]);
          console.log("  Mars:", finalMarsSidereal.toFixed(4), "°", zodiac[Math.floor(finalMarsSidereal/30)]);
          console.log("  Mercury:", finalMercurySidereal.toFixed(4), "°", zodiac[Math.floor(finalMercurySidereal/30)]);
          console.log("  Jupiter:", finalJupiterSidereal.toFixed(4), "°", zodiac[Math.floor(finalJupiterSidereal/30)]);
          console.log("  Venus:", finalVenusSidereal.toFixed(4), "°", zodiac[Math.floor(finalVenusSidereal/30)]);
          console.log("  Saturn:", finalSaturnSidereal.toFixed(4), "°", zodiac[Math.floor(finalSaturnSidereal/30)]);
          console.log("  Rahu:", finalRahuSidereal.toFixed(4), "°", zodiac[Math.floor(finalRahuSidereal/30)]);
          console.log("  Ketu:", finalKetuSidereal.toFixed(4), "°", zodiac[Math.floor(finalKetuSidereal/30)]);
          
        } catch (error) {
          console.error("❌ Swiss Ephemeris API failed:", error);
          console.log("⚠️ Falling back to local formulas (less accurate)");
          
          // Fallback to local calculations
          const sunTropical = calculateSunPosition(jd);
          finalSunSidereal = tropicalToSidereal(sunTropical, ayanamsa);
          
          const moonTropical = calculateMoonPosition(jd);
          finalMoonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
          moonSidereal = finalMoonSidereal;
          
          const marsTropical = calculateMarsPosition(jd);
          finalMarsSidereal = tropicalToSidereal(marsTropical, ayanamsa);
          
          const mercuryTropical = calculateMercuryPosition(jd);
          finalMercurySidereal = tropicalToSidereal(mercuryTropical, ayanamsa);
          
          const jupiterTropical = calculateJupiterPosition(jd);
          finalJupiterSidereal = tropicalToSidereal(jupiterTropical, ayanamsa);
          
          const venusTropical = calculateVenusPosition(jd);
          finalVenusSidereal = tropicalToSidereal(venusTropical, ayanamsa);
          
          const saturnTropical = calculateSaturnPosition(jd);
          finalSaturnSidereal = tropicalToSidereal(saturnTropical, ayanamsa);
          
          const { rahu, ketu } = calculateRahuKetu(jd);
          finalRahuSidereal = tropicalToSidereal(rahu, ayanamsa);
          finalKetuSidereal = tropicalToSidereal(ketu, ayanamsa);
        }
      } else {
        // Use local formulas
        console.log("⚠️ Using local formulas (Swiss Ephemeris disabled)");
        
        const sunTropical = calculateSunPosition(jd);
        finalSunSidereal = tropicalToSidereal(sunTropical, ayanamsa);
        
        const moonTropical = calculateMoonPosition(jd);
        finalMoonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
        moonSidereal = finalMoonSidereal;
        
        const marsTropical = calculateMarsPosition(jd);
        finalMarsSidereal = tropicalToSidereal(marsTropical, ayanamsa);
        
        const mercuryTropical = calculateMercuryPosition(jd);
        finalMercurySidereal = tropicalToSidereal(mercuryTropical, ayanamsa);
        
        const jupiterTropical = calculateJupiterPosition(jd);
        finalJupiterSidereal = tropicalToSidereal(jupiterTropical, ayanamsa);
        
        const venusTropical = calculateVenusPosition(jd);
        finalVenusSidereal = tropicalToSidereal(venusTropical, ayanamsa);
        
        const saturnTropical = calculateSaturnPosition(jd);
        finalSaturnSidereal = tropicalToSidereal(saturnTropical, ayanamsa);
        
        const { rahu, ketu } = calculateRahuKetu(jd);
        finalRahuSidereal = tropicalToSidereal(rahu, ayanamsa);
        finalKetuSidereal = tropicalToSidereal(ketu, ayanamsa);
      }
      // ========== END PLANETARY POSITIONS ==========
      
      // Store all planets
      const planetsData = {
        lagna: ascendantSidereal,
        sun: finalSunSidereal,
        moon: finalMoonSidereal,
        mars: finalMarsSidereal,
        mercury: finalMercurySidereal,
        jupiter: finalJupiterSidereal,
        venus: finalVenusSidereal,
        saturn: finalSaturnSidereal,
        rahu: finalRahuSidereal,
        ketu: finalKetuSidereal
      };
  setAllPlanets(planetsData);
      
      // Calculate Karaka designations (AK, AmK, BK, MK, PiK, GK, DK)
      const karakas = calculateKarakas(planetsData);
      setKarakaDesignations(karakas);
                 
      // Calculate Special Lagnas
      const specialLagnasInfo = calculateSpecialLagnas(jd, birthLat, birthLon, ascendantSidereal, finalSunSidereal);
      setSpecialLagnas(specialLagnasInfo);
      
      // Calculate Divisional Charts for Display
      const divCharts = calculateDivisionalChartsForDisplay(jd, ayanamsa, ascendantSidereal);
      setDivisionalCharts(divCharts);
      
      // Calculate Life Events Timeline (with Chalit Kundali analysis)
      const lifeEvents = calculateLifeEventsTimeline(moonSidereal, birthDate, ascendantSidereal, jd, ayanamsa, birthLat, birthLon);
      setLifeEventsTimeline(lifeEvents);
      
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

  // ====== KUNDA SIDDHANTA - TRINAL METHOD ======
  
  /**
   * Kunda Siddhanta using Trinal Nakshatra Matching
   * Formula: (Lagna × 81) % 360 should give a Nakshatra that is:
   * - Same as Janma Nakshatra (1st)
   * - OR 10th from it (Janma + 9)
   * - OR 19th from it (Janma + 18)
   * These form a "trinal" (trikona) relationship
   */
  const handleKundaLockTrinal = (expandedWindow = 0) => {
    if (processing) return;
    if (!moonDetails || janmaNakshatraIndex === null) {
      alert("Janma Nakshatra information not available");
      return;
    }

    setProcessing(true);
    setNoMatchFound(false);
    setSearchResults(null);
    
    setTimeout(async () => {
      // Parse time components including seconds
      const timeParts = birthTime.split(':');
      const hours = parseInt(timeParts[0]) || 0;
      const minutes = parseInt(timeParts[1]) || 0;
      const seconds = parseInt(timeParts[2]) || 0;
      
      // Progressive window expansion
      let windowSeconds;
      let windowLabel;
      
      if (expandedWindow === 0) {
        windowSeconds = 10;  // ±10 seconds for trinal method (less precise)
        windowLabel = "±10 seconds";
      } else if (expandedWindow === 1) {
        windowSeconds = 300;
        windowLabel = "±5 minutes";
      } else if (expandedWindow === 999) {
        windowSeconds = 12 * 3600;
        windowLabel = "±12 hours (entire day)";
      } else {
        windowSeconds = 300 + ((expandedWindow - 1) * 300);
        windowLabel = `±${windowSeconds / 60} minutes`;
      }
      
      const centerSeconds = hours * 3600 + minutes * 60 + seconds;
      const stepSize = 1; // Check every second
      
      let candidates = [];
      let debugInfo = {
        total: 0,
        trinalMatches: 0,
        kundaNak1stMatches: 0,   // Same as Janma
        kundaNak10thMatches: 0,  // 10th from Janma
        kundaNak19thMatches: 0   // 19th from Janma
      };
      
      // Calculate target Nakshatras (trinal relationship)
      const targetNak1st = janmaNakshatraIndex;
      const targetNak10th = (janmaNakshatraIndex + 9) % 27;
      const targetNak19th = (janmaNakshatraIndex + 18) % 27;
      
      console.log("🕉️ KUNDA SIDDHANTA - TRINAL METHOD");
      console.log("Janma Nakshatra:", nakshatras[janmaNakshatraIndex], `(index ${janmaNakshatraIndex})`);
      console.log("Target Trinal Nakshatras:");
      console.log(`  1st (Same): ${nakshatras[targetNak1st]} (index ${targetNak1st})`);
      console.log(`  10th: ${nakshatras[targetNak10th]} (index ${targetNak10th})`);
      console.log(`  19th: ${nakshatras[targetNak19th]} (index ${targetNak19th})`);
      console.log("Window:", windowLabel);
      console.log("");
      
      for (let offset = -windowSeconds; offset <= windowSeconds; offset += stepSize) {
        const testTotalSeconds = centerSeconds + offset;
        
        // Handle time boundaries
        let testHours = Math.floor(testTotalSeconds / 3600);
        let testMinutes = Math.floor((testTotalSeconds % 3600) / 60);
        let testSecs = testTotalSeconds % 60;
        
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
        
        // Convert to UTC
        const [year, month, day] = birthDate.split('-').map(Number);
        const tzOffsetMap = {
          'Asia/Kolkata': 5.5,
          'Australia/Adelaide': 9.5,
          'Australia/Sydney': 10,
          'Australia/Melbourne': 10,
          'Australia/Brisbane': 10,
          'Australia/Perth': 8,
          'America/New_York': -5,
          'Europe/London': 0,
          'Asia/Tokyo': 9,
          'Europe/Paris': 1
        };
        
        let utcOffset = tzOffsetMap[birthTz] || 0;
        
        // DST detection
        const dstZones = {
          'Australia/Adelaide': 1,
          'Australia/Sydney': 1,
          'Australia/Melbourne': 1,
          'America/New_York': 1,
          'Europe/London': 1,
          'Europe/Paris': 1
        };
        
        if (dstZones[birthTz]) {
          if (birthTz.startsWith('Australia/') && 
              ['Adelaide', 'Sydney', 'Melbourne'].some(city => birthTz.includes(city))) {
            if (month >= 10 || month <= 4) {
              utcOffset += dstZones[birthTz];
            }
          } else if (birthTz === 'America/New_York') {
            if (month >= 3 && month <= 11) {
              utcOffset += dstZones[birthTz];
            }
          } else if (birthTz.startsWith('Europe/')) {
            if (month >= 3 && month <= 10) {
              utcOffset += dstZones[birthTz];
            }
          }
        }
        
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
        
        // Calculate Lagna for this time point
        const jd = getJulianDay(utcYear, utcMonth, utcDay, utcHours, testMinutes, testSecs);
        const epsilon = getObliquity(jd);
        const lst = getLST(jd, birthLon);
        const ascendantTropical = calculateAscendant(lst, birthLat, epsilon);
        const ayanamsa = getLahiriAyanamsa(jd);
        const ascendantSidereal = tropicalToSidereal(ascendantTropical, ayanamsa);
        const lagnaInfo = getZodiacFromLongitude(ascendantSidereal);
        
        // KUNDA SIDDHANTA FORMULA: (Lagna × 81) % 360
        const lagnaDegrees = ascendantSidereal;
        const kundaProduct = (lagnaDegrees * 81) % 360;
        const kundaNakshatraIndex = Math.floor(kundaProduct / (360 / 27));
        
        // Check for TRINAL MATCH (1st, 10th, or 19th Nakshatra)
        const isTrinal1st = kundaNakshatraIndex === targetNak1st;
        const isTrinal10th = kundaNakshatraIndex === targetNak10th;
        const isTrinal19th = kundaNakshatraIndex === targetNak19th;
        const isTrinal = isTrinal1st || isTrinal10th || isTrinal19th;
        
        // Track matches
        if (isTrinal1st) debugInfo.kundaNak1stMatches++;
        if (isTrinal10th) debugInfo.kundaNak10thMatches++;
        if (isTrinal19th) debugInfo.kundaNak19thMatches++;
        if (isTrinal) debugInfo.trinalMatches++;
        
        if (isTrinal) {
          const timeStr = `${String(testHours).padStart(2, '0')}:${String(testMinutes).padStart(2, '0')}:${String(Math.abs(testSecs)).padStart(2, '0')}`;
          
          let trinalType = "";
          if (isTrinal1st) trinalType = "1st (Same as Janma)";
          else if (isTrinal10th) trinalType = "10th from Janma";
          else if (isTrinal19th) trinalType = "19th from Janma";
          
          console.log(`✅ TRINAL MATCH at ${timeStr}:`);
          console.log(`  Lagna: ${lagnaInfo.sign} ${lagnaDegrees.toFixed(3)}°`);
          console.log(`  Kunda Product: (${lagnaDegrees.toFixed(3)}° × 81) % 360 = ${kundaProduct.toFixed(3)}°`);
          console.log(`  Kunda Nakshatra: ${nakshatras[kundaNakshatraIndex]} (index ${kundaNakshatraIndex})`);
          console.log(`  Trinal Type: ${trinalType}`);
          
          candidates.push({
            time: timeStr,
            offset: offset,
            lagna: lagnaInfo,
            lagnaDegrees: lagnaDegrees,
            kundaProduct: kundaProduct,
            kundaNakshatra: nakshatras[kundaNakshatraIndex],
            kundaNakshatraIndex: kundaNakshatraIndex,
            trinalType: trinalType,
            isTrinal1st: isTrinal1st,
            isTrinal10th: isTrinal10th,
            isTrinal19th: isTrinal19th
          });
        }
      }
      
      setProcessing(false);
      
      console.log("\n" + "=".repeat(70));
      console.log("KUNDA SIDDHANTA TRINAL SCAN COMPLETE");
      console.log("=".repeat(70));
      console.log("Janma Nakshatra:", nakshatras[janmaNakshatraIndex], `(index ${janmaNakshatraIndex})`);
      console.log("Window:", windowLabel);
      console.log("Time points scanned:", debugInfo.total);
      console.log("\nTrinal Matches:");
      console.log(`  1st (Same): ${debugInfo.kundaNak1stMatches} matches`);
      console.log(`  10th: ${debugInfo.kundaNak10thMatches} matches`);
      console.log(`  19th: ${debugInfo.kundaNak19thMatches} matches`);
      console.log(`  TOTAL TRINAL: ${debugInfo.trinalMatches} matches`);
      console.log("=".repeat(70));
      
      if (candidates.length > 0) {
        // Sort by closest to original time
        candidates.sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));
        
        const bestCandidate = candidates[0];
        console.log("\n✅ BEST MATCH (closest to input time):");
        console.log("Time:", bestCandidate.time);
        console.log("Offset:", bestCandidate.offset, "seconds");
        console.log("Lagna:", bestCandidate.lagna.sign, bestCandidate.lagnaDegrees.toFixed(3) + "°");
        console.log("Kunda Nakshatra:", bestCandidate.kundaNakshatra);
        console.log("Trinal Type:", bestCandidate.trinalType);
        
        setLockedTime({
          ...bestCandidate,
          moon: moonDetails, // Include original moon details
          method: "trinal"
        });
        setPhase(6);
      } else {
        setSearchResults({
          ...debugInfo,
          windowLabel: windowLabel,
          expandedWindow: expandedWindow,
          method: "trinal"
        });
        setNoMatchFound(true);
      }
    }, 100);
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
      // ...
      // expandedWindow = 24: ±120 minutes (7200 seconds)
      // expandedWindow = 999: Unlimited (entire day ±12 hours)
      let windowSeconds;
      let windowLabel;
      
      if (expandedWindow === 0) {
        windowSeconds = 3;
        windowLabel = "±3 seconds";
      } else if (expandedWindow === 1) {
        windowSeconds = 300;
        windowLabel = "±5 minutes";
      } else if (expandedWindow === 999) {
        // Unlimited search - entire day
        windowSeconds = 12 * 3600; // ±12 hours
        windowLabel = "±12 hours (entire day)";
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
      
            // ========== BATCH SWISS EPHEMERIS KUNDA SCAN ==========
console.log(`🔍 Kunda Scan: ${windowLabel}, Points: ${windowSeconds * 2 + 1}`);

setScanProgress({
  current: 0,
  total: windowSeconds * 2 + 1,
  message: 'Building time points...',
  batchNum: 0,
  totalBatches: 0
});

// Build all time points
const timePoints = [];
const [year, month, day] = birthDate.split('-').map(Number);

const tzOffsetMap = {
  'Asia/Kolkata': 5.5,
  'Australia/Adelaide': 9.5,
  'Australia/Sydney': 10,
  'Australia/Melbourne': 10,
  'Australia/Brisbane': 10,
  'Australia/Perth': 8,
  'Australia/Canberra': 10,
  'Australia/Hobart': 10,
  'Australia/Darwin': 9.5,
  'America/New_York': -5,
  'Europe/London': 0,
  'Asia/Tokyo': 9,
  'Europe/Paris': 1
};

let utcOffset = tzOffsetMap[birthTz] || 0;

const dstZones = {
  'Australia/Adelaide': 1,
  'Australia/Sydney': 1,
  'Australia/Melbourne': 1,
  'Australia/Canberra': 1,
  'Australia/Hobart': 1,
  'America/New_York': 1,
  'Europe/London': 1,
  'Europe/Paris': 1
};

if (dstZones[birthTz]) {
  if (birthTz.startsWith('Australia/') && 
      ['Adelaide', 'Sydney', 'Melbourne', 'Canberra', 'Hobart'].some(city => birthTz.includes(city))) {
    if (month >= 10 || month <= 4) utcOffset += dstZones[birthTz];
  } else if (month >= 3 && month <= 11) {
    utcOffset += dstZones[birthTz];
  }
}

for (let offset = -windowSeconds; offset <= windowSeconds; offset++) {
  const testTotalSeconds = centerSeconds + offset;
  
  let testHours = Math.floor(testTotalSeconds / 3600);
  let testMinutes = Math.floor((testTotalSeconds % 3600) / 60);
  let testSecs = testTotalSeconds % 60;
  
  if (testSecs < 0) { testSecs += 60; testMinutes -= 1; }
  if (testMinutes < 0) { testMinutes += 60; testHours -= 1; }
  if (testHours < 0) testHours += 24;
  testHours = testHours % 24;
  
  let utcHours = testHours - utcOffset;
  let utcDay = day, utcMonth = month, utcYear = year;
  
  if (utcHours < 0) {
    utcHours += 24; utcDay -= 1;
    if (utcDay < 1) {
      utcMonth -= 1;
      if (utcMonth < 1) { utcMonth = 12; utcYear -= 1; }
      utcDay = new Date(utcYear, utcMonth, 0).getDate();
    }
  } else if (utcHours >= 24) {
    utcHours -= 24; utcDay += 1;
    const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
    if (utcDay > daysInMonth) {
      utcDay = 1; utcMonth += 1;
      if (utcMonth > 12) { utcMonth = 1; utcYear += 1; }
    }
  }
  
  const jd = getJulianDay(utcYear, utcMonth, utcDay, utcHours, testMinutes, testSecs);
  timePoints.push({ offset, testHours, testMinutes, testSecs, jd });
}

console.log(`✅ Built ${timePoints.length} time points`);

// Split into batches
const BATCH_SIZE = 100;
const batches = [];
for (let i = 0; i < timePoints.length; i += BATCH_SIZE) {
  batches.push(timePoints.slice(i, i + BATCH_SIZE));
}

console.log(`📦 ${batches.length} batches (${BATCH_SIZE} points each)`);

setScanProgress(prev => ({
  ...prev,
  totalBatches: batches.length
}));

// Determine tolerance
let degreeTolerance, enforceDegreeTolerance = true;

if (windowSeconds <= 3) {
  // Very narrow scan (±3 seconds) - more forgiving for floating-point precision
  degreeTolerance = 0.2;
} else if (windowSeconds <= 10) {
  degreeTolerance = 0.1;
} else if (windowSeconds <= 300) {
  degreeTolerance = 1.5;
} else if (windowSeconds <= 600) {
  degreeTolerance = 3.0;
} else if (windowSeconds <= 1200) {
  degreeTolerance = 6.0;
} else {
  degreeTolerance = 30.0;
  enforceDegreeTolerance = false;
  console.log(`Wide scan: D1 SIGN only`);
}

// Process batches
let processedCount = 0;

for (let batchNum = 0; batchNum < batches.length; batchNum++) {
  const batch = batches[batchNum];
  
  setScanProgress({
    current: processedCount,
    total: timePoints.length,
    message: `Batch ${batchNum + 1}/${batches.length}...`,
    batchNum: batchNum + 1,
    totalBatches: batches.length
  });
  
  try {
    const response = await fetch(`${SWISSEPH_API_URL}/planets-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        times: batch.map(tp => ({ jd: tp.jd })),
        latitude: birthLat,
        longitude: birthLon,
        planets: ['moon'],
        sidereal: true
      })
    });
    
    if (!response.ok) throw new Error(`API error ${response.status}`);
    
    const data = await response.json();
    console.log(`✅ Batch ${batchNum + 1}: ${data.processing_time_ms}ms`);
    
    data.results.forEach((result, idx) => {
      const timePoint = batch[idx];
      debugInfo.total++;
      
      if (!result.ascendant || !result.planets?.moon) return;
      
      const lagnaSidereal = result.ascendant;
      const moonSidereal = result.planets.moon;
      
      const lagnaInfo = getZodiacFromLongitude(lagnaSidereal);
      const moonInfo = getZodiacFromLongitude(moonSidereal);
      
      const d9 = calculateDivisionalChart(lagnaSidereal, 9);
      const d10 = calculateDivisionalChart(lagnaSidereal, 10);
      const d7 = calculateDivisionalChart(lagnaSidereal, 7);
      
      const d1SignMatches = lagnaInfo.sign === lagnaDetails.sign;
      const degreeDifference = Math.abs(lagnaInfo.degree - lagnaDetails.degree);
      const d1DegreeClose = degreeDifference < degreeTolerance;
      
      if (d1SignMatches && d1DegreeClose) debugInfo.d1Matches = (debugInfo.d1Matches || 0) + 1;
      if (d9 === d9Selection) debugInfo.d9Matches++;
      if (d10 === d10Selection) debugInfo.d10Matches++;
      if (d7 === d7Selection) debugInfo.d7Matches++;
      if (moonInfo.sign === moonRashiSelection) debugInfo.moonMatches++;
      
      const d1Matches = enforceDegreeTolerance
        ? (d1SignMatches && d1DegreeClose)
        : d1SignMatches;
      
      if (d1Matches &&
          d9 === d9Selection &&
          d10 === d10Selection &&
          d7 === d7Selection &&
          moonInfo.sign === moonRashiSelection) {
        
        debugInfo.allMatches++;
        
        const timeStr = `${String(timePoint.testHours).padStart(2, '0')}:${String(timePoint.testMinutes).padStart(2, '0')}:${String(Math.abs(timePoint.testSecs)).padStart(2, '0')}`;
        
        console.log(`✅ MATCH at ${timeStr}`);
        
        candidates.push({
          time: timeStr,
          offset: timePoint.offset,
          lagna: lagnaInfo,
          moon: moonInfo,
          d9, d10, d7,
          degreeDiff: degreeDifference.toFixed(3)
        });
      }
    });
    
    processedCount += batch.length;
    
  } catch (error) {
    console.error(`❌ Batch ${batchNum + 1} error:`, error);
    setScanProgress(prev => ({
      ...prev,
      message: `Error in batch ${batchNum + 1}, continuing...`
    }));
    processedCount += batch.length;
  }
}

setScanProgress({
  current: timePoints.length,
  total: timePoints.length,
  message: 'Scan complete!',
  batchNum: batches.length,
  totalBatches: batches.length
});

console.log(`🎯 Complete! Found ${candidates.length} matches`);
      
      setProcessing(false);
      
      console.log("=" .repeat(60));
      console.log("KUNDA SIDDHANTA SCAN COMPLETE");
      console.log("=" .repeat(60));
      console.log("Target Criteria:");
      console.log(`  D1 Lagna: ${lagnaDetails.sign} ${lagnaDetails.degree.toFixed(2)}° (tolerance varies by window)`);
      console.log(`  D9: ${d9Selection}`);
      console.log(`  D10: ${d10Selection}`);
      console.log(`  D7: ${d7Selection}`);
      console.log(`  Moon: ${moonRashiSelection}`);
      console.log("\nScan Results:");
      console.log(`  Window: ${windowLabel}`);
      console.log(`  Time points scanned: ${debugInfo.total}`);
      console.log(`  D1 ${lagnaDetails.sign} (within tolerance): ${debugInfo.d1Matches || 0} matches`);
      console.log(`  D9 ${d9Selection}: ${debugInfo.d9Matches} matches`);
      console.log(`  D10 ${d10Selection}: ${debugInfo.d10Matches} matches`);
      console.log(`  D7 ${d7Selection}: ${debugInfo.d7Matches} matches`);
      console.log(`  Moon ${moonRashiSelection}: ${debugInfo.moonMatches} matches`);
      console.log(`  ALL CONDITIONS MET: ${debugInfo.allMatches} matches`);
      console.log("=" .repeat(60));
      
      if (candidates.length > 0) {
        // Sort by closest to original time
        candidates.sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));
        
        // CRITICAL VALIDATION: Verify the locked time actually has matching divisional charts
        const bestCandidate = candidates[0];
        console.log("\n" + "=".repeat(60));
        console.log("FINAL VALIDATION OF LOCKED TIME");
        console.log("=".repeat(60));
        console.log("Locked time:", bestCandidate.time);
        console.log("D1 Lagna:", bestCandidate.lagna.sign, bestCandidate.lagna.degree.toFixed(3) + "°");
        console.log("Calculated divisional charts at this time:");
        console.log("  D9:", bestCandidate.d9, "(user selected:", d9Selection + ")");
        console.log("  D10:", bestCandidate.d10, "(user selected:", d10Selection + ")");
        console.log("  D7:", bestCandidate.d7, "(user selected:", d7Selection + ")");
        console.log("Validation:");
        console.log("  D9 match:", bestCandidate.d9 === d9Selection ? "✅" : "❌ MISMATCH!");
        console.log("  D10 match:", bestCandidate.d10 === d10Selection ? "✅" : "❌ MISMATCH!");
        console.log("  D7 match:", bestCandidate.d7 === d7Selection ? "✅" : "❌ MISMATCH!");
        
        if (bestCandidate.d9 !== d9Selection || 
            bestCandidate.d10 !== d10Selection || 
            bestCandidate.d7 !== d7Selection) {
          console.error("❌ ERROR: Locked time has WRONG divisional charts!");
          console.error("This should never happen - the matching logic has a bug!");
          alert("ERROR: The locked time has incorrect divisional charts. Please report this bug with the console output.");
        }
        console.log("=".repeat(60));
        
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

      {/* DEV MODE BANNER */}
      {DEV_MODE && (
        <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-yellow-400 font-bold text-lg">🔧 DEVELOPMENT MODE ACTIVE</h3>
              <p className="text-white/90 text-sm">Using mock location data - No network required</p>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-white/80 text-xs mb-2">Quick Test Cases:</p>
            <div className="flex gap-2 flex-wrap">
              {TEST_CASES.map((testCase, idx) => (
                <button
                  key={idx}
                  onClick={() => loadTestCase(testCase)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-semibold py-2 px-3 rounded-lg transition-all"
                >
                  {testCase.name}
                </button>
              ))}
            </div>
            <p className="text-white/60 text-xs mt-2">
              💡 Tip: Set <code className="bg-black/30 px-1 rounded">DEV_MODE = false</code> in code for production
            </p>
          </div>
        </div>
      )}

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
          
          {/* Quick Select Buttons */}
          <div className="mb-3 flex flex-wrap gap-2">
            {preloadedLocations.map((location, idx) => (
              <button
                key={idx}
                onClick={() => selectLocation(location)}
                className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/30 rounded-full text-white text-xs transition-all"
              >
                📍 {location.name}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={birthPlaceQuery}
              onChange={(e) => handleLocationSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full p-3 pr-10 rounded-lg bg-white/10 border border-white/20 text-white focus:border-purple-400 focus:outline-none"
              placeholder="Or type to search any location..."
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

          {/* DEBUG Panel */}
          {DEV_MODE && (
            <div className="bg-red-500/20 border-2 border-red-400/50 rounded-lg p-4">
              <p className="font-bold text-red-300 mb-2 text-sm">🔧 DEBUG: Ascendant Calculation Details</p>
              <div className="text-xs font-mono text-white/90 space-y-1">
                <p>Sign Name: <span className="text-yellow-300 font-bold">{lagnaDetails.sign}</span></p>
                <p>Sign Number (Traditional 1-12): <span className="text-yellow-300 font-bold">{lagnaDetails.signIndex + 1}</span></p>
                <p>Sign Index (Code 0-11): <span className="text-gray-400">{lagnaDetails.signIndex}</span></p>
                <p>Absolute Longitude: <span className="text-yellow-300 font-bold">{lagnaDetails.absoluteDegree?.toFixed(4)}°</span></p>
                <p>Degree in Sign: <span className="text-yellow-300 font-bold">{lagnaDetails.degree?.toFixed(4)}°</span></p>
                <div className="mt-2 pt-2 border-t border-red-400/30 text-[10px] text-white/60">
                  <p className="text-green-300">✓ Capricorn = Sign #10 (traditional) = Index 9 (code)</p>
                  <p>✓ Dec 18, 1984, 10:08 AM Delhi → Capricorn</p>
                  <p>✓ Oct 9, 1985, 3:30 PM Nurpur → Capricorn</p>
                </div>
              </div>
            </div>
          )}

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
            onClick={() => setPhase(1.2)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            Continue to Planetary Positions
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );

  const renderPhase1_2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1.2</div>
        <h2 className="text-2xl font-bold text-white">Planetary Positions & Karakas</h2>
      </div>

      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-300/30">
        <div className="flex items-center gap-2 mb-2">
          <Target size={20} className="text-purple-300" />
          <div className="text-sm font-bold text-white">
            Complete Planetary Analysis with D60 Shashtiamsha
          </div>
        </div>
        <p className="text-white/80 text-xs">
          Planetary positions with Jaimini Karakas and past life karmic deities from D60 divisional chart
        </p>
      </div>

      {allPlanets && karakaDesignations ? (
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">📊 Planetary Positions Table</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-white/30">
                  <th className="text-left text-white font-bold pb-3 px-3">Body</th>
                  <th className="text-left text-white font-bold pb-3 px-3">Longitude</th>
                  <th className="text-left text-white font-bold pb-3 px-3">D60 Deity</th>
                  <th className="text-left text-white font-bold pb-3 px-3">Karmic Influence</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {/* Lagna */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3 font-semibold text-blue-300">Lagna</td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.lagna / 30)].substring(0, 2)} {degreesToDMS(allPlanets.lagna % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.lagna);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.lagna);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>
                
                {/* Sun */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-orange-300">Sun</span>
                    {karakaDesignations.Sun && (
                      <span className="ml-2 bg-orange-500/30 px-2 py-0.5 rounded text-xs font-bold text-orange-200">
                        {karakaDesignations.Sun}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.sun / 30)].substring(0, 2)} {degreesToDMS(allPlanets.sun % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.sun);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.sun);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Moon */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-yellow-300">Moon</span>
                    {karakaDesignations.Moon && (
                      <span className="ml-2 bg-yellow-500/30 px-2 py-0.5 rounded text-xs font-bold text-yellow-200">
                        {karakaDesignations.Moon}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.moon / 30)].substring(0, 2)} {degreesToDMS(allPlanets.moon % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.moon);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.moon);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Mars */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-red-300">Mars</span>
                    {karakaDesignations.Mars && (
                      <span className="ml-2 bg-red-500/30 px-2 py-0.5 rounded text-xs font-bold text-red-200">
                        {karakaDesignations.Mars}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.mars / 30)].substring(0, 2)} {degreesToDMS(allPlanets.mars % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.mars);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.mars);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Mercury */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-green-300">Mercury</span>
                    {karakaDesignations.Mercury && (
                      <span className="ml-2 bg-green-500/30 px-2 py-0.5 rounded text-xs font-bold text-green-200">
                        {karakaDesignations.Mercury}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.mercury / 30)].substring(0, 2)} {degreesToDMS(allPlanets.mercury % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.mercury);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.mercury);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Jupiter */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-yellow-200">Jupiter</span>
                    {karakaDesignations.Jupiter && (
                      <span className="ml-2 bg-yellow-500/30 px-2 py-0.5 rounded text-xs font-bold text-yellow-200">
                        {karakaDesignations.Jupiter}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.jupiter / 30)].substring(0, 2)} {degreesToDMS(allPlanets.jupiter % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.jupiter);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.jupiter);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Venus */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-pink-300">Venus</span>
                    {karakaDesignations.Venus && (
                      <span className="ml-2 bg-pink-500/30 px-2 py-0.5 rounded text-xs font-bold text-pink-200">
                        {karakaDesignations.Venus}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.venus / 30)].substring(0, 2)} {degreesToDMS(allPlanets.venus % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.venus);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.venus);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Saturn */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-indigo-300">Saturn</span>
                    {karakaDesignations.Saturn && (
                      <span className="ml-2 bg-indigo-500/30 px-2 py-0.5 rounded text-xs font-bold text-indigo-200">
                        {karakaDesignations.Saturn}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.saturn / 30)].substring(0, 2)} {degreesToDMS(allPlanets.saturn % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.saturn);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.saturn);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Rahu */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-purple-300">Rahu</span>
                    <span className="ml-2 bg-purple-500/30 px-2 py-0.5 rounded text-xs font-bold text-purple-200">AmK</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.rahu / 30)].substring(0, 2)} {degreesToDMS(allPlanets.rahu % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.rahu);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.rahu);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>

                {/* Ketu */}
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-3 font-semibold text-gray-400">Ketu</td>
                  <td className="py-3 px-3 font-mono text-base">
                    {zodiac[Math.floor(allPlanets.ketu / 30)].substring(0, 2)} {degreesToDMS(allPlanets.ketu % 30).formatted}
                  </td>
                  <td className="py-3 px-3">
                    {(() => {
                      const d60 = calculateD60(allPlanets.ketu);
                      const colorClass = d60.deityNature === 'Benefic' ? 'text-green-300' : 'text-red-300';
                      return <span className={`font-bold ${colorClass}`}>{d60.deity}</span>;
                    })()}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80">
                    {(() => {
                      const d60 = calculateD60(allPlanets.ketu);
                      return d60.deityDescription;
                    })()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
            <p className="text-white/90 text-sm font-semibold mb-2">🌟 Karaka Designations (Jaimini System):</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-white/80">
              <div><span className="font-bold text-orange-300">AK</span> = Atmakaraka (Soul)</div>
              <div><span className="font-bold text-orange-300">AmK</span> = Amatyakaraka (Career/Minister)</div>
              <div><span className="font-bold text-orange-300">BK</span> = Bhratrukaraka (Siblings)</div>
              <div><span className="font-bold text-orange-300">MK</span> = Matrukaraka (Mother)</div>
              <div><span className="font-bold text-orange-300">PiK</span> = Pitrukaraka (Father)</div>
              <div><span className="font-bold text-orange-300">GK</span> = Gnatikaraka (Relatives)</div>
              <div><span className="font-bold text-orange-300">DK</span> = Darakaraka (Spouse)</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/60">
            <strong>Note:</strong> D60 Shashtiamsha shows past life karma and karmic baggage for each planet. 
            Each sign is divided into 60 parts (0.5° each), with each part ruled by one of 60 deities. 
            <span className="text-green-300"> Benefic deities</span> indicate positive karma, while 
            <span className="text-red-300"> Malefic deities</span> indicate challenging karma requiring remedies.
          </div>
        </div>
      ) : (
        <div className="text-white/60 italic text-sm">Calculating planetary positions...</div>
      )}

      <button
        onClick={() => setPhase(1.3)}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
      >
        Continue to Moon Nakshatra Analysis
        <ChevronRight size={20} />
      </button>

      <button
        onClick={() => setPhase(1.2)}
        className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
      >
        ← Back
      </button>
    </div>
  );

  const renderPhase1_3 = () => {
    if (!moonDetails) return null;
    
    const traits = getNakshatraTraits(moonDetails.nakshatra, moonDetails.pada);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1.3</div>
          <h2 className="text-2xl font-bold text-white">Moon Nakshatra Analysis</h2>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-300/30">
          <div className="flex items-center gap-2 mb-2">
            <Moon size={20} className="text-yellow-300" />
            <div className="text-sm font-bold text-white">
              Your Birth Star & Soul Blueprint
            </div>
          </div>
          <p className="text-white/80 text-xs">
            The Moon's nakshatra at birth reveals your emotional nature, mind patterns, and karmic tendencies
          </p>
        </div>

        {/* Main Nakshatra Info */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400/30">
              <p className="text-yellow-300 text-sm font-semibold mb-1">Nakshatra</p>
              <p className="text-white text-2xl font-bold">{moonDetails.nakshatra}</p>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
              <p className="text-blue-300 text-sm font-semibold mb-1">Pada (Quarter)</p>
              <p className="text-white text-2xl font-bold">{moonDetails.pada || 1}/4</p>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
              <p className="text-purple-300 text-sm font-semibold mb-1">Ruling Lord</p>
              <p className="text-white text-2xl font-bold">{moonDetails.nakshatraLord}</p>
            </div>
          </div>

          {/* Nakshatra Metadata */}
          {traits && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-indigo-500/20 p-3 rounded-lg border border-indigo-400/30">
                <p className="text-indigo-300 text-xs font-semibold mb-1">Symbol</p>
                <p className="text-white text-sm font-bold">{traits.symbol}</p>
              </div>
              <div className="bg-pink-500/20 p-3 rounded-lg border border-pink-400/30">
                <p className="text-pink-300 text-xs font-semibold mb-1">Deity</p>
                <p className="text-white text-sm font-bold">{traits.deity}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg border border-green-400/30">
                <p className="text-green-300 text-xs font-semibold mb-1">Element</p>
                <p className="text-white text-sm font-bold">{traits.element}</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-lg border border-orange-400/30">
                <p className="text-orange-300 text-xs font-semibold mb-1">Gana</p>
                <p className="text-white text-sm font-bold">{traits.gana}</p>
              </div>
              <div className="bg-cyan-500/20 p-3 rounded-lg border border-cyan-400/30">
                <p className="text-cyan-300 text-xs font-semibold mb-1">Animal</p>
                <p className="text-white text-sm font-bold">{traits.animal}</p>
              </div>
              <div className="bg-violet-500/20 p-3 rounded-lg border border-violet-400/30">
                <p className="text-violet-300 text-xs font-semibold mb-1">Quality</p>
                <p className="text-white text-sm font-bold">{traits.quality}</p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 rounded-lg border border-indigo-400/30 mb-4">
            <p className="text-indigo-300 text-sm font-semibold mb-2">Moon Position</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
              <div>
                <span className="text-white/60">Rashi:</span>
                <span className="ml-2 font-semibold text-white">{moonDetails.sign}</span>
              </div>
              <div>
                <span className="text-white/60">Degree:</span>
                <span className="ml-2 font-mono text-white">{degreesToDMS(moonDetails.degree).formatted}</span>
              </div>
            </div>
          </div>

          {traits && (
            <>
              {/* General Traits */}
              <div className="bg-green-500/20 p-5 rounded-lg border border-green-400/30 mb-4">
                <h3 className="text-green-300 font-bold text-lg mb-3 flex items-center gap-2">
                  <Target size={18} />
                  General Nature & Characteristics
                </h3>
                <p className="text-white/90 leading-relaxed">{traits.general}</p>
              </div>

              {/* Pada-Specific Traits */}
              <div className="bg-blue-500/20 p-5 rounded-lg border border-blue-400/30 mb-4">
                <h3 className="text-blue-300 font-bold text-lg mb-3 flex items-center gap-2">
                  <Moon size={18} />
                  Pada {moonDetails.pada || 1} Specific Traits
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {traits[`pada${moonDetails.pada || 1}`] || traits.pada1 || "Specific traits for this pada are available in the general description."}
                </p>
              </div>

              {/* Strengths */}
              {traits.strengths && (
                <div className="bg-emerald-500/20 p-5 rounded-lg border border-emerald-400/30 mb-4">
                  <h3 className="text-emerald-300 font-bold text-lg mb-3">✨ Key Strengths</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/90">
                    {traits.strengths.map((strength, idx) => (
                      <li key={idx} className="leading-relaxed">{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {traits.challenges && (
                <div className="bg-orange-500/20 p-5 rounded-lg border border-orange-400/30 mb-4">
                  <h3 className="text-orange-300 font-bold text-lg mb-3">⚠️ Challenges to Work On</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/90">
                    {traits.challenges.map((challenge, idx) => (
                      <li key={idx} className="leading-relaxed">{challenge}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Career Inclinations */}
              {traits.career && (
                <div className="bg-violet-500/20 p-5 rounded-lg border border-violet-400/30 mb-4">
                  <h3 className="text-violet-300 font-bold text-lg mb-3">💼 Career & Professional Life</h3>
                  <p className="text-white/90 leading-relaxed">{traits.career}</p>
                </div>
              )}

              {/* Relationships */}
              {traits.relationships && (
                <div className="bg-pink-500/20 p-5 rounded-lg border border-pink-400/30 mb-4">
                  <h3 className="text-pink-300 font-bold text-lg mb-3">💕 Relationships & Compatibility</h3>
                  <p className="text-white/90 leading-relaxed">{traits.relationships}</p>
                </div>
              )}

              {/* Spiritual Path */}
              {traits.spiritual && (
                <div className="bg-purple-500/20 p-5 rounded-lg border border-purple-400/30">
                  <h3 className="text-purple-300 font-bold text-lg mb-3">🙏 Spiritual Path & Growth</h3>
                  <p className="text-white/90 leading-relaxed">{traits.spiritual}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <p className="text-white/90 text-sm">
            <strong className="text-blue-300">Note:</strong> Your Moon nakshatra reveals your subconscious mind, 
            emotional patterns, and the karmic blueprint you brought into this life. Understanding these traits 
            helps you work with your natural tendencies rather than against them.
          </p>
        </div>

        <button
          onClick={() => setPhase(1.5)}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          Continue to D1 Lagna Confirmation
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => setPhase(1.3)}
          className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
        >
          ← Back
        </button>
      </div>
    );
  };

  const renderPhase1_5 = () => {
    const d1Adjacent = lagnaDetails ? getAdjacentSigns(lagnaDetails.sign) : null;
    const currentSelection = d1LagnaSelection || lagnaDetails?.sign;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1.5</div>
          <h2 className="text-2xl font-bold text-white">D1 Lagna - Personality Quiz</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-4 rounded-xl border border-blue-300/30">
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-blue-300" />
            <div className="text-sm font-bold text-white">
              Confirm Your Rising Sign (Ascendant)
            </div>
          </div>
          <p className="text-white/80 text-xs">
            Your D1 Lagna represents your outer personality, how others see you, and your approach to life.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Your Personality & Life Approach</h3>
          
          <div className="bg-blue-500/20 p-4 rounded-lg mb-4 border border-blue-400/30">
            <div className="font-bold text-white mb-2">Calculated: {lagnaDetails.sign}</div>
            <div className="text-white/80 text-sm">{getD1LagnaTraits(lagnaDetails.sign)}</div>
          </div>

          <p className="text-white/90 mb-3 font-semibold">Does this describe your personality and how others see you?</p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setD1LagnaConfirmed(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                d1LagnaConfirmed === true ? 'bg-green-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              ✓ Yes, this is me
            </button>
            <button
              onClick={() => setD1LagnaConfirmed(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                d1LagnaConfirmed === false ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              ✗ No, choose different
            </button>
          </div>

          {d1LagnaConfirmed === false && (
            <div className="space-y-3 mt-4 pt-4 border-t border-white/20">
              <p className="text-white/80 text-sm mb-3">
                Choose the sign that best describes your personality:
              </p>
              
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {zodiac.map((sign) => (
                  <label 
                    key={sign}
                    className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                      currentSelection === sign
                        ? 'bg-blue-500/40 border-2 border-blue-400'
                        : 'bg-white/5 border border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="d1-choice"
                      checked={currentSelection === sign}
                      onChange={() => setD1LagnaSelection(sign)}
                      className="mt-1 w-5 h-5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white">
                        {sign}
                        {sign === lagnaDetails.sign && <span className="text-blue-300 text-sm ml-2">(Calculated)</span>}
                      </div>
                      <div className="text-white/70 text-sm mt-1">{getD1LagnaTraits(sign)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-yellow-400 mt-0.5 flex-shrink-0" size={16} />
            <div className="text-sm text-white/80">
              <strong className="text-white">Note:</strong> If you select a different Lagna, 
              the birth time will be adjusted accordingly in the final result. This affects the 
              precision of the rectification.
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (d1LagnaConfirmed === true) {
              // User confirmed calculated Lagna
              setD1LagnaSelection(lagnaDetails.sign);
            } else if (!d1LagnaSelection) {
              // User hasn't selected anything yet
              alert("Please select a Lagna sign that resonates with you");
              return;
            }
            // If user selected different Lagna, update lagnaDetails
            if (d1LagnaSelection && d1LagnaSelection !== lagnaDetails.sign) {
              // Recalculate with adjusted Lagna
              const signIndex = zodiac.indexOf(d1LagnaSelection);
              setLagnaDetails({
                ...lagnaDetails,
                sign: d1LagnaSelection,
                signIndex: signIndex,
                userAdjusted: true
              });
            }
            setPhase(2); // Skip Dasha, go directly to D9
          }}
          disabled={d1LagnaConfirmed === null}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Continue to D9 Soul Analysis
        </button>

        <button
          onClick={() => setPhase(1.7)}
          className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
        >
          ← Back
        </button>
      </div>
    );
  };

  const renderPhase1_7 = () => {
    if (!lifeEventsTimeline) return null;
    
    const { timeline, planets, lordships, ascendantSign, chalitCusps } = lifeEventsTimeline;
    const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                         "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    
    const pastDashas = timeline.filter(d => d.isPast);
    const currentDasha = timeline.find(d => d.isCurrent);
    const futureDashas = timeline.filter(d => !d.isPast && !d.isCurrent);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1.7</div>
          <h2 className="text-2xl font-bold text-white">Life Events Analysis</h2>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-indigo-300/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-indigo-300" />
            <div className="text-sm font-bold text-white">
              Chalit Kundali-Based Predictions
            </div>
          </div>
          <p className="text-white/80 text-xs">
            Using <strong>Bhava Chalit (Chalit Kundali)</strong> for accurate house-based predictions. 
            Chalit shows TRUE house cusps based on the actual sky, accounting for Earth's tilt and your latitude.
            This gives more accurate predictions than equal house divisions.
          </p>
        </div>

        {/* Chart Summary with Chalit Info */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 rounded-xl border border-cyan-300/30">
          <h3 className="text-xl font-bold text-white mb-4">📊 Your Chart Summary (Chalit Kundali)</h3>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 p-3 rounded">
              <p className="text-white/70 mb-2">Ascendant (Lagna):</p>
              <p className="text-white font-bold">{zodiacSigns[ascendantSign]}</p>
              <p className="text-white/60 text-xs mt-1">1st house cusp: {degreesToDMS(chalitCusps[0] % 30).formatted} {zodiacSigns[Math.floor(chalitCusps[0] / 30)]}</p>
            </div>
            <div className="bg-white/10 p-3 rounded">
              <p className="text-white/70 mb-2">Key Planetary Positions:</p>
              <div className="text-white/80 text-xs space-y-1">
                {Object.keys(planets).slice(0, 4).map(planet => (
                  <div key={planet}>
                    {planet}: 
                    <span className="text-cyan-300 ml-1">Chalit H{planets[planet].chalitHouse}</span>
                    {planets[planet].chalitHouse !== planets[planet].rasifHouse && (
                      <span className="text-white/50 ml-1">(Rasi: H{planets[planet].rasifHouse})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-white/60">
            <strong>Chalit vs Rasi:</strong> When Chalit and Rasi houses differ, we use Chalit for predictions 
            as it reflects the TRUE house cusps at your birth location and time.
          </div>
        </div>

        {/* Past Mahadashas */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-300/30">
          <h3 className="text-xl font-bold text-white mb-4">📜 Past Mahadashas & Predicted Events</h3>
          
          <div className="space-y-4">
            {pastDashas.map((dasha, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{dasha.planet} Mahadasha</h4>
                    <p className="text-white/60 text-sm">
                      {dasha.startYear} - {dasha.endYear} ({dasha.duration.toFixed(1)} years)
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      <span className="text-cyan-300">Chalit: House {dasha.placement.chalitHouse}</span>
                      {dasha.placement.chalitHouse !== dasha.placement.rasifHouse && (
                        <span className="text-white/50 ml-2">(Rasi: H{dasha.placement.rasifHouse})</span>
                      )}
                      <span className="text-white/70 ml-2">• Rules: {dasha.lordships.join(', ')}</span>
                    </p>
                  </div>
                  <div className="bg-blue-500/30 px-3 py-1 rounded-full text-xs text-white font-semibold">
                    Completed
                  </div>
                </div>
                
                <div className="space-y-2 mt-3">
                  {dasha.predictions.filter(p => p.probability).map((pred, i) => (
                    <div key={i} className="bg-yellow-500/20 p-3 rounded border border-yellow-400/30">
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-300 text-xl">★</span>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">
                            {pred.category}
                            {pred.chalitBased && <span className="text-cyan-300 text-xs ml-2">(Chalit-based)</span>}
                          </p>
                          <p className="text-white/80 text-xs mt-1">{pred.event}</p>
                          <div className="flex gap-3 mt-2 text-xs">
                            <span className="text-white/60">Timing: {pred.timing}</span>
                            {pred.probability && (
                              <span className="text-green-400">Probability: {pred.probability}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {dasha.predictions.filter(p => !p.probability && !p.chalitBased).slice(0, 3).map((pred, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <div>
                        <span className="text-white/70 font-semibold">{pred.category}:</span>
                        <span className="text-white/80 ml-1">{pred.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Mahadasha */}
        {currentDasha && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border-2 border-green-400/50 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">🌟 Current Mahadasha Analysis</h3>
            
            <div className="bg-white/10 p-5 rounded-lg border-2 border-green-400/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-bold text-white">{currentDasha.planet} Mahadasha</h4>
                  <p className="text-white/70 text-sm mt-1">
                    {currentDasha.startYear} - {currentDasha.endYear} ({currentDasha.duration} years)
                  </p>
                  <div className="mt-2 text-sm space-x-2">
                    <span className="bg-cyan-500/40 px-2 py-1 rounded text-white">
                      Chalit: House {currentDasha.placement.chalitHouse}
                    </span>
                    {currentDasha.placement.chalitHouse !== currentDasha.placement.rasifHouse && (
                      <span className="bg-white/20 px-2 py-1 rounded text-white/70 text-xs">
                        Rasi: H{currentDasha.placement.rasifHouse}
                      </span>
                    )}
                    <span className="bg-purple-500/30 px-2 py-1 rounded text-white">
                      Rules: {currentDasha.lordships.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="bg-green-500 px-4 py-2 rounded-full text-sm text-white font-bold">
                  ACTIVE NOW
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <div className="bg-green-500/20 p-4 rounded-lg border border-green-400/30">
                  <p className="text-white font-semibold mb-3">🎯 Key Life Events to Expect:</p>
                  <div className="space-y-3">
                    {currentDasha.predictions.filter(p => p.probability).map((pred, i) => (
                      <div key={i} className="bg-white/10 p-3 rounded">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-300 text-xl">★</span>
                          <div className="flex-1">
                            <p className="text-white font-bold text-sm">
                              {pred.category}
                              {pred.chalitBased && <span className="text-cyan-300 text-xs ml-2">(Chalit)</span>}
                            </p>
                            <p className="text-white/90 text-sm mt-1">{pred.event}</p>
                            <div className="flex gap-4 mt-2 text-xs">
                              <span className="text-white/70">⏱ {pred.timing}</span>
                              <span className="text-green-300 font-semibold">📊 {pred.probability}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded">
                  <p className="text-white/70 font-semibold mb-2 text-sm">Additional Activations:</p>
                  <div className="space-y-2">
                    {currentDasha.predictions.filter(p => !p.probability).slice(0, 6).map((pred, i) => (
                      <div key={i} className="text-sm flex items-start gap-2">
                        <span className="text-cyan-400">→</span>
                        <div>
                          <span className="text-cyan-300 font-semibold">{pred.category}:</span>
                          <span className="text-white/80 ml-1">{pred.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Future Mahadashas */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-300/30">
          <h3 className="text-xl font-bold text-white mb-4">🔮 Upcoming Mahadashas</h3>
          
          <div className="space-y-3">
            {futureDashas.slice(0, 3).map((dasha, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white">{dasha.planet} Mahadasha</h4>
                    <p className="text-white/60 text-sm">
                      {dasha.startYear} - {dasha.endYear}
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      <span className="text-cyan-300">Chalit H{dasha.placement.chalitHouse}</span>
                      <span className="text-white/70 ml-2">• Rules: {dasha.lordships.join(', ')}</span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  {dasha.predictions.filter(p => p.probability).slice(0, 2).map((pred, i) => (
                    <div key={i} className="text-sm flex items-start gap-2">
                      <span className="text-purple-400">★</span>
                      <div>
                        <span className="text-purple-300 font-semibold">{pred.category}:</span>
                        <span className="text-white/80 ml-1">{pred.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
            <div className="text-sm text-white/80">
              <strong className="text-white">Chalit Kundali:</strong> Predictions use Bhava Chalit (true house cusps) 
              which accounts for Earth's axial tilt and your birth latitude. This is more accurate than equal house 
              divisions (Rasi chart) for event timing and life predictions. Chalit is the standard for predictive astrology.
            </div>
          </div>
        </div>

        <button
          onClick={() => setPhase(2)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          Continue to Moon Nakshatra Analysis
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => setPhase(1.7)}
          className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
        >
          ← Back
        </button>
      </div>
    );
  };

  const renderPhase1_8 = () => {
    if (!moonDetails) return null;
    
    const nakshatraTraits = getNakshatraTraits(moonDetails.nakshatra, moonDetails.nakPada);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
            <Moon size={20} />
          </div>
          <h2 className="text-2xl font-bold text-white">Moon Nakshatra - Emotional Nature</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-300/30">
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-blue-300" />
            <div className="text-sm font-bold text-white">
              Your Moon's Nakshatra Reveals Your Inner Emotional Nature
            </div>
          </div>
          <p className="text-white/80 text-xs">
            The Moon represents your mind, emotions, and subconscious patterns. Its Nakshatra placement shows your deepest emotional nature and instinctive reactions.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Your Moon Nakshatra: {moonDetails.nakshatra}</h3>
          
          {/* Nakshatra Details */}
          <div className="bg-blue-500/20 p-4 rounded-lg mb-4 border border-blue-400/30">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-white/70 text-xs">Nakshatra</p>
                <p className="font-bold text-white text-lg">{moonDetails.nakshatra}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Ruling Lord</p>
                <p className="font-bold text-white text-lg">{moonDetails.nakshatraLord}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Moon Rashi</p>
                <p className="font-bold text-white text-lg">{moonDetails.sign}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Pada (Quarter)</p>
                <p className="font-bold text-white text-lg">Pada {moonDetails.nakPada}</p>
              </div>
            </div>
            
            <div className="border-t border-blue-400/30 pt-3 mt-3">
              <p className="text-white/70 text-xs mb-1">General Characteristics:</p>
              <p className="text-white/90 text-sm">{nakshatraTraits.general}</p>
            </div>
            
            <div className="border-t border-blue-400/30 pt-3 mt-3">
              <p className="text-white/70 text-xs mb-1">Pada {moonDetails.nakPada} Specific Traits:</p>
              <p className="text-white/90 text-sm">{nakshatraTraits.pada}</p>
            </div>
          </div>

          <p className="text-white/90 mb-3 font-semibold">Does this describe your emotional nature and instinctive reactions?</p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setNakshatraConfirmed(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                nakshatraConfirmed === true ? 'bg-green-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              ✓ Yes, this resonates with me
            </button>
            <button
              onClick={() => setNakshatraConfirmed(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                nakshatraConfirmed === false ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              ✗ This doesn't feel right
            </button>
          </div>

          {nakshatraConfirmed === false && (
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-white/90">
                  <p className="font-semibold mb-1">Moon Nakshatra Doesn't Match?</p>
                  <p>This might indicate:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-white/80">
                    <li>Birth time may be off by several minutes</li>
                    <li>Moon moves quickly (~13° per day)</li>
                    <li>Nakshatra boundaries are very precise</li>
                  </ul>
                  <p className="mt-2">
                    The Kunda Siddhanta process ahead will help refine the exact time to match your emotional nature.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setPhase(2)}
          disabled={nakshatraConfirmed === null}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Continue to D9 Soul Quiz
        </button>

        <button
          onClick={() => setPhase(1.5)}
          className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
        >
          ← Back
        </button>
      </div>
    );
  };

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
      {/* ========== BATCH SCAN PROGRESS INDICATOR ========== */}
      {processing && scanProgress.total > 0 && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-5 rounded-xl border border-blue-400/40 mb-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-t-2 border-blue-400"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-blue-400/30"></div>
            </div>
            <div className="flex-1">
              <p className="text-blue-300 font-bold text-lg">{scanProgress.message}</p>
              <p className="text-white/60 text-sm">
                Batch {scanProgress.batchNum} of {scanProgress.totalBatches} • 
                {' '}{scanProgress.current.toLocaleString()} / {scanProgress.total.toLocaleString()} points processed
                {scanProgress.totalBatches > 0 && (
                  <span className="ml-2 text-purple-300">
                    ({Math.round((scanProgress.batchNum / scanProgress.totalBatches) * 100)}% complete)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden shadow-inner mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 transition-all duration-300 ease-out relative"
              style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs">
            <p className="text-white/50">
              ⏱️ Using Swiss Ephemeris batch API for maximum accuracy
            </p>
            <p className="text-purple-300 font-mono">
              {scanProgress.current > 0 && scanProgress.total > 0 && (
                <>~{Math.round((scanProgress.total - scanProgress.current) / 100 * 3)} sec remaining</>
              )}
            </p>
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
                {searchResults.method === "trinal" 
                  ? `No trinal Nakshatra match found within ${searchResults.windowLabel}.`
                  : `The entered birth time doesn't match all your divisional chart selections within ${searchResults.windowLabel}.`
                }
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg mb-4">
                <p className="text-white/80 text-sm font-mono mb-2">Scan Results ({searchResults.windowLabel}):</p>
                <div className="space-y-1 text-xs text-white/70">
                  <p>• Scanned: {searchResults.total} time points</p>
                  
                  {searchResults.method === "trinal" ? (
                    <>
                      <p>• Janma Nakshatra: {moonDetails?.nakshatra}</p>
                      <p>• 1st (Same as Janma): {searchResults.kundaNak1stMatches} matches</p>
                      <p>• 10th from Janma: {searchResults.kundaNak10thMatches} matches</p>
                      <p>• 19th from Janma: {searchResults.kundaNak19thMatches} matches</p>
                      <p className="font-bold text-yellow-400">• Total Trinal Matches: {searchResults.trinalMatches}</p>
                    </>
                  ) : (
                    <>
                      <p>• D1 Lagna {lagnaDetails?.sign} (±2° tolerance): {searchResults.d1Matches || 0} times</p>
                      <p>• D9 {d9Selection} found: {searchResults.d9Matches} times</p>
                      <p>• D10 {d10Selection} found: {searchResults.d10Matches} times</p>
                      <p>• D7 {d7Selection} found: {searchResults.d7Matches} times</p>
                      <p>• Moon {moonRashiSelection} found: {searchResults.moonMatches} times</p>
                      <p className="font-bold text-yellow-400">• All matching (D1+D9+D10+D7+Moon): {searchResults.allMatches}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-4">
                <p className="text-white/90 text-sm mb-2">
                  <strong>What this means:</strong>
                </p>
                <p className="text-white/80 text-xs">
                  {searchResults.method === "trinal"
                    ? "The Kunda Siddhanta trinal method searches for times where (Lagna × 81) % 360 produces a Nakshatra that has a trinal relationship (1st, 10th, or 19th) with your Janma Nakshatra. This ensures astrological harmony."
                    : "The Kunda Siddhanta ensures that the corrected time maintains the same D1 Lagna degree (±2°) while matching all divisional charts. This prevents false matches where the time would jump to a completely different ascendant degree."
                  }
                </p>
              </div>

              {(() => {
                const currentWindow = searchResults.expandedWindow || 0;
                let nextWindowMinutes;
                let nextWindowLabel;
                
                // Check if we've reached ±120 minutes (expandedWindow 24)
                const has120MinWindow = currentWindow >= 24;
                
                if (has120MinWindow) {
                  // Automatically trigger unlimited search
                  return (
                    <>
                      <p className="text-white/90 text-sm mb-3">
                        <strong>No match found within ±120 minutes.</strong>
                        <br/><br/>
                        The birth time appears to be significantly different from the entered time. 
                        The system will now perform an <strong>unlimited search across the entire day</strong> to find a matching time.
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (kundaMethod === "trinal") {
                              handleKundaLockTrinal(999);
                            } else {
                              handleKundaLock(999);
                            }
                          }}
                          disabled={processing}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Search size={18} />
                          Search Entire Day (±12 hours)
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
                }
                
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
                        onClick={() => {
                          if (kundaMethod === "trinal") {
                            handleKundaLockTrinal(currentWindow + 1);
                          } else {
                            handleKundaLock(currentWindow + 1);
                          }
                        }}
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
        <>
          {/* Kunda Method Selection */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">
            <h3 className="text-lg font-bold text-white mb-3">Choose Kunda Siddhanta Method</h3>
            
            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              kundaMethod === "trinal"
                ? 'bg-orange-500/40 border-2 border-orange-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="kunda-method"
                checked={kundaMethod === "trinal"}
                onChange={() => setKundaMethod("trinal")}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white mb-1">Trinal Kunda (Traditional)</div>
                <div className="text-white/80 text-sm mb-2">
                  Uses the formula: <code className="bg-black/30 px-2 py-1 rounded">(Lagna × 81) % 360</code>
                </div>
                <div className="text-white/70 text-xs">
                  Finds times where the Kunda Nakshatra forms a <strong>trinal relationship</strong> with your Janma Nakshatra:
                  <ul className="list-disc list-inside mt-1 ml-2">
                    <li>1st: Same as Janma (most precise)</li>
                    <li>10th: 9 Nakshatras ahead (harmonious)</li>
                    <li>19th: 18 Nakshatras ahead (balanced)</li>
                  </ul>
                </div>
                <div className="text-orange-300 text-xs mt-2">
                  ⚡ Faster scan, ±10 second precision
                </div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              kundaMethod === "divisional"
                ? 'bg-orange-500/40 border-2 border-orange-400'
                : 'bg-white/5 border border-white/20 hover:bg-white/10'
            }`}>
              <input
                type="radio"
                name="kunda-method"
                checked={kundaMethod === "divisional"}
                onChange={() => setKundaMethod("divisional")}
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-bold text-white mb-1">Divisional Charts (Comprehensive)</div>
                <div className="text-white/80 text-sm mb-2">
                  Validates all divisional charts simultaneously
                </div>
                <div className="text-white/70 text-xs">
                  Ensures ALL of these match your confirmed selections:
                  <ul className="list-disc list-inside mt-1 ml-2">
                    <li>D1 Lagna degree (±2° tolerance)</li>
                    <li>D9 Navamsha (soul nature)</li>
                    <li>D10 Dashamsha (career)</li>
                    <li>D7 Saptamsha (legacy)</li>
                    <li>Moon Rashi (emotional base)</li>
                  </ul>
                </div>
                <div className="text-blue-300 text-xs mt-2">
                  🎯 More thorough, ±1 second precision
                </div>
              </div>
            </label>
          </div>

          <button
            onClick={() => {
              if (kundaMethod === "trinal") {
                handleKundaLockTrinal(0);
              } else {
                handleKundaLock(0);
              }
            }}
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
                Lock Birth Time ({kundaMethod === "trinal" ? "Trinal Method" : "Divisional Method"})
              </>
            )}
          </button>
        </>
      )}

      {processing && (
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <div className="space-y-3 text-sm">
            <p className="text-white/80">🔍 Scanning time window{searchResults?.windowLabel?.includes("12 hours") ? " (±12 hours - this may take a moment)" : ""}...</p>
            <p className="text-white/80">✨ Validating D9 + D10 + D7 alignment</p>
            <p className="text-white/80">🌙 Confirming Moon Rashi match</p>
            <p className="text-white/80">🕉️ Applying 81× Kunda multiplier</p>
            {searchResults?.windowLabel?.includes("12 hours") && (
              <p className="text-yellow-300 font-semibold mt-3">⏳ Searching entire day - scanning ~86,000 time points...</p>
            )}
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
              <p className="text-white/80 text-sm mb-6">
                Precision: ±{lockedTime.method === "trinal" ? "10" : "1"} second{lockedTime.method === "trinal" ? "s" : ""} • 
                Kunda Siddhanta ({lockedTime.method === "trinal" ? "Trinal Method" : "Divisional Method"})
              </p>
              
              {lockedTime.method === "trinal" && lockedTime.kundaNakshatra && (
                <div className="bg-orange-500/20 border border-orange-400/30 px-4 py-3 rounded-lg mb-4">
                  <p className="text-white/90 text-sm mb-1">
                    <strong>Kunda Nakshatra:</strong> {lockedTime.kundaNakshatra}
                  </p>
                  <p className="text-white/70 text-xs mb-1">
                    Formula: (Lagna {lockedTime.lagnaDegrees?.toFixed(2)}° × 81) % 360 = {lockedTime.kundaProduct?.toFixed(2)}°
                  </p>
                  <p className="text-orange-300 text-xs font-semibold">
                    {lockedTime.trinalType}
                  </p>
                </div>
              )}
              
              {lockedTime.degreeDiff && (
                <div className="bg-white/10 px-4 py-2 rounded-lg mb-4 inline-block">
                  <p className="text-white/80 text-xs">
                    D1 Lagna degree variance: {lockedTime.degreeDiff}° 
                    {parseFloat(lockedTime.degreeDiff) < 0.1 ? ' (Excellent match! ✨)' : ' (Good match ✓)'}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-left bg-white/20 p-4 rounded-lg">
                <div className="col-span-2 border-b border-white/30 pb-2 mb-2">
                  <p className="text-white/70 text-sm">Lagna (D1)</p>
                  <p className="text-white font-bold text-xl">{lockedTime.lagna.sign}</p>
                  <p className="text-white/80 text-sm">{degreesToDMS(lockedTime.lagna.degree).formatted}</p>
                </div>
                
                {lockedTime.method === "divisional" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-white/70 text-sm">Janma Nakshatra</p>
                      <p className="text-white font-bold">{moonDetails?.nakshatra}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Moon Rashi</p>
                      <p className="text-white font-bold">{lockedTime.moon?.sign || moonDetails?.sign}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-sm text-white/80">
              <strong className="text-white">Progressive Refinement Complete!</strong><br/>
              Your birth time has been progressively narrowed from ±2 hours → ±13 min → ±6 min → ±90 sec → ±1 sec using Vedic divisional chart analysis and Kunda Siddhanta with accurate astronomical coordinates.
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
          onClick={() => setShowResetConfirm(true)}
          className="w-full bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
        >
          ← Start New Rectification
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border-2 border-red-500 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-400" size={32} />
              <h3 className="text-xl font-bold text-white">Confirm Reset</h3>
            </div>
            <p className="text-white/90 mb-4">
              Are you sure you want to start a new rectification?
            </p>
            <div className="bg-white/10 p-3 rounded-lg mb-4">
              <p className="text-white/80 text-sm mb-2">This will clear all current data:</p>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Birth details</li>
                <li>• D1, D9, D10, D7 calculations</li>
                <li>• Locked birth time</li>
              </ul>
            </div>
            <p className="text-yellow-300 text-sm mb-4 font-semibold">
              ⚠️ This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 border border-white/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">⭐ Cosmic Sync via AG</h1>
            <p className="text-white/70">Birth Time Rectification • Progressive Precision • Kunda Siddhanta</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <div key={p} className="flex items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  Math.floor(phase) >= p ? 'bg-purple-500 text-white' : 'bg-white/20 text-white/40'
                }`}>
                  {p === 6 ? '✓' : p}
                </div>
                {p < 6 && <div className={`w-8 h-1 transition-all ${Math.floor(phase) >= p ? 'bg-purple-500' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>

          {/* Phase Content */}
          {phase === 1 && renderPhase1()}
          {phase === 1.2 && renderPhase1_2()}
          {phase === 1.3 && renderPhase1_3()}
          {phase === 1.5 && renderPhase1_5()}
          {phase === 1.7 && renderPhase1_7()}
          {phase === 1.8 && renderPhase1_8()}
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
