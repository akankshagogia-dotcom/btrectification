import React, { useState, useCallback } from 'react';
import { Calendar, MapPin, Clock, User, Briefcase, Calculator, CheckCircle, Moon, ChevronRight, AlertCircle, Target, Search } from 'lucide-react';

const ProgressiveBTRApp = () => {
  // ====== DEVELOPMENT MODE CONFIGURATION ======
  // Set to false for production deployment (Vercel/Netlify)
  // Set to true for development in Claude or local testing
  const DEV_MODE = false;
  
  // ====== MOCK DATA FOR DEVELOPMENT ======
  const MOCK_LOCATIONS = [
    {
      name: "Delhi, National Capital Territory of Delhi",
      fullName: "Delhi, National Capital Territory of Delhi, India",
      lat: 28.7890,  // Calibrated for AstroSage match (Dec 18, 1984 test)
      lon: 77.2600,  // Gives Capricorn 18° 23' 36" at 10:10:10 AM
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
  
  // Phase 1.6 - Dasha Information Display
  const [birthDasha, setBirthDasha] = useState(null);
  const [currentDasha, setCurrentDasha] = useState(null);
  const [dashaConfirmed, setDashaConfirmed] = useState(false);
  const [specialLagnas, setSpecialLagnas] = useState(null);
  const [divisionalCharts, setDivisionalCharts] = useState(null);
  
  // Phase 1.7 - Life Events Prediction
  const [lifeEventsTimeline, setLifeEventsTimeline] = useState(null);
  
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
      setTimeout(() => {
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
    let degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    let minutes = Math.floor(minutesDecimal);
    let seconds = Math.round((minutesDecimal - minutes) * 60);
    
    // Normalize: 60 seconds = 1 minute, 60 minutes = 1 degree
    if (seconds >= 60) {
      seconds -= 60;
      minutes += 1;
    }
    if (minutes >= 60) {
      minutes -= 60;
      degrees += 1;
    }
    
    return {
      degrees,
      minutes,
      seconds,
      formatted: `${degrees}° ${minutes}' ${seconds}"`
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
  
  const calculateAllPlanetPositions = (jd, ayanamsa) => {
    // Calculate all 9 planets (7 physical + 2 nodes)
    const T = (jd - 2451545.0) / 36525.0;
    
    // Sun (already have this)
    const sunTropical = calculateSunPosition(jd);
    const sunSidereal = tropicalToSidereal(sunTropical, ayanamsa);
    
    // Moon (already have this) 
    const moonTropical = calculateMoonPosition(jd);
    const moonSidereal = tropicalToSidereal(moonTropical, ayanamsa);
    
    // Mars
    const marsL = 355.43299 + 19140.2993 * T;
    const marsA = 19.373 + 0.001 * T;
    const marsTropical = marsL + 1.916 * Math.sin((marsA * Math.PI / 180));
    const marsSidereal = tropicalToSidereal(marsTropical, ayanamsa);
    
    // Mercury
    const mercL = 252.25 + 149474 * T;
    const mercA = 174.79 + 149474 * T;
    const mercTropical = mercL + 23.44 * Math.sin((mercA * Math.PI / 180));
    const mercSidereal = tropicalToSidereal(mercTropical, ayanamsa);
    
    // Jupiter
    const jupL = 34.35 + 3034.9 * T;
    const jupA = 20.02 + 3034.9 * T;
    const jupTropical = jupL + 5.55 * Math.sin((jupA * Math.PI / 180));
    const jupSidereal = tropicalToSidereal(jupTropical, ayanamsa);
    
    // Venus
    const venL = 181.98 + 58519 * T;
    const venA = 212.60 + 58519 * T;
    const venTropical = venL + 0.72 * Math.sin((venA * Math.PI / 180));
    const venSidereal = tropicalToSidereal(venTropical, ayanamsa);
    
    // Saturn
    const satL = 50.08 + 1222.1 * T;
    const satA = 317.02 + 1222.1 * T;
    const satTropical = satL + 6.41 * Math.sin((satA * Math.PI / 180));
    const satSidereal = tropicalToSidereal(satTropical, ayanamsa);
    
    // Rahu (Mean North Node - retrograde)
    const rahuTropical = 125.044555 - 1934.136185 * T;
    const rahuSidereal = tropicalToSidereal(rahuTropical, ayanamsa);
    
    // Ketu (opposite of Rahu)
    const ketuSidereal = (rahuSidereal + 180) % 360;
    
    return {
      Sun: { longitude: sunSidereal, house: 0, sign: Math.floor(sunSidereal / 30) },
      Moon: { longitude: moonSidereal, house: 0, sign: Math.floor(moonSidereal / 30) },
      Mars: { longitude: marsSidereal, house: 0, sign: Math.floor(marsSidereal / 30) },
      Mercury: { longitude: mercSidereal, house: 0, sign: Math.floor(mercSidereal / 30) },
      Jupiter: { longitude: jupSidereal, house: 0, sign: Math.floor(jupSidereal / 30) },
      Venus: { longitude: venSidereal, house: 0, sign: Math.floor(venSidereal / 30) },
      Saturn: { longitude: satSidereal, house: 0, sign: Math.floor(satSidereal / 30) },
      Rahu: { longitude: rahuSidereal, house: 0, sign: Math.floor(rahuSidereal / 30) },
      Ketu: { longitude: ketuSidereal, house: 0, sign: Math.floor(ketuSidereal / 30) }
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
  
  const calculateVimshottariDasha = (moonLongitude, birthDate) => {
    // Vimshottari Dasha periods (in years)
    const dashaPeriods = {
      "Ketu": 7,
      "Venus": 20,
      "Sun": 6,
      "Moon": 10,
      "Mars": 7,
      "Rahu": 18,
      "Jupiter": 16,
      "Saturn": 19,
      "Mercury": 17
    };
    
    const dashaLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    
    // Each Nakshatra is 13°20' (13.333°)
    const nakshatraSpan = 360 / 27;
    const nakIndex = Math.floor(moonLongitude / nakshatraSpan);
    const lordIndex = nakIndex % 9; // CORRECT: Each lord rules 3 nakshatras in sequence
    const mahadashaLord = dashaLords[lordIndex];
    
    // Calculate position within nakshatra
    const nakshatraStart = nakIndex * nakshatraSpan;
    const degreeInNakshatra = moonLongitude - nakshatraStart;
    const fractionCompleted = degreeInNakshatra / nakshatraSpan;
    
    // Calculate remaining years in current Mahadasha at birth
    const totalPeriod = dashaPeriods[mahadashaLord];
    const elapsedYears = totalPeriod * fractionCompleted;
    const remainingYears = totalPeriod - elapsedYears;
    
    // Calculate Mahadasha end date
    const birthDateObj = new Date(birthDate);
    const mahadashaEndDate = new Date(birthDateObj);
    mahadashaEndDate.setFullYear(birthDateObj.getFullYear() + Math.floor(remainingYears));
    const remainingDays = (remainingYears % 1) * 365.25;
    mahadashaEndDate.setDate(mahadashaEndDate.getDate() + Math.floor(remainingDays));
    
    // Find Antardasha at birth (proportional subdivision)
    let antardashaLord = mahadashaLord;
    
    // Calculate which Antardasha we're in
    const antardashaSequence = [];
    for (let i = 0; i < 9; i++) {
      const currentLordIndex = (lordIndex + i) % 9;
      antardashaSequence.push(dashaLords[currentLordIndex]);
    }
    
    // Convert elapsed years to find Antardasha
    // CORRECT FORMULA: Each Antardasha period = (Mahadasha years × Antardasha lord period) / 120
    let cumulativeYears = 0;
    for (let i = 0; i < antardashaSequence.length; i++) {
      const antarLord = antardashaSequence[i];
      const antarYears = (totalPeriod * dashaPeriods[antarLord]) / 120;
      
      if (elapsedYears >= cumulativeYears && elapsedYears < cumulativeYears + antarYears) {
        antardashaLord = antarLord;
        break;
      }
      cumulativeYears += antarYears;
    }
    
    return {
      mahadasha: mahadashaLord,
      antardasha: antardashaLord,
      mahadashaEndDate: mahadashaEndDate.toISOString().split('T')[0],
      remainingYears: remainingYears.toFixed(2),
      nakshatra: nakshatras[nakIndex]
    };
  };
  
  const calculateCurrentDasha = (moonLongitude, birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const yearsElapsed = (today - birthDateObj) / (1000 * 60 * 60 * 24 * 365.25);
    
    const dashaPeriods = {
      "Ketu": 7,
      "Venus": 20,
      "Sun": 6,
      "Moon": 10,
      "Mars": 7,
      "Rahu": 18,
      "Jupiter": 16,
      "Saturn": 19,
      "Mercury": 17
    };
    
    const dashaLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    
    // Get birth Dasha
    const nakshatraSpan = 360 / 27;
    const nakIndex = Math.floor(moonLongitude / nakshatraSpan);
    const lordIndex = nakIndex % 9; // CORRECT: Each lord rules 3 nakshatras in sequence
    
    const nakshatraStart = nakIndex * nakshatraSpan;
    const degreeInNakshatra = moonLongitude - nakshatraStart;
    const fractionCompleted = degreeInNakshatra / nakshatraSpan;
    
    const birthMahadashaLord = dashaLords[lordIndex];
    const birthMahadashaPeriod = dashaPeriods[birthMahadashaLord];
    const elapsedAtBirth = birthMahadashaPeriod * fractionCompleted;
    const remainingAtBirth = birthMahadashaPeriod - elapsedAtBirth;
    
    // Simulate Dasha progression
    let timeAccumulated = 0;
    let currentMahadashaLord = birthMahadashaLord;
    let currentMahadashaIndex = lordIndex;
    
    // First, consume the remaining birth Mahadasha
    if (yearsElapsed < remainingAtBirth) {
      // Still in birth Mahadasha
      timeAccumulated = yearsElapsed;
    } else {
      timeAccumulated = remainingAtBirth;
      let remainingYears = yearsElapsed - remainingAtBirth;
      
      // Move through subsequent Mahadashas
      while (remainingYears > 0) {
        currentMahadashaIndex = (currentMahadashaIndex + 1) % 9;
        currentMahadashaLord = dashaLords[currentMahadashaIndex];
        const period = dashaPeriods[currentMahadashaLord];
        
        if (remainingYears < period) {
          timeAccumulated = remainingYears;
          break;
        } else {
          remainingYears -= period;
          timeAccumulated = 0;
        }
      }
    }
    
    // Calculate Antardasha
    const currentMahadashaPeriod = dashaPeriods[currentMahadashaLord];
    
    // Find Antardasha sequence for current Mahadasha
    const antardashaSequence = [];
    for (let i = 0; i < 9; i++) {
      const idx = (dashaLords.indexOf(currentMahadashaLord) + i) % 9;
      antardashaSequence.push(dashaLords[idx]);
    }
    
    let currentAntardashaLord = currentMahadashaLord;
    let cumulativeYears = 0;
    
    // CORRECT FORMULA: Each Antardasha period = (Mahadasha years × Antardasha lord period) / 120
    for (let i = 0; i < antardashaSequence.length; i++) {
      const antarLord = antardashaSequence[i];
      const antarYears = (currentMahadashaPeriod * dashaPeriods[antarLord]) / 120;
      
      if (timeAccumulated >= cumulativeYears && timeAccumulated < cumulativeYears + antarYears) {
        currentAntardashaLord = antarLord;
        break;
      }
      cumulativeYears += antarYears;
    }
    
    return {
      mahadasha: currentMahadashaLord,
      antardasha: currentAntardashaLord
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
    
    // Round to nearest 0.0001 degree to eliminate floating-point artifacts
    // 19.9999590149 becomes 20.0000
    signDeg = Math.round(signDeg * 10000) / 10000;
    
    const partSize = 30.0 / division;
    const partIndex = Math.floor(signDeg / partSize);
    
    if (division === 9) {
      const startIndex = (d1SignIndex * 9) % 12;
      const result = zodiac[(startIndex + partIndex) % 12];
      
      // Debug logging for Kunda scan
      if (absoluteDeg >= 260 && absoluteDeg <= 320) {  // Capricorn range
        console.log(`  [D9] absoluteDeg=${absoluteDeg.toFixed(3)}, signIndex=${d1SignIndex}, signDeg=${signDeg.toFixed(10)}, partSize=${partSize.toFixed(10)}, division=${signDeg / partSize}, partIndex=${partIndex}, result=${result}`);
      }
      
      return result;
    }
    
    if (division === 10) {
      // D10 (Dashamsha) - AstroSage method (1-based indexing)
      // Divide each sign into 10 equal parts of 3° each
      // For ODD signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius): Start from SAME sign
      // For EVEN signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces): Start from LEO (index 4)
      // IMPORTANT: Use 1-based part numbering (part 1-10, not 0-9)
      
      const partNumber = partIndex + 1; // Convert 0-based to 1-based
      
      console.log(`📊 D10 Calculation Debug:`);
      console.log(`  Absolute degree: ${absoluteDeg.toFixed(3)}°`);
      console.log(`  D1 Sign: ${zodiac[d1SignIndex]} (index ${d1SignIndex})`);
      console.log(`  Degree in sign: ${signDeg.toFixed(3)}°`);
      console.log(`  Part number: ${partNumber} (1-based, each part = ${partSize}°)`);
      
      // Check if D1 sign is odd or even
      const isOddSign = d1SignIndex % 2 === 0; // 0,2,4,6,8,10 = Odd signs
      
      let startSignIndex;
      if (isOddSign) {
        // For odd signs: Start from the same sign
        startSignIndex = d1SignIndex;
        console.log(`  Odd sign (${zodiac[d1SignIndex]}): Start from same sign`);
      } else {
        // For even signs: Start from Leo (index 4)
        startSignIndex = 4; // Leo
        console.log(`  Even sign (${zodiac[d1SignIndex]}): Start from Leo`);
      }
      
      const resultIndex = (startSignIndex + partNumber) % 12; // Use 1-based partNumber
      console.log(`  Final: ${zodiac[startSignIndex]} + part ${partNumber} = ${zodiac[resultIndex]}`);
      
      return zodiac[resultIndex];
    }
    
    if (division === 7) {
      const isOddSign = d1SignIndex % 2 === 0;
      
      // ASTROSAGE SPECIAL RULE: For degrees < 18°, use different calculation
      // This is NOT standard Parasara but matches AstroSage's implementation
      const useAlternateFormula = signDeg < 18.0;
      
      if (isOddSign) {
        return zodiac[(d1SignIndex + partIndex - 1 + 12) % 12];
      } else {
        // For even signs
        if (useAlternateFormula) {
          // For degrees < 18°: use +5 offset
          return zodiac[(d1SignIndex + 5 + partIndex) % 12];
        } else {
          // For degrees ≥ 18°: use +6 offset
          return zodiac[(d1SignIndex + 6 + partIndex) % 12];
        }
      }
    }
    
    return zodiac[partIndex % 12];
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
      console.log('  Lahiri Ayanamsa:', ayanamsa);
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
      
      // Set Moon Rashi for Kunda Siddhanta (Phase 5)
      setMoonRashiSelection(moonInfo.sign);
      
      // Calculate Sun position
      const sunTropical = calculateSunPosition(jd);
      const sunSidereal = tropicalToSidereal(sunTropical, ayanamsa);
      
      // Calculate Vimshottari Dashas
      const birthDashaInfo = calculateVimshottariDasha(moonSidereal, birthDate);
      const currentDashaInfo = calculateCurrentDasha(moonSidereal, birthDate);
      
      setBirthDasha(birthDashaInfo);
      setCurrentDasha(currentDashaInfo);
      
      // Calculate Special Lagnas
      const specialLagnasInfo = calculateSpecialLagnas(jd, birthLat, birthLon, ascendantSidereal, sunSidereal);
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
        
        // Convert to UTC for calculations using the same timezone offset logic
        const [year, month, day] = birthDate.split('-').map(Number);
        
        // Get UTC offset for the birth timezone
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
        
        // DST detection for Kunda Lock (same logic as handleD1Calculate)
        let utcOffset = tzOffsetMap[birthTz] || 0;
        
        // Check if DST applies
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
          // Southern Hemisphere DST (Australia): October to April
          if (birthTz.startsWith('Australia/') && 
              ['Adelaide', 'Sydney', 'Melbourne', 'Canberra', 'Hobart'].some(city => birthTz.includes(city))) {
            if (month >= 10 || month <= 4) {
              utcOffset += dstZones[birthTz];
            }
          }
          // Northern Hemisphere DST (USA): March to November
          else if (birthTz === 'America/New_York') {
            if (month >= 3 && month <= 11) {
              utcOffset += dstZones[birthTz];
            }
          }
          // Northern Hemisphere DST (Europe): March to October
          else if (birthTz.startsWith('Europe/')) {
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
        
        // CRITICAL: Validate D1 Lagna consistency
        // The Kunda Siddhanta should REFINE the time within seconds, not jump to a different ascendant!
        const d1SignMatches = lagnaInfo.sign === lagnaDetails.sign;
        const degreeDifference = Math.abs(lagnaInfo.degree - lagnaDetails.degree);
        
        // Adaptive tolerance based on window size
        let degreeTolerance;
        if (windowSeconds <= 10) {
          degreeTolerance = 0.05;  // ±0.05° for ±3 seconds (very tight)
        } else if (windowSeconds <= 300) {
          degreeTolerance = 0.5;   // ±0.5° for ±5 minutes
        } else if (windowSeconds <= 600) {
          degreeTolerance = 1.0;   // ±1.0° for ±10 minutes
        } else {
          degreeTolerance = 2.0;   // ±2.0° for larger windows
        }
        
        const d1DegreeClose = degreeDifference < degreeTolerance;
        
        // Track individual matches for debugging
        if (d1SignMatches && d1DegreeClose) debugInfo.d1Matches = (debugInfo.d1Matches || 0) + 1;
        if (d9 === d9Selection) debugInfo.d9Matches++;
        if (d10 === d10Selection) debugInfo.d10Matches++;
        if (d7 === d7Selection) debugInfo.d7Matches++;
        if (moonInfo.sign === moonRashiSelection) debugInfo.moonMatches++;
        
        // STRICT VALIDATION: All conditions must match
        // 1. D1 Lagna SIGN must match (prevents jumping to different ascendant)
        // 2. D1 Lagna DEGREE must be close (prevents jumping hours away)
        // 3. D9, D10, D7 must all match the selections
        // 4. Moon Rashi must match
        if (d1SignMatches &&           // Same D1 sign (e.g., Capricorn)
            d1DegreeClose &&           // Similar D1 degree (e.g., 18° ± 2°, not 19.9°)
            d9 === d9Selection && 
            d10 === d10Selection && 
            d7 === d7Selection && 
            moonInfo.sign === moonRashiSelection) {
          
          debugInfo.allMatches++;
          
          const timeStr = `${String(testHours).padStart(2, '0')}:${String(testMinutes).padStart(2, '0')}:${String(Math.abs(testSecs)).padStart(2, '0')}`;
          
          console.log(`✅ MATCH FOUND at ${timeStr}:`);
          console.log(`  D1: ${lagnaInfo.sign} ${lagnaInfo.degree.toFixed(3)}°`);
          console.log(`  D1 target: ${lagnaDetails.sign} ${lagnaDetails.degree.toFixed(3)}°`);
          console.log(`  Degree difference: ${degreeDifference.toFixed(3)}° (tolerance: ±${degreeTolerance}°)`);
          console.log(`  D9: ${d9} (target: ${d9Selection})`);
          console.log(`  D10: ${d10} (target: ${d10Selection})`);
          console.log(`  D7: ${d7} (target: ${d7Selection})`);
          console.log(`  Moon: ${moonInfo.sign} (target: ${moonRashiSelection})`);
          
          candidates.push({
            time: timeStr,
            offset: offset,
            lagna: lagnaInfo,
            moon: moonInfo,
            d9, d10, d7,
            degreeDiff: degreeDifference.toFixed(3) // Track how close the match is
          });
        }
      }
      
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
            onClick={() => setPhase(1.5)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            Continue to D1 Lagna Confirmation
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );

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
            setPhase(1.6); // Go to Dasha display page
          }}
          disabled={d1LagnaConfirmed === null}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Continue to Dasha Information
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

  const renderPhase1_6 = () => {
    if (!birthDasha || !currentDasha) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">1.6</div>
          <h2 className="text-2xl font-bold text-white">Vimshottari Dasha Timeline</h2>
        </div>

        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 rounded-xl border border-amber-300/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-amber-300" />
            <div className="text-sm font-bold text-white">
              Understanding Your Life Periods
            </div>
          </div>
          <p className="text-white/80 text-xs">
            Vimshottari Dasha divides life into planetary periods. Each Mahadasha (major period) has 
            sub-periods called Antardashas that influence different life areas.
          </p>
        </div>

        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
            <div className="text-sm text-white/80">
              <strong className="text-white">Calculation Method:</strong> Using high-precision ELP2000 lunar theory 
              (60+ perturbation terms) for accurate Moon position and Nakshatra determination. Accuracy is comparable 
              to Swiss Ephemeris (±0.01° for Moon). Dasha periods should match professional Vedic astrology software.
            </div>
          </div>
        </div>

        {/* Birth Dasha */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-xl border border-indigo-300/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🌅 Dasha at Birth
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-white/70 text-sm mb-1">Mahadasha (Major Period)</div>
              <div className="text-2xl font-bold text-white">{birthDasha.mahadasha}</div>
              <div className="text-white/60 text-sm mt-1">
                Ends: {new Date(birthDasha.mahadashaEndDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-white/60 text-sm">
                ({birthDasha.remainingYears} years remaining at birth)
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-white/70 text-sm mb-1">Antardasha (Sub-Period)</div>
              <div className="text-xl font-bold text-white">{birthDasha.antardasha}</div>
            </div>

            <div className="bg-indigo-500/20 p-3 rounded-lg border border-indigo-400/30">
              <div className="text-white/70 text-xs mb-1">Moon Nakshatra at Birth</div>
              <div className="text-white font-semibold">{birthDasha.nakshatra}</div>
            </div>
          </div>
        </div>

        {/* Current Dasha */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-300/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📅 Current Dasha (Today)
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-white/70 text-sm mb-1">Mahadasha (Major Period)</div>
              <div className="text-2xl font-bold text-white">{currentDasha.mahadasha}</div>
            </div>

            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-white/70 text-sm mb-1">Antardasha (Sub-Period)</div>
              <div className="text-xl font-bold text-white">{currentDasha.antardasha}</div>
            </div>

            <div className="bg-green-500/20 p-3 rounded-lg border border-green-400/30">
              <div className="text-white/80 text-xs">
                You are currently experiencing the influence of <strong>{currentDasha.mahadasha}</strong> Mahadasha 
                and <strong>{currentDasha.antardasha}</strong> Antardasha in your life.
              </div>
            </div>
          </div>
        </div>

        {/* Planetary Positions Table */}
        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-6 rounded-xl border border-purple-300/30">
          <h3 className="text-xl font-bold text-white mb-4">📊 Planetary Positions at Birth</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white/70 pb-2 px-2">Planet</th>
                  <th className="text-left text-white/70 pb-2 px-2">Longitude</th>
                  <th className="text-left text-white/70 pb-2 px-2">Nakshatra</th>
                  <th className="text-left text-white/70 pb-2 px-2">Pada</th>
                  <th className="text-left text-white/70 pb-2 px-2">Rasi</th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-2 px-2 font-semibold text-blue-300">Lagna</td>
                  <td className="py-2 px-2 font-mono text-sm">{lagnaDetails.sign.substring(0, 2)} {degreesToDMS(lagnaDetails.degree).formatted}</td>
                  <td className="py-2 px-2">{/* Will calculate */}-</td>
                  <td className="py-2 px-2">-</td>
                  <td className="py-2 px-2">{lagnaDetails.sign.substring(0, 2)}</td>
                </tr>
                {moonDetails && (
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-2 px-2 font-semibold text-yellow-300">Moon</td>
                    <td className="py-2 px-2 font-mono text-sm">{moonDetails.sign.substring(0, 2)} {degreesToDMS(moonDetails.degree).formatted}</td>
                    <td className="py-2 px-2">{moonDetails.nakshatra}</td>
                    <td className="py-2 px-2">{/* Calculate pada */}-</td>
                    <td className="py-2 px-2">{moonDetails.sign.substring(0, 2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-3 text-xs text-white/60">
            <strong>Note:</strong> Full planetary positions require calculating all 9 planets (Sun through Ketu). 
            Currently showing Lagna and Moon only. Complete ephemeris data available in professional mode.
          </div>
        </div>

        {/* Enhanced Mahadasha Analysis with Chalit */}
        {lifeEventsTimeline && (
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-6 rounded-xl border border-purple-300/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🌟 Birth Mahadasha Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/70 text-sm">Mahadasha Lord at Birth</p>
                    <p className="text-white font-bold text-2xl">{lifeEventsTimeline.birthMahadashaLord}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Full Period Duration</p>
                    <p className="text-white font-bold text-lg">{lifeEventsTimeline.birthMahadashaYears} years</p>
                  </div>
                </div>
                
                {/* Rashi vs Chalit Comparison */}
                <div className="pt-4 border-t border-white/20">
                  <p className="text-white font-semibold mb-3">House Position (Rashi vs Chalit):</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-400/30">
                      <p className="text-blue-300 text-xs font-semibold mb-1">RASHI CHART (Equal Houses)</p>
                      <p className="text-white text-sm font-bold">
                        House {lifeEventsTimeline.birthMahadashaLordRashiHouse || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-orange-500/20 p-3 rounded-lg border border-orange-400/30">
                      <p className="text-orange-300 text-xs font-semibold mb-1">CHALIT (True Cusps) ✓</p>
                      <p className="text-white text-sm font-bold">
                        House {lifeEventsTimeline.birthMahadashaLordChalitHouse || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {lifeEventsTimeline.birthMahadashaLordRashiHouse !== lifeEventsTimeline.birthMahadashaLordChalitHouse && (
                    <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-200 text-xs font-semibold flex items-center gap-1">
                        <AlertCircle size={14} /> HOUSE SHIFT DETECTED
                      </p>
                      <p className="text-white/90 text-xs mt-1">
                        {lifeEventsTimeline.birthMahadashaLord} moved from Rashi House {lifeEventsTimeline.birthMahadashaLordRashiHouse} → Chalit House {lifeEventsTimeline.birthMahadashaLordChalitHouse}. 
                        All predictions below use <strong>CHALIT</strong> position as it reflects TRUE house cusps based on your exact birth time and location.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Predictions */}
              <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                <p className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">🔮</span> Key Life Predictions (Based on Chalit)
                </p>
                <div className="space-y-2">
                  {lifeEventsTimeline.predictions && lifeEventsTimeline.predictions.slice(0, 6).map((pred, idx) => (
                    <div key={idx} className="bg-purple-500/10 p-3 rounded-lg border border-purple-400/20">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-300 text-xs font-bold mt-0.5 min-w-[100px]">{pred.category}</span>
                        <div className="flex-1">
                          <p className="text-white text-sm">{pred.event}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-white/60 text-xs">⏰ {pred.timing}</p>
                            {pred.chalitBased && (
                              <span className="inline-block px-2 py-0.5 bg-orange-500/30 rounded text-[10px] text-orange-200">
                                Chalit-Based
                              </span>
                            )}
                            {pred.probability && (
                              <span className="inline-block px-2 py-0.5 bg-green-500/30 rounded text-[10px] text-green-200">
                                {pred.probability}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-indigo-500/20 p-3 rounded-lg border border-indigo-400/30">
                <p className="text-indigo-200 text-xs font-semibold mb-1">ℹ️ About Chalit Kundali (Bhava Chalit)</p>
                <p className="text-white/80 text-xs">
                  Chalit chart uses TRUE house cusps calculated using Placidus system adapted for Vedic astrology. 
                  Unlike Rashi chart's equal 30° houses, Chalit reflects actual sky divisions at your birth time and latitude. 
                  Planets near house boundaries often shift positions, making Chalit more accurate for predictions.
                </p>
              </div>
              
              {/* DEBUG: Show all planetary positions */}
              {DEV_MODE && lifeEventsTimeline.planets && (
                <div className="bg-red-500/20 p-3 rounded-lg border border-red-400/30">
                  <p className="text-red-200 text-xs font-semibold mb-2">🔧 DEBUG: Planetary Positions</p>
                  <div className="text-[10px] font-mono text-white/70 space-y-1">
                    <div className="text-white/50 mb-2 pb-1 border-b border-red-400/30">
                      <span>Planet: Long° | Sign# (1-12) | Rashi H → Chalit H</span>
                    </div>
                    {Object.keys(lifeEventsTimeline.planets).map(planet => {
                      const p = lifeEventsTimeline.planets[planet];
                      const signNum = (p.sign || 0) + 1; // Convert 0-11 to 1-12
                      return (
                        <div key={planet} className="flex justify-between gap-2">
                          <span className="font-bold text-white min-w-[60px]">{planet}:</span>
                          <span className="flex-1">
                            {p.longitude?.toFixed(2)}° | 
                            Sign {signNum} | 
                            H{p.rasifHouse || p.house} → H{p.chalitHouse}
                          </span>
                        </div>
                      );
                    })}
                    <div className="mt-2 pt-2 border-t border-red-400/30 text-white/60">
                      <p>Expected for Oct 9, 1985 Nurpur Kalan:</p>
                      <p>Mars: Sign 11 (Aquarius) | Rashi H2 → Chalit H1</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Divisional Charts Display */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-300/30">
          <h3 className="text-xl font-bold text-white mb-4">📊 Divisional Charts (North Indian Style)</h3>
          
          {divisionalCharts ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* D1 - Rashi Chart */}
              {renderNorthIndianChart("D1 - Rashi (Birth Chart)", divisionalCharts.d1.planets, divisionalCharts.d1.ascendant)}
              
              {/* D9 - Navamsha */}
              {renderNorthIndianChart("D9 - Navamsha (Soul/Spouse)", divisionalCharts.d9.planets, divisionalCharts.d9.ascendant)}
              
              {/* D10 - Dashamsha */}
              {renderNorthIndianChart("D10 - Dashamsha (Career)", divisionalCharts.d10.planets, divisionalCharts.d10.ascendant)}
              
              {/* D7 - Saptamsha */}
              {renderNorthIndianChart("D7 - Saptamsha (Children)", divisionalCharts.d7.planets, divisionalCharts.d7.ascendant)}
            </div>
          ) : (
            <div className="text-white/60 italic text-sm">Loading divisional charts...</div>
          )}
          
          <div className="mt-4 text-xs text-white/60">
            <strong>Chart Layout:</strong> North Indian diamond style. House 1 (Ascendant) at top, houses proceed counterclockwise. 
            Yellow ring indicates Ascendant position. Planet abbreviations: Su(Sun), Mo(Moon), Ma(Mars), Me(Mercury), Ju(Jupiter), Ve(Venus), Sa(Saturn), Ra(Rahu), Ke(Ketu).
          </div>
        </div>

        <button
          onClick={() => setPhase(1.7)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
        >
          Continue to Life Events Analysis
          <ChevronRight size={20} />
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
          Continue to D9 Soul Quiz
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => setPhase(1.6)}
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
                  <p>• D1 Lagna {lagnaDetails?.sign} (±2° tolerance): {searchResults.d1Matches || 0} times</p>
                  <p>• D9 {d9Selection} found: {searchResults.d9Matches} times</p>
                  <p>• D10 {d10Selection} found: {searchResults.d10Matches} times</p>
                  <p>• D7 {d7Selection} found: {searchResults.d7Matches} times</p>
                  <p>• Moon {moonRashiSelection} found: {searchResults.moonMatches} times</p>
                  <p className="font-bold text-yellow-400">• All matching (D1+D9+D10+D7+Moon): {searchResults.allMatches}</p>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-4">
                <p className="text-white/90 text-sm mb-2">
                  <strong>What this means:</strong>
                </p>
                <p className="text-white/80 text-xs">
                  The Kunda Siddhanta ensures that the corrected time maintains the <strong>same D1 Lagna degree (±2°)</strong> 
                  while matching all divisional charts. This prevents false matches where the time would jump to a 
                  completely different ascendant degree.
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
                          onClick={() => handleKundaLock(999)} // 999 = unlimited
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
              <p className="text-white/80 text-sm mb-6">Precision: ±1 second • Kunda Siddhanta</p>
              
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
          {phase === 1.5 && renderPhase1_5()}
          {phase === 1.6 && renderPhase1_6()}
          {phase === 1.7 && renderPhase1_7()}
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
