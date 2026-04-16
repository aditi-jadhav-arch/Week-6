import { useState } from 'react';

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: { speed: number };
  visibility: number;
  dt: number;
}

interface Theme {
  bgColor: string;
  bgImage: string;
  overlayColor: string;
  borderColor: string;
  borderDark: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  accentBg: string;
  accentText: string;
  statBg: string;
  emoji: string;
}

export default function App() {
  const [city, setCity] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your OpenWeatherMap API key');
      setShowApiInput(true);
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again.');
        }
      }

      const data = await response.json();
      setWeather(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (cityName: string) => {
    setCity(cityName);
    setTimeout(() => {
      fetchWeather();
    }, 0);
  };

  const getTheme = (): Theme => {
    if (!weather) {
      // Default theme
      return {
        bgColor: '#e8f4f8',
        bgImage: 'https://images.unsplash.com/photo-1542339630-e171be99de03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2t5JTIwY2xvdWRzfGVufDF8fHx8MTc3NjMyMTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        overlayColor: 'rgba(224, 242, 254, 0.8)',
        borderColor: '#1e293b',
        borderDark: '#0f172a',
        textPrimary: '#1e293b',
        textSecondary: '#475569',
        cardBg: '#ffffff',
        accentBg: '#38bdf8',
        accentText: '#ffffff',
        statBg: '#e0f2fe',
        emoji: '☁️'
      };
    }

    const currentTime = weather.dt;
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    const isNight = currentTime < sunrise || currentTime > sunset;
    const weatherMain = weather.weather[0].main.toLowerCase();

    // Night themes
    if (isNight) {
      if (weatherMain.includes('rain') || weatherMain.includes('drizzle') || weatherMain.includes('thunder')) {
        return {
          bgColor: '#1e293b',
          bgImage: 'https://images.unsplash.com/photo-1713563311662-f1378935a170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlueSUyMGRheSUyMGNsb3Vkc3xlbnwxfHx8fDE3NzYzMjE4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          overlayColor: 'rgba(15, 23, 42, 0.85)',
          borderColor: '#334155',
          borderDark: '#1e293b',
          textPrimary: '#e2e8f0',
          textSecondary: '#94a3b8',
          cardBg: '#1e293b',
          accentBg: '#475569',
          accentText: '#e2e8f0',
          statBg: '#334155',
          emoji: '🌧️'
        };
      } else if (weatherMain.includes('snow')) {
        return {
          bgColor: '#1e3a5f',
          bgImage: 'https://images.unsplash.com/photo-1606388701602-2e3727da5b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93eSUyMHdpbnRlciUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzYyNDY0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          overlayColor: 'rgba(30, 58, 95, 0.85)',
          borderColor: '#60a5fa',
          borderDark: '#1e3a8a',
          textPrimary: '#dbeafe',
          textSecondary: '#93c5fd',
          cardBg: '#1e3a5f',
          accentBg: '#3b82f6',
          accentText: '#ffffff',
          statBg: '#2563eb',
          emoji: '❄️'
        };
      } else if (weatherMain.includes('cloud') || weatherMain.includes('mist') || weatherMain.includes('fog')) {
        return {
          bgColor: '#27272a',
          bgImage: 'https://images.unsplash.com/photo-1612162661740-ea1a85c5c031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHN0YXJzJTIwZGFyayUyMHNreXxlbnwxfHx8fDE3NzYzMjE4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          overlayColor: 'rgba(39, 39, 42, 0.85)',
          borderColor: '#52525b',
          borderDark: '#18181b',
          textPrimary: '#e4e4e7',
          textSecondary: '#a1a1aa',
          cardBg: '#3f3f46',
          accentBg: '#71717a',
          accentText: '#fafafa',
          statBg: '#52525b',
          emoji: '☁️'
        };
      } else {
        // Clear night
        return {
          bgColor: '#1e1b4b',
          bgImage: 'https://images.unsplash.com/photo-1612162661740-ea1a85c5c031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHN0YXJzJTIwZGFyayUyMHNreXxlbnwxfHx8fDE3NzYzMjE4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          overlayColor: 'rgba(30, 27, 75, 0.8)',
          borderColor: '#818cf8',
          borderDark: '#312e81',
          textPrimary: '#e0e7ff',
          textSecondary: '#a5b4fc',
          cardBg: '#312e81',
          accentBg: '#6366f1',
          accentText: '#ffffff',
          statBg: '#4f46e5',
          emoji: '🌙'
        };
      }
    }

    // Day themes
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle') || weatherMain.includes('thunder')) {
      return {
        bgColor: '#475569',
        bgImage: 'https://images.unsplash.com/photo-1713563311662-f1378935a170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlueSUyMGRheSUyMGNsb3Vkc3xlbnwxfHx8fDE3NzYzMjE4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        overlayColor: 'rgba(148, 163, 184, 0.75)',
        borderColor: '#1e293b',
        borderDark: '#0f172a',
        textPrimary: '#0f172a',
        textSecondary: '#334155',
        cardBg: '#f1f5f9',
        accentBg: '#64748b',
        accentText: '#ffffff',
        statBg: '#cbd5e1',
        emoji: '🌧️'
      };
    } else if (weatherMain.includes('snow')) {
      return {
        bgColor: '#dbeafe',
        bgImage: 'https://images.unsplash.com/photo-1606388701602-2e3727da5b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93eSUyMHdpbnRlciUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzYyNDY0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        overlayColor: 'rgba(219, 234, 254, 0.8)',
        borderColor: '#1e3a8a',
        borderDark: '#1e40af',
        textPrimary: '#1e3a8a',
        textSecondary: '#1e40af',
        cardBg: '#ffffff',
        accentBg: '#3b82f6',
        accentText: '#ffffff',
        statBg: '#bfdbfe',
        emoji: '❄️'
      };
    } else if (weatherMain.includes('cloud') || weatherMain.includes('mist') || weatherMain.includes('fog')) {
      return {
        bgColor: '#e2e8f0',
        bgImage: 'https://images.unsplash.com/photo-1542339630-e171be99de03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2t5JTIwY2xvdWRzfGVufDF8fHx8MTc3NjMyMTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        overlayColor: 'rgba(226, 232, 240, 0.8)',
        borderColor: '#475569',
        borderDark: '#334155',
        textPrimary: '#1e293b',
        textSecondary: '#475569',
        cardBg: '#ffffff',
        accentBg: '#64748b',
        accentText: '#ffffff',
        statBg: '#cbd5e1',
        emoji: '☁️'
      };
    } else {
      // Clear/sunny day
      return {
        bgColor: '#fef3c7',
        bgImage: 'https://images.unsplash.com/photo-1652235888411-6e3291545470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhciUyMHN1bm55JTIwZGF5JTIwYmx1ZSUyMHNreXxlbnwxfHx8fDE3NzYzMjE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        overlayColor: 'rgba(254, 243, 199, 0.75)',
        borderColor: '#b45309',
        borderDark: '#92400e',
        textPrimary: '#78350f',
        textSecondary: '#92400e',
        cardBg: '#ffffff',
        accentBg: '#f59e0b',
        accentText: '#ffffff',
        statBg: '#fde68a',
        emoji: '☀️'
      };
    }
  };

  const theme = getTheme();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative transition-all duration-500"
      style={{ 
        fontFamily: "'Press Start 2P', cursive",
        backgroundColor: theme.bgColor,
        backgroundImage: `url('${theme.bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 transition-all duration-500" 
        style={{ backgroundColor: theme.overlayColor }}
      />
      
      {/* Main container */}
      <div className="w-full max-w-3xl relative z-10">
        
        {/* Header */}
        <div 
          className="mb-6 p-4 text-center transition-all duration-500 border-4"
          style={{ 
            backgroundColor: theme.cardBg,
            borderColor: theme.borderColor,
            boxShadow: `6px 6px 0 ${theme.borderDark}`,
            color: theme.textPrimary
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">{theme.emoji}</span>
            <h1 className="text-xl sm:text-2xl">
              WEATHERNAUT
            </h1>
          </div>
          <p className="text-[8px] leading-relaxed" style={{ color: theme.textSecondary }}>
            Real-time weather data
          </p>
        </div>

        {/* API Key Input */}
        <div className="mb-4">
          <button
            onClick={() => setShowApiInput(!showApiInput)}
            className="px-3 py-2 text-[10px] transition-all duration-500 border-4 hover:opacity-80"
            style={{ 
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor,
              boxShadow: `4px 4px 0 ${theme.borderDark}`,
              color: theme.textPrimary
            }}
          >
            ⚙️ {showApiInput ? 'HIDE' : 'SHOW'} API KEY
          </button>

          {showApiInput && (
            <div 
              className="p-4 mt-3 transition-all duration-500 border-4"
              style={{ 
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
                boxShadow: `6px 6px 0 ${theme.borderDark}`
              }}
            >
              <p className="text-[10px] leading-relaxed mb-3" style={{ color: theme.textPrimary }}>
                Enter your OpenWeatherMap API key
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (e.target.value.trim() === '') {
                    setWeather(null);
                    setError('');
                  }
                }}
                placeholder="API KEY"
                className="w-full px-3 py-3 text-[10px] focus:outline-none transition-all duration-500 border-4"
                style={{ 
                  fontFamily: "'Press Start 2P', cursive",
                  backgroundColor: theme.statBg,
                  borderColor: theme.borderColor,
                  color: theme.textPrimary,
                  boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.1)'
                }}
              />
              <p className="text-[8px] mt-2 leading-relaxed" style={{ color: theme.textSecondary }}>
                Get key at openweathermap.org/api
              </p>
            </div>
          )}
        </div>

        {/* Search Form */}
        <form onSubmit={fetchWeather} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="CITY NAME"
              className="flex-1 px-4 py-4 text-xs focus:outline-none transition-all duration-500 border-4"
              style={{ 
                fontFamily: "'Press Start 2P', cursive",
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
                color: theme.textPrimary,
                boxShadow: `6px 6px 0 ${theme.borderDark}`
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-4 text-xs transition-all duration-500 disabled:opacity-50 border-4"
              style={{ 
                backgroundColor: theme.accentBg,
                color: theme.accentText,
                borderColor: theme.borderDark,
                boxShadow: `6px 6px 0 ${theme.borderDark}`
              }}
            >
              {loading ? '...' : 'SEARCH'}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div 
            className="text-center py-12 transition-all duration-500 border-4"
            style={{ 
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor,
              boxShadow: `8px 8px 0 ${theme.borderDark}`,
              color: theme.textPrimary
            }}
          >
            <div className="text-5xl mb-4">☁️</div>
            <p className="text-xs">LOADING...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div 
            className="p-6 text-center transition-all duration-500 border-4"
            style={{ 
              backgroundColor: theme.cardBg,
              borderColor: '#dc2626',
              boxShadow: '8px 8px 0 #991b1b'
            }}
          >
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-xs mb-3" style={{ color: '#dc2626' }}>ERROR</h3>
            <p className="text-[10px] leading-relaxed" style={{ color: theme.textPrimary }}>{error}</p>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div 
            className="overflow-hidden transition-all duration-500 border-4"
            style={{ 
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor,
              boxShadow: `8px 8px 0 ${theme.borderDark}`
            }}
          >
            {/* Main Weather Info */}
            <div 
              className="p-6 transition-all duration-500 border-b-4"
              style={{ 
                backgroundColor: theme.accentBg,
                borderColor: theme.borderDark
              }}
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <h2 className="text-xl" style={{ color: theme.accentText }}>
                      {weather.name}
                    </h2>
                    <span 
                      className="px-2 py-1 text-[10px] border-2"
                      style={{ 
                        backgroundColor: theme.cardBg,
                        color: theme.textPrimary,
                        borderColor: theme.borderColor
                      }}
                    >
                      {weather.sys.country}
                    </span>
                  </div>
                  <p className="capitalize text-[10px] mb-6 leading-relaxed" style={{ color: theme.accentText, opacity: 0.9 }}>
                    {weather.weather[0].description}
                  </p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-6xl" style={{ color: theme.accentText }}>
                      {Math.round(weather.main.temp)}°
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: theme.accentText, opacity: 0.8 }}>
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </p>
                </div>
                <div>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                    className="w-24 h-24"
                  />
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4 p-6">
              <div 
                className="p-4 transition-all duration-500 border-4"
                style={{ 
                  backgroundColor: theme.statBg,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                <div className="text-3xl mb-2">💧</div>
                <p className="text-[10px] mb-1" style={{ color: theme.textSecondary }}>HUMIDITY</p>
                <p className="text-2xl" style={{ color: theme.textPrimary }}>
                  {weather.main.humidity}%
                </p>
              </div>

              <div 
                className="p-4 transition-all duration-500 border-4"
                style={{ 
                  backgroundColor: theme.statBg,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                <div className="text-3xl mb-2">🌬️</div>
                <p className="text-[10px] mb-1" style={{ color: theme.textSecondary }}>WIND</p>
                <p className="text-2xl" style={{ color: theme.textPrimary }}>
                  {weather.wind.speed}
                  <span className="text-sm"> m/s</span>
                </p>
              </div>

              <div 
                className="p-4 transition-all duration-500 border-4"
                style={{ 
                  backgroundColor: theme.statBg,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                <div className="text-3xl mb-2">⏱️</div>
                <p className="text-[10px] mb-1" style={{ color: theme.textSecondary }}>PRESSURE</p>
                <p className="text-2xl" style={{ color: theme.textPrimary }}>
                  {weather.main.pressure}
                  <span className="text-sm"> hPa</span>
                </p>
              </div>

              <div 
                className="p-4 transition-all duration-500 border-4"
                style={{ 
                  backgroundColor: theme.statBg,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                <div className="text-3xl mb-2">👁️</div>
                <p className="text-[10px] mb-1" style={{ color: theme.textSecondary }}>VISIBILITY</p>
                <p className="text-2xl" style={{ color: theme.textPrimary }}>
                  {(weather.visibility / 1000).toFixed(1)}
                  <span className="text-sm"> km</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !loading && !error && (
          <div 
            className="text-center py-12 transition-all duration-500 border-4"
            style={{ 
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor,
              boxShadow: `8px 8px 0 ${theme.borderDark}`
            }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-4xl">☁️</span>
              <span className="text-4xl">☀️</span>
              <span className="text-4xl">🌧️</span>
            </div>
            <h3 className="text-xs mb-4" style={{ color: theme.textPrimary }}>SEARCH FOR A CITY</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleCityClick('London')}
                className="px-3 py-2 text-[10px] transition-all border-4 hover:opacity-80"
                style={{ 
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                LONDON
              </button>
              <button
                onClick={() => handleCityClick('Paris')}
                className="px-3 py-2 text-[10px] transition-all border-4 hover:opacity-80"
                style={{ 
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                PARIS
              </button>
              <button
                onClick={() => handleCityClick('Tokyo')}
                className="px-3 py-2 text-[10px] transition-all border-4 hover:opacity-80"
                style={{ 
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                TOKYO
              </button>
              <button
                onClick={() => handleCityClick('New York')}
                className="px-3 py-2 text-[10px] transition-all border-4 hover:opacity-80"
                style={{ 
                  backgroundColor: theme.cardBg,
                  color: theme.textPrimary,
                  borderColor: theme.borderColor,
                  boxShadow: `4px 4px 0 ${theme.borderDark}`
                }}
              >
                NEW YORK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
