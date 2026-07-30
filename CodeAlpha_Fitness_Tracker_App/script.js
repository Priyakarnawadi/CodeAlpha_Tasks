// ==========================================================================
// FitPulse Pro - Complete JavaScript Logic (script.js)
// ==========================================================================

// --------------------------------------------------------------------------
// 1. Initial State & Data Structures
// --------------------------------------------------------------------------

/**
 * Default State structure used for fresh loads or full resets
 */
const defaultState = {
  theme: "light",
  steps: 0,
  stepsGoal: 10000,
  calories: 0,
  caloriesGoal: 2000,
  water: 0, // In liters
  waterGoal: 2.5, // In liters
  height: null, // In cm
  weight: null, // In kg
  bmi: null,
  workouts: [], // Holds objects: { id, type, duration, calories, date, time, dayIndex }
  weeklyStats: [0, 0, 0, 0, 0, 0, 0] // Sunday = 0, Monday = 1, ... Saturday = 6
};

// Storage Key for LocalStorage
const STORAGE_KEY = "fitpulse_pro_data";

// Load existing state from LocalStorage or initialize with defaults
let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState;

// Motivational Quotes Array
const dailyQuotes = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Well done is better than well said.", author: "Benjamin Franklin" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

// --------------------------------------------------------------------------
// 2. Application Initialization
// --------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  displayCurrentDate();
  loadDailyQuote();
  setupEventListeners();
  renderDashboard();
});

/**
 * Attaches initial event listeners safely
 */
function setupEventListeners() {
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      initTheme();
      saveState();
    });
  }

  const workoutForm = document.getElementById("workout-form");
  if (workoutForm) {
    workoutForm.addEventListener("submit", handleAddWorkout);
  }
}

// --------------------------------------------------------------------------
// 3. Storage & State Management
// --------------------------------------------------------------------------

/**
 * Saves current app state to Local Storage and re-renders the UI
 */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderDashboard();
}

// --------------------------------------------------------------------------
// 4. UI Rendering Functions
// --------------------------------------------------------------------------

/**
 * Main dashboard render coordinator
 */
function renderDashboard() {
  // Update Numeric Readings
  const stepsElem = document.getElementById("steps-val");
  const caloriesElem = document.getElementById("calories-val");
  const waterElem = document.getElementById("water-val");
  const weightElem = document.getElementById("weight-val");
  const stepGoalInput = document.getElementById("step-goal-input");

  if (stepsElem) stepsElem.textContent = state.steps.toLocaleString();
  if (caloriesElem) caloriesElem.textContent = state.calories.toLocaleString();
  if (waterElem) waterElem.textContent = state.water.toFixed(2);
  if (weightElem) weightElem.textContent = state.weight ? state.weight : "--";
  if (stepGoalInput) stepGoalInput.value = state.stepsGoal;

  // Calculate Percentages
  const stepsPct = Math.min((state.steps / state.stepsGoal) * 100, 100);
  const caloriesPct = Math.min((state.calories / state.caloriesGoal) * 100, 100);
  const waterPct = Math.min((state.water / state.waterGoal) * 100, 100);

  // Update Badge Percentages Text
  const stepsBadge = document.getElementById("steps-percent");
  const caloriesBadge = document.getElementById("calories-percent");
  const waterBadge = document.getElementById("water-percent");

  if (stepsBadge) stepsBadge.textContent = `${Math.round(stepsPct)}%`;
  if (caloriesBadge) caloriesBadge.textContent = `${Math.round(caloriesPct)}%`;
  if (waterBadge) waterBadge.textContent = `${Math.round(waterPct)}%`;

  // Update Progress Rings
  updateRing("steps-ring", stepsPct);
  updateRing("calories-ring", caloriesPct);
  updateRing("water-ring", waterPct);

  // Render Sub-components
  calculateAndRenderBMI();
  renderWorkoutList();
  renderWeeklyChart();
}

/**
 * Updates SVG Stroke Dashoffset for circular progress rings
 * @param {string} elementId - ID of the SVG circle
 * @param {number} percentage - Percentage value (0-100)
 */
