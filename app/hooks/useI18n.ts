import { useState, useEffect } from 'react';

// Import JSON files as modules
const en = {
  "app": {
    "title": "Admin Price Sort Edit",
    "subtitle": "products loaded",
    "by": "by Trendy Designs LLC",
    "version": "Admin Price Sort Edit v2.0 | Built with ❤️ for Shopify Merchants"
  },
  "filters": {
    "title": "Filters & Search",
    "hideFilters": "Hide Filters",
    "showFilters": "Show Filters",
    "searchPlaceholder": "Search by name or vendor...",
    "minPrice": "Min price",
    "maxPrice": "Max price",
    "itemsPerPage": "Items per page",
    "clearFilters": "Clear Filters"
  },
  "sorting": {
    "lowToHigh": "Price: Low to High",
    "highToLow": "Price: High to Low"
  },
  "product": {
    "variant": "variant",
    "variants": "variants",
    "showVariants": "Show variants",
    "hideVariants": "Hide variants",
    "active": "Active",
    "inactive": "Inactive",
    "edit": "Edit",
    "was": "Was"
  },
  "pagination": {
    "showing": "Showing",
    "of": "of",
    "filtered": "filtered products",
    "for": "for",
    "totalDataset": "Total dataset:",
    "page": "Page",
    "prev": "« Prev",
    "next": "Next »",
    "searching": "⏳ Searching..."
  },
  "messages": {
    "noProducts": "No products found",
    "adjustCriteria": "Try adjusting your search or filter criteria",
    "priceUpdated": "Price updated to",
    "productActivated": "Product activated successfully!",
    "productDeactivated": "Product deactivated successfully!",
    "priceUpdateSuccess": "Price updated successfully on Shopify!",
    "statusUpdateSuccess": "Product status updated successfully on Shopify!",
    "updateFailed": "Update failed",
    "errorUpdatingPrice": "Error updating price. Please try again.",
    "errorUpdatingStatus": "Error updating product status. Please try again.",
    "productVariantNotFound": "Error: Product variant not found",
    "clickToEdit": "Click to edit price",
    "clickToEditVariant": "Click to edit variant price",
    "clickToActivate": "Click to activate product",
    "clickToDeactivate": "Click to deactivate product"
  },
  "footer": {
    "poweredBy": "Powered by",
    "company": "Trendy Designs LLC - Professional Shopify App Solutions"
  }
};

const de = {
  "app": {
    "title": "Admin Preis Sortier Editor",
    "subtitle": "Produkte geladen",
    "by": "von Trendy Designs LLC",
    "version": "Admin Preis Sortier Editor v2.0 | Mit ❤️ für Shopify Händler erstellt"
  },
  "filters": {
    "title": "Filter & Suche",
    "hideFilters": "Filter ausblenden",
    "showFilters": "Filter anzeigen",
    "searchPlaceholder": "Nach Name oder Anbieter suchen...",
    "minPrice": "Mindestpreis",
    "maxPrice": "Höchstpreis",
    "itemsPerPage": "Artikel pro Seite",
    "clearFilters": "Filter löschen"
  },
  "sorting": {
    "lowToHigh": "Preis: Niedrig bis Hoch",
    "highToLow": "Preis: Hoch bis Niedrig"
  },
  "product": {
    "variant": "Variante",
    "variants": "Varianten",
    "showVariants": "Varianten anzeigen",
    "hideVariants": "Varianten ausblenden",
    "active": "Aktiv",
    "inactive": "Inaktiv",
    "edit": "Bearbeiten",
    "was": "War"
  },
  "pagination": {
    "showing": "Zeige",
    "of": "von",
    "filtered": "gefilterte Produkte",
    "for": "für",
    "totalDataset": "Gesamtdatensatz:",
    "page": "Seite",
    "prev": "« Zurück",
    "next": "Weiter »",
    "searching": "⏳ Suche..."
  },
  "messages": {
    "noProducts": "Keine Produkte gefunden",
    "adjustCriteria": "Versuchen Sie, Ihre Such- oder Filterkriterien anzupassen",
    "priceUpdated": "Preis aktualisiert auf",
    "productActivated": "Produkt erfolgreich aktiviert!",
    "productDeactivated": "Produkt erfolgreich deaktiviert!",
    "priceUpdateSuccess": "Preis erfolgreich auf Shopify aktualisiert!",
    "statusUpdateSuccess": "Produktstatus erfolgreich auf Shopify aktualisiert!",
    "updateFailed": "Aktualisierung fehlgeschlagen",
    "errorUpdatingPrice": "Fehler beim Aktualisieren des Preises. Bitte versuchen Sie es erneut.",
    "errorUpdatingStatus": "Fehler beim Aktualisieren des Produktstatus. Bitte versuchen Sie es erneut.",
    "productVariantNotFound": "Fehler: Produktvariante nicht gefunden",
    "clickToEdit": "Klicken Sie, um den Preis zu bearbeiten",
    "clickToEditVariant": "Klicken Sie, um den Variantenpreis zu bearbeiten",
    "clickToActivate": "Klicken Sie, um das Produkt zu aktivieren",
    "clickToDeactivate": "Klicken Sie, um das Produkt zu deaktivieren"
  },
  "footer": {
    "poweredBy": "Powered by",
    "company": "Trendy Designs LLC - Professionelle Shopify App Lösungen"
  }
};

// Other languages truncated for brevity - they would follow the same pattern

const translations = {
  en,
  de,
  fr,
  it,
  es
};

type TranslationKey = string;
type SupportedLanguage = keyof typeof translations;

export function useI18n() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  
  // Detect browser language on first load
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (translations[browserLang]) {
      setLanguage(browserLang);
    }
  }, []);

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if even English fallback fails
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const getLanguageOptions = () => [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'it', label: 'Italiano' },
    { value: 'es', label: 'Español' }
  ];

  return {
    t,
    language,
    setLanguage,
    getLanguageOptions
  };
}