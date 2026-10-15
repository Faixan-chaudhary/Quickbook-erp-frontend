/**
 * Country and Currency Data Helper
 * Written in simple, easy-to-understand TypeScript for junior developers.
 */

export interface CountryData {
  code: string;           // 2-letter ISO code (e.g. "US", "PK", "GB")
  name: string;           // Country full name (e.g. "United States")
  dialCode: string;       // International calling code (e.g. "+1", "+92")
  currency: string;       // 3-letter currency code (e.g. "USD", "PKR")
  currencyName: string;   // Currency name (e.g. "US Dollar", "Pakistani Rupee")
  currencySymbol: string; // Currency symbol (e.g. "$", "Rs", "£")
  flag: string;           // Emoji flag
}

export interface CurrencyData {
  code: string;
  label: string;
  name: string;
  symbol: string;
}

/**
 * Standard list of countries with dial codes and primary currencies
 */
export const COUNTRIES_DATA: CountryData[] = [
  { code: "US", name: "United States (US)", dialCode: "+1", currency: "USD", currencyName: "US Dollar", currencySymbol: "$", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom (UK)", dialCode: "+44", currency: "GBP", currencyName: "British Pound", currencySymbol: "£", flag: "🇬🇧" },
  { code: "PK", name: "Pakistan (PK)", dialCode: "+92", currency: "PKR", currencyName: "Pakistani Rupee", currencySymbol: "Rs", flag: "🇵🇰" },
  { code: "AE", name: "United Arab Emirates (UAE)", dialCode: "+971", currency: "AED", currencyName: "UAE Dirham", currencySymbol: "د.إ", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia (KSA)", dialCode: "+966", currency: "SAR", currencyName: "Saudi Riyal", currencySymbol: "﷼", flag: "🇸🇦" },
  { code: "IN", name: "India (IN)", dialCode: "+91", currency: "INR", currencyName: "Indian Rupee", currencySymbol: "₹", flag: "🇮🇳" },
  { code: "CA", name: "Canada (CA)", dialCode: "+1", currency: "CAD", currencyName: "Canadian Dollar", currencySymbol: "$", flag: "🇨🇦" },
  { code: "AU", name: "Australia (AU)", dialCode: "+61", currency: "AUD", currencyName: "Australian Dollar", currencySymbol: "$", flag: "🇦🇺" },
  { code: "DE", name: "Germany (DE)", dialCode: "+49", currency: "EUR", currencyName: "Euro", currencySymbol: "€", flag: "🇩🇪" },
  { code: "FR", name: "France (FR)", dialCode: "+33", currency: "EUR", currencyName: "Euro", currencySymbol: "€", flag: "🇫🇷" },
  { code: "SG", name: "Singapore (SG)", dialCode: "+65", currency: "SGD", currencyName: "Singapore Dollar", currencySymbol: "S$", flag: "🇸🇬" },
  { code: "QA", name: "Qatar (QA)", dialCode: "+974", currency: "QAR", currencyName: "Qatari Riyal", currencySymbol: "QR", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait (KW)", dialCode: "+965", currency: "KWD", currencyName: "Kuwaiti Dinar", currencySymbol: "KD", flag: "🇰🇼" },
  { code: "OM", name: "Oman (OM)", dialCode: "+968", currency: "OMR", currencyName: "Omani Rial", currencySymbol: "RO", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain (BH)", dialCode: "+973", currency: "BHD", currencyName: "Bahraini Dinar", currencySymbol: "BD", flag: "🇧🇭" },
  { code: "MY", name: "Malaysia (MY)", dialCode: "+60", currency: "MYR", currencyName: "Malaysian Ringgit", currencySymbol: "RM", flag: "🇲🇾" },
  { code: "ID", name: "Indonesia (ID)", dialCode: "+62", currency: "IDR", currencyName: "Indonesian Rupiah", currencySymbol: "Rp", flag: "🇮🇩" },
  { code: "BD", name: "Bangladesh (BD)", dialCode: "+880", currency: "BDT", currencyName: "Bangladeshi Taka", currencySymbol: "৳", flag: "🇧🇩" },
  { code: "TR", name: "Turkey (TR)", dialCode: "+90", currency: "TRY", currencyName: "Turkish Lira", currencySymbol: "₺", flag: "🇹🇷" },
  { code: "EG", name: "Egypt (EG)", dialCode: "+20", currency: "EGP", currencyName: "Egyptian Pound", currencySymbol: "E£", flag: "🇪🇬" },
  { code: "ZA", name: "South Africa (ZA)", dialCode: "+27", currency: "ZAR", currencyName: "South African Rand", currencySymbol: "R", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria (NG)", dialCode: "+234", currency: "NGN", currencyName: "Nigerian Naira", currencySymbol: "₦", flag: "🇳🇬" },
  { code: "KE", name: "Kenya (KE)", dialCode: "+254", currency: "KES", currencyName: "Kenyan Shilling", currencySymbol: "KSh", flag: "🇰🇪" },
  { code: "CN", name: "China (CN)", dialCode: "+86", currency: "CNY", currencyName: "Chinese Yuan", currencySymbol: "¥", flag: "🇨🇳" },
  { code: "JP", name: "Japan (JP)", dialCode: "+81", currency: "JPY", currencyName: "Japanese Yen", currencySymbol: "¥", flag: "🇯🇵" },
  { code: "BR", name: "Brazil (BR)", dialCode: "+55", currency: "BRL", currencyName: "Brazilian Real", currencySymbol: "R$", flag: "🇧🇷" },
  { code: "IT", name: "Italy (IT)", dialCode: "+39", currency: "EUR", currencyName: "Euro", currencySymbol: "€", flag: "🇮🇹" },
  { code: "ES", name: "Spain (ES)", dialCode: "+34", currency: "EUR", currencyName: "Euro", currencySymbol: "€", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands (NL)", dialCode: "+31", currency: "EUR", currencyName: "Euro", currencySymbol: "€", flag: "🇳🇱" },
  { code: "CH", name: "Switzerland (CH)", dialCode: "+41", currency: "CHF", currencyName: "Swiss Franc", currencySymbol: "CHF", flag: "🇨🇭" },
  { code: "NZ", name: "New Zealand (NZ)", dialCode: "+64", currency: "NZD", currencyName: "New Zealand Dollar", currencySymbol: "$", flag: "🇳🇿" },
  { code: "PH", name: "Philippines (PH)", dialCode: "+63", currency: "PHP", currencyName: "Philippine Peso", currencySymbol: "₱", flag: "🇵🇭" },
  { code: "LK", name: "Sri Lanka (LK)", dialCode: "+94", currency: "LKR", currencyName: "Sri Lankan Rupee", currencySymbol: "Rs", flag: "🇱🇰" },
  { code: "IE", name: "Ireland (IE)", dialCode: "+353", currency: "EUR", currencyName: "Euro", currencySymbol: "€", flag: "🇮🇪" },
  { code: "MX", name: "Mexico (MX)", dialCode: "+52", currency: "MXN", currencyName: "Mexican Peso", currencySymbol: "$", flag: "🇲🇽" },
];

/**
 * Unique list of Currencies for dropdown selection
 */
export const CURRENCIES_LIST: CurrencyData[] = [
  { code: "USD", label: "USD ($)", name: "US Dollar", symbol: "$" },
  { code: "EUR", label: "EUR (€)", name: "Euro", symbol: "€" },
  { code: "GBP", label: "GBP (£)", name: "British Pound", symbol: "£" },
  { code: "PKR", label: "PKR (Rs)", name: "Pakistani Rupee", symbol: "Rs" },
  { code: "AED", label: "AED (د.إ)", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", label: "SAR (﷼)", name: "Saudi Riyal", symbol: "﷼" },
  { code: "INR", label: "INR (₹)", name: "Indian Rupee", symbol: "₹" },
  { code: "CAD", label: "CAD ($)", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", label: "AUD ($)", name: "Australian Dollar", symbol: "$" },
  { code: "SGD", label: "SGD (S$)", name: "Singapore Dollar", symbol: "S$" },
  { code: "QAR", label: "QAR (QR)", name: "Qatari Riyal", symbol: "QR" },
  { code: "KWD", label: "KWD (KD)", name: "Kuwaiti Dinar", symbol: "KD" },
  { code: "OMR", label: "OMR (RO)", name: "Omani Rial", symbol: "RO" },
  { code: "BHD", label: "BHD (BD)", name: "Bahraini Dinar", symbol: "BD" },
  { code: "MYR", label: "MYR (RM)", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", label: "IDR (Rp)", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "BDT", label: "BDT (৳)", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "TRY", label: "TRY (₺)", name: "Turkish Lira", symbol: "₺" },
  { code: "EGP", label: "EGP (E£)", name: "Egyptian Pound", symbol: "E£" },
  { code: "ZAR", label: "ZAR (R)", name: "South African Rand", symbol: "R" },
  { code: "NGN", label: "NGN (₦)", name: "Nigerian Naira", symbol: "₦" },
  { code: "KES", label: "KES (KSh)", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "CNY", label: "CNY (¥)", name: "Chinese Yuan", symbol: "¥" },
  { code: "JPY", label: "JPY (¥)", name: "Japanese Yen", symbol: "¥" },
  { code: "BRL", label: "BRL (R$)", name: "Brazilian Real", symbol: "R$" },
  { code: "CHF", label: "CHF (CHF)", name: "Swiss Franc", symbol: "CHF" },
  { code: "NZD", label: "NZD ($)", name: "New Zealand Dollar", symbol: "$" },
  { code: "PHP", label: "PHP (₱)", name: "Philippine Peso", symbol: "₱" },
  { code: "LKR", label: "LKR (Rs)", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "MXN", label: "MXN ($)", name: "Mexican Peso", symbol: "$" },
];

/**
 * Find country by phone number dial code.
 * Example: "+92 300 1234567" -> matches Pakistan (PK)
 * Matches longest dial code first (e.g. +971 before +9)
 */
export function findCountryByPhoneNumber(phone: string): CountryData | undefined {
  if (!phone) return undefined;

  // Clean phone number (keep only digits and '+')
  const cleanPhone = phone.trim().replace(/[^\d+]/g, "");
  if (!cleanPhone.startsWith("+")) return undefined;

  // Sort countries by dial code length descending (longest dial code first)
  const sorted = [...COUNTRIES_DATA].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  for (const country of sorted) {
    if (cleanPhone.startsWith(country.dialCode)) {
      return country;
    }
  }

  return undefined;
}

/**
 * Find country by its 2-letter ISO code (e.g. "US", "PK")
 */
export function findCountryByCode(code: string): CountryData | undefined {
  return COUNTRIES_DATA.find((c) => c.code.toUpperCase() === code.toUpperCase());
}

/**
 * Format phone number when country changes.
 * If user had an old dial code, it replaces it with the new country dial code.
 */
export function updatePhoneForCountry(currentPhone: string, newCountryCode: string): string {
  const targetCountry = findCountryByCode(newCountryCode);
  if (!targetCountry) return currentPhone;

  const newDialCode = targetCountry.dialCode;

  // If current phone is empty, set default dial code
  if (!currentPhone || !currentPhone.trim()) {
    return `${newDialCode} `;
  }

  // Detect existing country dial code if present
  const existingCountry = findCountryByPhoneNumber(currentPhone);
  if (existingCountry) {
    // Replace old dial code with new dial code
    const restOfNumber = currentPhone
      .replace(existingCountry.dialCode, "")
      .trim();
    return `${newDialCode} ${restOfNumber}`.trim();
  }

  // If starts with +, replace the prefix
  if (currentPhone.startsWith("+")) {
    const parts = currentPhone.split(" ");
    if (parts.length > 1) {
      parts[0] = newDialCode;
      return parts.join(" ");
    }
    return `${newDialCode} `;
  }

  // Otherwise prepend new dial code
  return `${newDialCode} ${currentPhone.trim()}`;
}

/**
 * Optional Open Source API fetch from REST Countries (https://restcountries.com)
 * Fetches dynamic data and hydrates country info safely.
 */
export async function fetchOpenSourceCountries(): Promise<CountryData[]> {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,idd,currencies,flags",
      { cache: "force-cache" }
    );
    if (!response.ok) return COUNTRIES_DATA;
    const data = await response.json();

    if (!Array.isArray(data)) return COUNTRIES_DATA;

    const parsed: CountryData[] = data
      .map((item: any) => {
        const root = item.idd?.root || "";
        const suffix = item.idd?.suffixes?.[0] || "";
        const dialCode = root ? `${root}${suffix}` : "";
        const currencyKey = item.currencies ? Object.keys(item.currencies)[0] : "USD";
        const currencyObj = item.currencies?.[currencyKey] || {};

        return {
          code: item.cca2 || "",
          name: `${item.name?.common || ""} (${item.cca2 || ""})`,
          dialCode: dialCode,
          currency: currencyKey || "USD",
          currencyName: currencyObj.name || "US Dollar",
          currencySymbol: currencyObj.symbol || "$",
          flag: item.flags?.emoji || "",
        };
      })
      .filter((c: CountryData) => c.code && c.dialCode && c.dialCode.startsWith("+"));

    return parsed.length > 0 ? parsed : COUNTRIES_DATA;
  } catch {
    // Graceful fallback to offline local list
    return COUNTRIES_DATA;
  }
}
