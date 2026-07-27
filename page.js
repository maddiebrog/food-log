"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "food-log:entries";

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatHeaderDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const emptyForm = { name: "", calories: "", protein: "", carbs: "", fat: "" };

export default function Page() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [form, setForm] = useState(emptyForm);
  const [showStamp, setShowStamp] = useState(false);

  // Load from localStorage once, on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch (err) {
      console.error("Could not read saved entries:", err);
    }
    setLoaded(true);
  }, []);

  // Persist whenever entries change (after initial load).
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error("Could not save entries:", err);
    }
  }, [entries, loaded]);

  const todayKey = toDateKey(new Date());
  const isToday = selectedDate === todayKey;

  const dayEntries = useMemo(
    () =>
      entries
        .filter((e) => e.date === selectedDate)
        .sort((a, b) => new Date(a.time) - new Date(b.time)),
    [entries, selectedDate]
  );

  const totals = useMemo(
    () =>
      dayEntries.reduce(
        (acc, e) => ({
          calories: acc.calories + (Number(e.calories) || 0),
          protein: acc.protein + (Number(e.protein) || 0),
          carbs: acc.carbs + (Number(e.carbs) || 0),
          fat: acc.fat + (Number(e.fat) || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [dayEntries]
  );

  function shiftDay(delta) {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + delta);
    setSelectedDate(toDateKey(date));
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    const calories = Number(form.calories);
    if (!name || !Number.isFinite(calories) || calories < 0) return;

    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: selectedDate,
      time: new Date().toISOString(),
      name,
      calories,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    };

    setEntries((prev) => [...prev, newEntry]);
    setForm(emptyForm);
    setShowStamp(true);
    setTimeout(() => setShowStamp(false), 2100);
  }

  function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main className="stage">
      <div className="receipt">
        <div className="masthead">
          <div className="eyebrow">Kitchen &amp; Table Co.</div>
          <h1>The Daily Tab</h1>
          <div className="sub">one line per bite — no rounding down</div>
        </div>

        <div className="date-nav">
          <button type="button" onClick={() => shiftDay(-1)} aria-label="Previous day">
            ‹
          </button>
          <div>
            <div className="current-date">{formatHeaderDate(selectedDate)}</div>
            {isToday && <span className="today-badge">TODAY</span>}
          </div>
          <button
            type="button"
            onClick={() => shiftDay(1)}
            aria-label="Next day"
            disabled={isToday}
            style={{ opacity: isToday ? 0.35 : 1, cursor: isToday ? "default" : "pointer" }}
          >
            ›
          </button>
        </div>

        <form className="entry-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="What did you eat?"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="kcal"
            min="0"
            value={form.calories}
            onChange={(e) => handleChange("calories", e.target.value)}
            required
          />
          <div className="macro-row">
            <input
              type="number"
              inputMode="numeric"
              placeholder="protein g"
              min="0"
              value={form.protein}
              onChange={(e) => handleChange("protein", e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="carbs g"
              min="0"
              value={form.carbs}
              onChange={(e) => handleChange("carbs", e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="fat g"
              min="0"
              value={form.fat}
              onChange={(e) => handleChange("fat", e.target.value)}
            />
          </div>
          <button className="add-btn" type="submit">
            Add to tab
          </button>
        </form>

        <div className="stamp-wrap">
          {showStamp && <div className="stamp">LOGGED</div>}
        </div>

        <div className="line-items">
          {dayEntries.length === 0 ? (
            <div className="empty-state">
              Nothing on the tab yet.
              <br />
              Add your first item above.
            </div>
          ) : (
            dayEntries.map((entry) => (
              <div className="item-row" key={entry.id}>
                <span className="name">{entry.name}</span>
                <span className="leader" />
                <span className="time">{formatTime(entry.time)}</span>
                <span className="cals">{entry.calories}</span>
                <button
                  className="del"
                  onClick={() => handleDelete(entry.id)}
                  aria-label={`Remove ${entry.name}`}
                  title="Remove"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="totals">
          <div className="row">
            <span>protein</span>
            <span>{Math.round(totals.protein)} g</span>
          </div>
          <div className="row">
            <span>carbs</span>
            <span>{Math.round(totals.carbs)} g</span>
          </div>
          <div className="row">
            <span>fat</span>
            <span>{Math.round(totals.fat)} g</span>
          </div>
          <div className="row main">
            <span>total</span>
            <span>{Math.round(totals.calories)} kcal</span>
          </div>
        </div>

        <div className="footer-note">saved on this device only · no account needed</div>
      </div>
    </main>
  );
}
