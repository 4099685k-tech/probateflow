const firstNames = ["James", "Maria", "Robert", "Linda", "Carlos", "Susan", "David", "Patricia", "Michael", "Barbara", "Kevin", "Nancy", "Brian", "Lisa", "Daniel"];
const lastNames = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "White"];
const streets = ["Oak Ave", "Maple Dr", "Cedar Ln", "Palm St", "Harbor Blvd", "Sunset Ridge", "Citrus Way", "Maplewood Ct", "Lemon St", "Pacific View", "Elm St", "Rose Ave", "Valley Rd", "Hill Dr", "Lake Blvd"];
const cities = ["Anaheim", "Irvine", "Costa Mesa", "Fullerton", "Tustin", "Santa Ana", "Newport Beach", "Garden Grove", "Orange", "Huntington Beach"];
const attorneys = ["David Klein Esq.", "Maria Santos Esq.", "Chris Walton Esq.", "James Bloom Esq.", "Diana Holt Esq.", "Paul Reyes Esq.", "N/A"];
const assignees = ["J. Torres", "S. Park", "M. Rivera"];

export const LEAD_TYPES = ["Probate", "Pre-Foreclosure", "On-Market", "Off-Market"];

export const LEAD_TYPE_COLORS = {
  Probate: "bg-purple-50 text-purple-700 border border-purple-200",
  "Pre-Foreclosure": "bg-red-50 text-red-700 border border-red-200",
  "On-Market": "bg-blue-50 text-blue-700 border border-blue-200",
  "Off-Market": "bg-orange-50 text-orange-700 border border-orange-200",
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddress() {
  return `${randomInt(100, 9999)} ${randomItem(streets)}, ${randomItem(cities)}, CA ${randomInt(92600, 92899)}`;
}

function generateFollowUp() {
  const days = randomInt(1, 14);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function generateLead(leadType = null, idOffset = Date.now()) {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const type = leadType || randomItem(LEAD_TYPES);
  const value = randomInt(280, 2200) * 1000;

  return {
    id: `gen-${idOffset}-${randomInt(1000, 9999)}`,
    name: `${lastName} Estate`,
    contact: `${firstName} ${lastName}`,
    phone: `(${randomInt(600, 999)}) 555-${randomInt(1000, 9999)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    address: generateAddress(),
    county: "Orange",
    value,
    status: "New",
    leadType: type,
    followup: generateFollowUp(),
    assigned: randomItem(assignees),
    bedrooms: randomInt(2, 6),
    sqft: randomInt(900, 4500),
    year: randomInt(1950, 2010),
    caseNo: `PR-2026-${randomInt(1000, 9999)}`,
    filedDate: new Date(Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    attorney: randomItem(attorneys),
    heirs: randomInt(1, 4),
    notes: "",
    log: [],
    importedAt: new Date().toISOString(),
  };
}

export function generateBatch(count = 5, leadType = null) {
  return Array.from({ length: count }, (_, i) =>
    generateLead(leadType, Date.now() + i)
  );
}