function updateRing(elementId, percentage) {
  const ring = document.getElementById(elementId);
  if (!ring) return;

  const radius = ring.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  ring.style.strokeDashoffset = offset;
}

/**
 * Calculates BMI and updates corresponding text/badges
 */
function calculateAndRenderBMI() {
  const bmiValElem = document.getElementById("bmi-val");
  const badgeElem = document.getElementById("bmi-status-badge");

  if (state.height && state.weight) {
    const heightInMeters = state.height / 100;
    const bmiVal = (state.weight / (heightInMeters * heightInMeters)).toFixed(1);
    state.bmi = bmiVal;

    if (bmiValElem) bmiValElem.textContent = bmiVal;

    if (badgeElem) {
      if (bmiVal < 18.5) {
        badgeElem.textContent = "Underweight";
      } else if (bmiVal < 25) {
        badgeElem.textContent = "Normal";
      } else if (bmiVal < 30) {
        badgeElem.textContent = "Overweight";
      } else {
        badgeElem.textContent = "Obese";
      }
    }
  } else {
    if (bmiValElem) bmiValElem.textContent = "--";
    if (badgeElem) badgeElem.textContent = "--";
  }
}

/**
 * Renders the workout history list with date, time, and deletion controls
 */
function renderWorkoutList() {
  const listElement = document.getElementById("workout-list");
  if (!listElement) return;

  listElement.innerHTML = "";

  if (state.workouts.length === 0) {
    listElement.innerHTML = `<li style="color: var(--text-muted, #64748b); font-size: 0.85rem; text-align: center; padding: 12px;">No workouts logged yet.</li>`;
    return;
  }

  // Render in reverse chronological order
  [...state.workouts].reverse().forEach((item) => {
    const li = document.createElement("li");
    li.className = "workout-item";
    li.innerHTML = `
      <div class="workout-info">
        <h4>${item.type}</h4>
        <p>${item.duration} mins • ${item.calories} kcal</p>
        <small style="font-size: 0.75rem; color: var(--text-muted, #64748b);">${item.date} at ${item.time}</small>
      </div>
      <button class="btn-danger-link" onclick="deleteWorkout(${item.id})">Delete</button>
    `;
    listElement.appendChild(li);
  });
}

/**
 * Renders the weekly bar chart (Monday to Sunday)
 */
