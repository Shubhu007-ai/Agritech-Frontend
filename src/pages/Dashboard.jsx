import { useEffect, useState, useCallback, useRef } from "react";
import api from "../api/axios";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("Delhi");
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [forecast, setForecast] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [alertText, setAlertText] = useState("Loading latest alerts...");
  const [alertSource, setAlertSource] = useState("static");

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const suggestionsListRef = useRef(null);

  /* -----------------------------
       1. API FETCHING FUNCTIONS
    ------------------------------ */

  const getWeather = useCallback(async (cityOrCoords) => {
    try {
      let weatherUrl = "";

      if (typeof cityOrCoords === "string") {
        weatherUrl = `/weather?city=${cityOrCoords}`;
      } else {
        weatherUrl = `/weather?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}`;
      }

      const weatherRes = await api.get(weatherUrl);

      setLocation(weatherRes.data.name);
      setWeather(weatherRes.data);
      setError("");
    } catch (error) {
      console.error("Weather error:", error);
      setWeather(null);
      setError("Unable to load weather. Please check the city name.");
    }
  }, []);

  const getForecast = useCallback(async (city) => {
    try {
      const url = `/weather-forecast?city=${city}`;
      const res = await api.get(url);
      setForecast(res.data);
    } catch (error) {
      console.error("Forecast error:", error);
      setForecast([]);
    }
  }, []);

  const fetchMarketPrices = useCallback(async () => {
    try {
      const url = "/market-prices";
      const res = await api.get(url);

      if (!Array.isArray(res.data)) {
        throw new Error("Invalid market data");
      }

      return res.data.map((item) => ({
        crop: item.commodity || "Unknown",
        price: `${item.modal_price || 0} Rs/Quintal`,
        state: item.state || "N/A",
        numericPrice: parseInt(item.modal_price) || 0,
      }));
    } catch {
      return [
        {
          crop: "Wheat",
          price: "2125 Rs/Quintal",
          state: "UP",
          numericPrice: 2125,
        },
        {
          crop: "Rice",
          price: "3800 Rs/Quintal",
          state: "Punjab",
          numericPrice: 3800,
        },
        {
          crop: "Cotton",
          price: "6200 Rs/Quintal",
          state: "Gujarat",
          numericPrice: 6200,
        },
        {
          crop: "Mustard",
          price: "5450 Rs/Quintal",
          state: "Rajasthan",
          numericPrice: 5450,
        },
        {
          crop: "Potato",
          price: "1100 Rs/Quintal",
          state: "Agra",
          numericPrice: 1100,
        },
      ];
    }
  }, []);

  const fetchCitySuggestions = async (query) => {
    if (!query || query.length < 3) return;

    try {
      const url = `/city-suggestions?q=${query}`;
      const res = await api.get(url);

      setSuggestions(res.data.filter((city) => city.country === "IN"));
      setShowSuggestions(true);
      setActiveIndex(-1);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const fetchWeatherAlert = useCallback(async (city) => {
    try {
      const res = await api.get(`/weather-alert?city=${city}`);
      setAlertText(res.data.alert);
      setAlertSource(res.data.source);
    } catch {
      setAlertText("Unable to fetch alert. Showing default alert.");
      setAlertSource("static");
    }
  }, []);

  /* -----------------------------
       SEARCH HANDLERS
    ------------------------------ */

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput.length >= 3) fetchCitySuggestions(searchInput);
      else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 100);

    return () => clearTimeout(delay);
  }, [searchInput]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : i));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : -1));
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      handleSelectCity(suggestions[activeIndex]);
    }
  };

  const handleSelectCity = (city) => {
    const c = city.name;
    setSearchInput(c);
    setShowSuggestions(false);
    setLoading(true);

    Promise.all([getWeather(c), getForecast(c), fetchWeatherAlert(c)]).then(
      () => setLoading(false),
    );
  };

  const handleGeolocation = () => {
    setShowSuggestions(false);

    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };

        Promise.all([getWeather(coords), fetchWeatherAlert(location)]).then(
          () => setLoading(false),
        );
      },
      () => {
        alert("Location access denied");
        setLoading(false);
      },
    );
  };

  /* -----------------------------
       INITIAL LOAD
    ------------------------------ */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const marketData = await fetchMarketPrices();
      setMarket(marketData);

      await Promise.all([
        getWeather("Delhi"),
        getForecast("Delhi"),
        fetchWeatherAlert("Delhi"),
      ]);

      setLoading(false);
    };

    loadData();
  }, [fetchMarketPrices, getWeather, getForecast, fetchWeatherAlert]);

  /* -----------------------------
       UTILS
    ------------------------------ */

  const getPm25Color = (v) => {
    if (v <= 10) return "#00e400";
    if (v <= 25) return "rgb(200 197 5)";
    if (v <= 50) return "#ff7e00";
    if (v <= 75) return "#ff0000";
    return "#8f3f97";
  };

  const filteredMarket = market.filter(
    (m) =>
      (selectedCrop === "All Crops" ||
        m.crop.toLowerCase().includes(selectedCrop.toLowerCase())) &&
      m.crop.toLowerCase().includes(search.toLowerCase()),
  );

 if (loading)
  return (
    <>
      <Navbar />

      <div className="dash-container">
        {/* HEADER SKELETON */}
        <div className="dash-header">
          <div className="header-left">
            <div className="skeleton skeleton-text title-skel"></div>
            <div className="skeleton skeleton-text location-skel"></div>
          </div>

          <div className="header-right">
            <div className="skeleton search-skel"></div>
            <div className="skeleton btn-skel"></div>
          </div>
        </div>

        {/* GRID */}
        <div className="dashboard-grid">
          <div className="left-column">
            {/* WEATHER CARD */}
            <div className="card weather-card">
              <div className="skeleton skeleton-box weather-skel"></div>
            </div>

            {/* FORECAST */}
            <div className="card forecast-card">
              <div className="forecast-list">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="forecast-item">
                    <div className="skeleton circle"></div>
                    <div className="skeleton small-text"></div>
                    <div className="skeleton small-text"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MARKET */}
          <div className="card market-card">
            <div className="skeleton skeleton-text medium"></div>

            <div className="market-list">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="market-item">
                  <div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text small"></div>
                  </div>
                  <div className="skeleton badge"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALERT */}
        <div className="card alert-card">
          <div className="skeleton skeleton-text"></div>
        </div>

        {/* TOOLS */}
        <div className="tools-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="tool-card skeleton tool-skel"></div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );

  /* -----------------------------
       UI
    ------------------------------ */

  return (
    <>
      <Navbar />

      <div className="dash-container">
        {error && (
          <ErrorBox message={error} onRetry={() => window.location.reload()} />
        )}

        {/* HEADER */}
        <div className="dash-header">
          <div className="header-left">
           <h2>Hello {user?.name || "User"} 👋</h2>
            <p className="location-text">📍 {location}</p>
          </div>

          <div className="header-right">
            <div className="search-box-container" ref={searchRef}>
              <input
                type="text"
                placeholder="Search city..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="location-search"
              />

              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list" ref={suggestionsListRef}>
                  {suggestions.map((city, i) => (
                    <li
                      key={i}
                      onClick={() => handleSelectCity(city)}
                      style={
                        i === activeIndex
                          ? { background: "#f1f8e9", fontWeight: "bold" }
                          : {}
                      }
                    >
                      {city.name}, {city.state}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="geo-btn" onClick={handleGeolocation}>
              📍 Use my current location
            </button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="dashboard-grid">
          {/* LEFT COLUMN */}
          <div className="left-column">
            <div className="card weather-card modern-weather">
              <div className="weather-header">
                <h3>Current Conditions</h3>
                <span className="live-badge">🔴 Live</span>
              </div>

              {weather && (
                <div className="weather-container">
                  <div className="weather-main">
                    <div className="weather-status">
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                        alt=""
                      />
                      <p>{weather.weather?.[0]?.main}</p>
                    </div>

                    <div className="temp-section">
                      <h1>{Math.round(weather.main?.temp)}°C</h1>
                      <p>Feels like {Math.round(weather.main?.feels_like)}°C</p>
                    </div>
                  </div>

                  <div className="weather-details-grid">
                    <div className="detail-item">
                      <span>
                        💨 {(weather.wind.speed * 3.6).toFixed(1)} km/h
                      </span>
                    </div>
                    <div className="detail-item">
                      <span>💧 {weather.main.humidity}% Humidity</span>
                    </div>
                    <div className="detail-item">
                      <span>☁️ {weather.clouds.all}% Clouds</span>
                    </div>
                    <div className="detail-item">
                      <span
                        style={{
                          color: getPm25Color(weather.pm2_5),
                          fontWeight: "bold",
                        }}
                      >
                        🍃 PM2.5: {weather.pm2_5} µg/m³
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card forecast-card">
              <h3>5-Day Forecast</h3>

              <div className="forecast-list">
                {forecast.map((d, i) => (
                  <div key={i} className="forecast-item">
                    <p className="forecast-day">
                      {new Date(d.dt * 1000).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`}
                      alt=""
                    />
                    <p className="forecast-temp">{Math.round(d.main.temp)}°C</p>
                    <p className="forecast-desc">{d.weather[0].main}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="card market-card">
            <h2 className="card-title">Market Prices</h2>

            <div className="market-controls">
              <input
                type="text"
                placeholder="Search crop..."
                className="market-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="custom-dropdown-container" ref={dropdownRef}>
                <button
                  className="dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {selectedCrop} ▾
                </button>

                {dropdownOpen && (
                  <ul className="custom-dropdown-list">
                    {[
                      "All Crops",
                      "Wheat",
                      "Rice",
                      "Mustard",
                      "Potato",
                      "Tomato",
                      "Maize",
                      "Cotton",
                    ].map((crop) => (
                      <li
                        key={crop}
                        onClick={() => {
                          setSelectedCrop(crop);
                          setDropdownOpen(false);
                        }}
                      >
                        {crop}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="sort-buttons">
              <button
                onClick={() =>
                  setMarket(
                    [...market].sort((a, b) => b.numericPrice - a.numericPrice),
                  )
                }
                className="sort-btn"
              >
                Highest Price
              </button>

              <button
                onClick={() =>
                  setMarket(
                    [...market].sort((a, b) => a.numericPrice - b.numericPrice),
                  )
                }
                className="sort-btn"
              >
                Lowest Price
              </button>
            </div>

            <div className="market-list">
              {filteredMarket.length > 0 ? (
                filteredMarket.map((m, i) => (
                  <div className="market-item" key={i}>
                    <div className="market-left">
                      <p className="crop-name" style={{ color: "#dc5631" }}>
                        {m.crop}
                      </p>
                      <p className="crop-price">{m.price}</p>
                    </div>
                    <span className="state-badge">{m.state}</span>
                  </div>
                ))
              ) : (
                <p className="no-data">No results found.</p>
              )}
            </div>
          </div>
        </div>

        {/* ALERTS */}
        <div className="card alert-card">
          <h3 className="alert-title">Latest Alerts</h3>
          <marquee className="alert-text" direction="left">
            {alertSource === "python" ? "⚠️ " : "ℹ️ "} {alertText}
          </marquee>
        </div>

        {/* TOOL GRID */}
        <div className="tools-grid">
          <button
            className="tool-card"
            onClick={() => navigate("/disease-detector")}
          >
            Disease Detector
          </button>
          <button
            className="tool-card"
            onClick={() => navigate("/soil-report")}
          >
            Soil Report
          </button>
          <div
            className="tool-card"
            onClick={() => {
              const token = localStorage.getItem("token");
              navigate(token ? "/services/finance" : "/login");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Govt Schemes
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