function renderWeeklyChart() {
  const container = document.getElementById("weekly-bars-container");
  if (!container) return;

  // Monday to Sunday order
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Map standard JS day indices (Sun=0, Mon=1...) to array order [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  const dayIndexMap = [6, 0, 1, 2, 3, 4, 5];

  container.innerHTML = "";
  let totalWeeklyCount = 0;

  days.forEach((day, i) => {
    // Map array order back to JS standard index
    const jsDayIndex = (i + 1) % 7;
    const count = state.weeklyStats[jsDayIndex] || 0;
    totalWeeklyCount += count;

    // Relative height percentage (capped at 5 daily workouts for 100% height)
    const heightPct = Math.min((count / 5) * 100, 100);

    const dayCol = document.createElement("div");
    dayCol.className = "day-column";
    dayCol.innerHTML = `
      <div class="bar-track">
        <div class="bar-fill" style="height: ${heightPct}%;" title="${count} workouts"></div>
      </div>
      <span class="day-label">${day}</span>
    `;
    container.appendChild(dayCol);
  });

  const weeklyCountElem = document.getElementById("weekly-count");
  if (weeklyCountElem) weeklyCountElem.textContent = totalWeeklyCount;
}

// --------------------------------------------------------------------------
// 5. User Interaction & Event Handlers
// --------------------------------------------------------------------------

/**
 * Adds 1,000 steps quickly
 */
function quickAddSteps() {
  state.steps += 1000;
  saveState();
}

/**
 * Updates step goal target
 */
function updateStepGoal() {
  const inputElem = document.getElementById("step-goal-input");
  if (!inputElem) return;

  const inputVal = parseInt(inputElem.value, 10);
  if (inputVal > 0) {
    state.stepsGoal = inputVal;
    saveState();
  }
}

/**
 * Increases water intake by specified amount in liters
 * @param {number} amount - Amount to add in liters
 */
function addWater(amount) {
  state.water += amount;
  saveState();
}

/**
 * Updates height and weight metrics and re-calculates BMI
 * @param {Event} e - Form submission event
 */
function updateMetrics(e) {
  if (e) e.preventDefault();
  const hInput = document.getElementById("height-input");
  const wInput = document.getElementById("weight-input");

  if (!hInput || !wInput) return;

  const h = parseFloat(hInput.value);
  const w = parseFloat(wInput.value);

  if (h > 0 && w > 0) {
    state.height = h;
    state.weight = w;
    saveState();
  }
}

/**
 * Handles workout form submission
 * @param {Event} e - Form submission event
 */
function handleAddWorkout(e) {
  e.preventDefault();

  const typeElem = document.getElementById("workout-type");
  const durationElem = document.getElementById("workout-duration");
  const caloriesElem = document.getElementById("workout-calories");

  if (!typeElem || !durationElem || !caloriesElem) return;

  const type = typeElem.value;
  const duration = parseInt(durationElem.value, 10);
  const calories = parseInt(caloriesElem.value, 10);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const currentDayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const newWorkout = {
    id: Date.now(),
    type,
    duration,
    calories,
    date: dateStr,
    time: timeStr,
    dayIndex: currentDayIndex
  };

  // Push to workouts array
  state.workouts.push(newWorkout);

  // Update total calories
  state.calories += calories;

  // Increase weekly chart counter for current day
  state.weeklyStats[currentDayIndex] = (state.weeklyStats[currentDayIndex] || 0) + 1;

  // Reset Form
  document.getElementById("workout-form").reset();

  // Save State and Notify
  saveState();
  showToast("✅ Workout Added Successfully!");
}

/**
 * Deletes a workout by ID
 * @param {number} id - Unique ID of the workout entry
 */
function deleteWorkout(id) {
  const index = state.workouts.findIndex((w) => w.id === id);
  if (index !== -1) {
    const removed = state.workouts.splice(index, 1)[0];

    // Deduct calories burned
    state.calories = Math.max(0, state.calories - removed.calories);

    // Decrement weekly chart counter
    if (state.weeklyStats[removed.dayIndex] > 0) {
      state.weeklyStats[removed.dayIndex] -= 1;
    }

    saveState();
  }
}

/**
 * Resets today's tracked metrics and workouts
 */
function resetDayData() {
  if (confirm("Are you sure you want to reset today's data?")) {
    state.steps = 0;
    state.calories = 0;
    state.water = 0;
    state.workouts = [];
    state.weeklyStats = [0, 0, 0, 0, 0, 0, 0];
    saveState();
  }
}

// --------------------------------------------------------------------------
// 6. Utility Functions & Extras
// --------------------------------------------------------------------------

/**
 * Initializes Theme based on state
 */
function initTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const themeIcon = document.querySelector(".theme-icon");
  if (themeIcon) {
    themeIcon.textContent = state.theme === "dark" ? "☀️" : "🌙";
  }
}

/**
 * Displays current formatted date in header
 */
function displayCurrentDate() {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    const options = { weekday: "long", month: "short", day: "numeric", year: "numeric" };
    dateElement.textContent = new Date().toLocaleDateString("en-US", options);
  }
}

/**
 * Loads daily motivational quote based on day of year
 */
function loadDailyQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");

  if (quoteText && quoteAuthor) {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const selectedQuote = dailyQuotes[dayOfYear % dailyQuotes.length];
    quoteText.textContent = `"${selectedQuote.quote}"`;
    quoteAuthor.textContent = `— ${selectedQuote.author}`;
  }
}

/**
 * Shows temporary toast notification
 * @param {string} message - Message text to display
 */
function showToast(message) {
  let toast = document.getElementById("toast-notification");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #10b981;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 3000);
}