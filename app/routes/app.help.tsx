import { useState, useEffect } from "react";
import type { HeadersFunction } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

// Multi-language help content
const helpContent = {
  en: {
    title: "How to Use Admin Price Sort Edit",
    subtitle: "Complete guide to manage your product prices and status efficiently",
    sections: [
      {
        title: "🔍 Search and Filter Products",
        content: [
          "Use the search bar to find products by name or vendor",
          "Set minimum and maximum price filters to narrow results",
          "Choose how many products to display per page (10-1000)",
          "Use 'Clear Filters' to reset all search criteria"
        ]
      },
      {
        title: "📊 Sort Products by Price", 
        content: [
          "Click 'Price: Low to High' to sort products from cheapest to most expensive",
          "Click 'Price: High to Low' to sort products from most expensive to cheapest",
          "Sorting is applied instantly to your filtered results"
        ]
      },
      {
        title: "💰 Edit Product Prices",
        content: [
          "Click on any price to edit it directly",
          "Enter new price and press Enter to save, or Esc to cancel",
          "For products with multiple variants, click 'Show variants' first",
          "Each variant can have its own price - click on individual variant prices to edit",
          "Changes are saved immediately to your Shopify store"
        ]
      },
      {
        title: "🔄 Manage Product Status",
        content: [
          "Use the toggle switch to activate/deactivate products",
          "Green toggle = Active product (visible in store)",
          "Gray toggle = Inactive product (hidden from store)",
          "Status changes are applied immediately to your Shopify store"
        ]
      },
      {
        title: "📋 Work with Variants",
        content: [
          "Products with multiple variants show 'Show variants' button",
          "Click to expand and see all variants with their individual prices",
          "Edit each variant price separately by clicking on it",
          "Use 'Hide variants' to collapse the list"
        ]
      },
      {
        title: "🌍 Change Language",
        content: [
          "Use the language selector in the top-right corner",
          "Available languages: English, Deutsch, Français, Italiano, Español",
          "The interface will update immediately to your selected language"
        ]
      }
    ],
    tips: {
      title: "💡 Pro Tips",
      items: [
        "Use price filters to focus on specific price ranges you want to update",
        "Sort by price to quickly identify products that need price adjustments", 
        "The search function works with product names, vendors, and product types",
        "Changes are saved automatically - no need to click a save button",
        "You can edit multiple products in sequence without page reloads"
      ]
    },
    support: {
      title: "🛟 Need Help?",
      content: "If you need assistance or have questions about using this app, please contact us at info@webtorn.com"
    }
  },
  de: {
    title: "Anleitung für Admin Preis Sortier Editor",
    subtitle: "Vollständige Anleitung zur effizienten Verwaltung Ihrer Produktpreise und Status",
    sections: [
      {
        title: "🔍 Produkte suchen und filtern",
        content: [
          "Verwenden Sie die Suchleiste, um Produkte nach Name oder Anbieter zu finden",
          "Setzen Sie Mindest- und Höchstpreisfilter, um Ergebnisse einzugrenzen", 
          "Wählen Sie, wie viele Produkte pro Seite angezeigt werden sollen (10-1000)",
          "Verwenden Sie 'Filter löschen', um alle Suchkriterien zurückzusetzen"
        ]
      },
      {
        title: "📊 Produkte nach Preis sortieren",
        content: [
          "Klicken Sie auf 'Preis: Niedrig bis Hoch', um Produkte vom günstigsten zum teuersten zu sortieren",
          "Klicken Sie auf 'Preis: Hoch bis Niedrig', um Produkte vom teuersten zum günstigsten zu sortieren", 
          "Die Sortierung wird sofort auf Ihre gefilterten Ergebnisse angewendet"
        ]
      },
      {
        title: "💰 Produktpreise bearbeiten",
        content: [
          "Klicken Sie auf einen beliebigen Preis, um ihn direkt zu bearbeiten",
          "Geben Sie den neuen Preis ein und drücken Sie Enter zum Speichern oder Esc zum Abbrechen",
          "Bei Produkten mit mehreren Varianten klicken Sie zuerst auf 'Varianten anzeigen'",
          "Jede Variante kann ihren eigenen Preis haben - klicken Sie auf einzelne Variantenpreise zum Bearbeiten",
          "Änderungen werden sofort in Ihrem Shopify-Shop gespeichert"
        ]
      },
      {
        title: "🔄 Produktstatus verwalten", 
        content: [
          "Verwenden Sie den Umschalter, um Produkte zu aktivieren/deaktivieren",
          "Grüner Umschalter = Aktives Produkt (im Shop sichtbar)",
          "Grauer Umschalter = Inaktives Produkt (im Shop versteckt)",
          "Statusänderungen werden sofort in Ihrem Shopify-Shop angewendet"
        ]
      },
      {
        title: "📋 Mit Varianten arbeiten",
        content: [
          "Produkte mit mehreren Varianten zeigen 'Varianten anzeigen' Button",
          "Klicken Sie zum Erweitern und sehen Sie alle Varianten mit ihren individuellen Preisen",
          "Bearbeiten Sie jeden Variantenpreis separat durch Klicken",
          "Verwenden Sie 'Varianten ausblenden', um die Liste zu minimieren"
        ]
      },
      {
        title: "🌍 Sprache ändern",
        content: [
          "Verwenden Sie den Sprachauswähler in der oberen rechten Ecke",
          "Verfügbare Sprachen: English, Deutsch, Français, Italiano, Español",
          "Die Benutzeroberfläche wird sofort auf Ihre gewählte Sprache aktualisiert"
        ]
      }
    ],
    tips: {
      title: "💡 Profi-Tipps",
      items: [
        "Verwenden Sie Preisfilter, um sich auf bestimmte Preisbereiche zu konzentrieren, die Sie aktualisieren möchten",
        "Sortieren Sie nach Preis, um schnell Produkte zu identifizieren, die Preisanpassungen benötigen",
        "Die Suchfunktion funktioniert mit Produktnamen, Anbietern und Produkttypen",
        "Änderungen werden automatisch gespeichert - kein Speichern-Button nötig",
        "Sie können mehrere Produkte nacheinander bearbeiten ohne Seitenneuladungen"
      ]
    },
    support: {
      title: "🛟 Brauchen Sie Hilfe?",
      content: "Wenn Sie Unterstützung benötigen oder Fragen zur Verwendung dieser App haben, kontaktieren Sie uns unter info@webtorn.com"
    }
  },
  fr: {
    title: "Guide d'utilisation de l'Éditeur de Tri des Prix Admin",
    subtitle: "Guide complet pour gérer efficacement vos prix de produits et statuts",
    sections: [
      {
        title: "🔍 Rechercher et filtrer les produits",
        content: [
          "Utilisez la barre de recherche pour trouver des produits par nom ou fournisseur",
          "Définissez des filtres de prix minimum et maximum pour affiner les résultats",
          "Choisissez combien de produits afficher par page (10-1000)",
          "Utilisez 'Effacer les filtres' pour réinitialiser tous les critères de recherche"
        ]
      },
      {
        title: "📊 Trier les produits par prix",
        content: [
          "Cliquez sur 'Prix : Croissant' pour trier du moins cher au plus cher",
          "Cliquez sur 'Prix : Décroissant' pour trier du plus cher au moins cher",
          "Le tri est appliqué instantanément à vos résultats filtrés"
        ]
      },
      {
        title: "💰 Modifier les prix des produits",
        content: [
          "Cliquez sur n'importe quel prix pour l'éditer directement",
          "Saisissez le nouveau prix et appuyez sur Entrée pour sauvegarder, ou Échap pour annuler",
          "Pour les produits avec plusieurs variantes, cliquez d'abord sur 'Afficher les variantes'",
          "Chaque variante peut avoir son propre prix - cliquez sur les prix des variantes individuelles pour les éditer",
          "Les modifications sont sauvegardées immédiatement dans votre boutique Shopify"
        ]
      },
      {
        title: "🔄 Gérer le statut des produits",
        content: [
          "Utilisez le bouton de basculement pour activer/désactiver les produits",
          "Basculement vert = Produit actif (visible dans la boutique)",
          "Basculement gris = Produit inactif (caché de la boutique)",
          "Les changements de statut sont appliqués immédiatement à votre boutique Shopify"
        ]
      },
      {
        title: "📋 Travailler avec les variantes",
        content: [
          "Les produits avec plusieurs variantes affichent le bouton 'Afficher les variantes'",
          "Cliquez pour développer et voir toutes les variantes avec leurs prix individuels",
          "Éditez chaque prix de variante séparément en cliquant dessus",
          "Utilisez 'Masquer les variantes' pour réduire la liste"
        ]
      },
      {
        title: "🌍 Changer de langue",
        content: [
          "Utilisez le sélecteur de langue dans le coin supérieur droit",
          "Langues disponibles : English, Deutsch, Français, Italiano, Español",
          "L'interface se mettra à jour immédiatement dans la langue sélectionnée"
        ]
      }
    ],
    tips: {
      title: "💡 Conseils de Pro",
      items: [
        "Utilisez les filtres de prix pour vous concentrer sur des gammes de prix spécifiques à mettre à jour",
        "Triez par prix pour identifier rapidement les produits nécessitant des ajustements de prix",
        "La fonction de recherche fonctionne avec les noms de produits, fournisseurs et types de produits",
        "Les modifications sont sauvegardées automatiquement - pas besoin de bouton sauvegarder",
        "Vous pouvez éditer plusieurs produits en séquence sans rechargements de page"
      ]
    },
    support: {
      title: "🛟 Besoin d'aide ?",
      content: "Si vous avez besoin d'assistance ou avez des questions sur l'utilisation de cette app, veuillez nous contacter à info@webtorn.com"
    }
  },
  it: {
    title: "Guida all'uso dell'Editor Ordinamento Prezzi Admin",
    subtitle: "Guida completa per gestire efficacemente i prezzi e lo status dei tuoi prodotti",
    sections: [
      {
        title: "🔍 Cercare e filtrare prodotti",
        content: [
          "Usa la barra di ricerca per trovare prodotti per nome o fornitore",
          "Imposta filtri di prezzo minimo e massimo per restringere i risultati",
          "Scegli quanti prodotti mostrare per pagina (10-1000)",
          "Usa 'Cancella filtri' per reimpostare tutti i criteri di ricerca"
        ]
      },
      {
        title: "📊 Ordinare prodotti per prezzo",
        content: [
          "Clicca 'Prezzo: Dal basso all'alto' per ordinare dal più economico al più caro",
          "Clicca 'Prezzo: Dall'alto al basso' per ordinare dal più caro al più economico",
          "L'ordinamento viene applicato istantaneamente ai risultati filtrati"
        ]
      },
      {
        title: "💰 Modificare prezzi prodotti",
        content: [
          "Clicca su qualsiasi prezzo per modificarlo direttamente",
          "Inserisci il nuovo prezzo e premi Invio per salvare, o Esc per annullare",
          "Per prodotti con più varianti, clicca prima su 'Mostra varianti'",
          "Ogni variante può avere il suo prezzo - clicca sui prezzi delle singole varianti per modificarli",
          "I cambiamenti vengono salvati immediatamente nel tuo negozio Shopify"
        ]
      },
      {
        title: "🔄 Gestire stato prodotti",
        content: [
          "Usa l'interruttore per attivare/disattivare prodotti",
          "Interruttore verde = Prodotto attivo (visibile nel negozio)",
          "Interruttore grigio = Prodotto inattivo (nascosto dal negozio)",
          "I cambiamenti di stato vengono applicati immediatamente al tuo negozio Shopify"
        ]
      },
      {
        title: "📋 Lavorare con le varianti",
        content: [
          "I prodotti con più varianti mostrano il pulsante 'Mostra varianti'",
          "Clicca per espandere e vedere tutte le varianti con i loro prezzi individuali",
          "Modifica ogni prezzo di variante separatamente cliccandoci sopra",
          "Usa 'Nascondi varianti' per comprimere la lista"
        ]
      },
      {
        title: "🌍 Cambiare lingua",
        content: [
          "Usa il selettore lingua nell'angolo in alto a destra",
          "Lingue disponibili: English, Deutsch, Français, Italiano, Español",
          "L'interfaccia si aggiornerà immediatamente alla lingua selezionata"
        ]
      }
    ],
    tips: {
      title: "💡 Suggerimenti Pro",
      items: [
        "Usa i filtri prezzo per concentrarti su specifiche fasce di prezzo da aggiornare",
        "Ordina per prezzo per identificare rapidamente prodotti che necessitano aggiustamenti di prezzo",
        "La funzione ricerca funziona con nomi prodotti, fornitori e tipi di prodotto",
        "I cambiamenti vengono salvati automaticamente - non serve pulsante salva",
        "Puoi modificare più prodotti in sequenza senza ricaricamenti di pagina"
      ]
    },
    support: {
      title: "🛟 Serve aiuto?",
      content: "Se hai bisogno di assistenza o hai domande sull'uso di questa app, contattaci a info@webtorn.com"
    }
  },
  es: {
    title: "Guía de uso del Editor de Ordenación de Precios Admin",
    subtitle: "Guía completa para gestionar eficientemente los precios y estado de tus productos",
    sections: [
      {
        title: "🔍 Buscar y filtrar productos",
        content: [
          "Usa la barra de búsqueda para encontrar productos por nombre o proveedor",
          "Establece filtros de precio mínimo y máximo para estrechar resultados",
          "Elige cuántos productos mostrar por página (10-1000)",
          "Usa 'Limpiar filtros' para resetear todos los criterios de búsqueda"
        ]
      },
      {
        title: "📊 Ordenar productos por precio",
        content: [
          "Haz clic en 'Precio: De menor a mayor' para ordenar del más barato al más caro",
          "Haz clic en 'Precio: De mayor a menor' para ordenar del más caro al más barato",
          "La ordenación se aplica instantáneamente a tus resultados filtrados"
        ]
      },
      {
        title: "💰 Editar precios de productos",
        content: [
          "Haz clic en cualquier precio para editarlo directamente",
          "Ingresa el nuevo precio y presiona Enter para guardar, o Esc para cancelar",
          "Para productos con múltiples variantes, haz clic primero en 'Mostrar variantes'",
          "Cada variante puede tener su propio precio - haz clic en precios de variantes individuales para editarlos",
          "Los cambios se guardan inmediatamente en tu tienda Shopify"
        ]
      },
      {
        title: "🔄 Gestionar estado de productos",
        content: [
          "Usa el interruptor para activar/desactivar productos",
          "Interruptor verde = Producto activo (visible en tienda)",
          "Interruptor gris = Producto inactivo (oculto de tienda)",
          "Los cambios de estado se aplican inmediatamente a tu tienda Shopify"
        ]
      },
      {
        title: "📋 Trabajar con variantes",
        content: [
          "Los productos con múltiples variantes muestran el botón 'Mostrar variantes'",
          "Haz clic para expandir y ver todas las variantes con sus precios individuales",
          "Edita cada precio de variante por separado haciendo clic en él",
          "Usa 'Ocultar variantes' para colapsar la lista"
        ]
      },
      {
        title: "🌍 Cambiar idioma",
        content: [
          "Usa el selector de idioma en la esquina superior derecha",
          "Idiomas disponibles: English, Deutsch, Français, Italiano, Español",
          "La interfaz se actualizará inmediatamente al idioma seleccionado"
        ]
      }
    ],
    tips: {
      title: "💡 Consejos Pro",
      items: [
        "Usa filtros de precio para enfocarte en rangos específicos de precios a actualizar",
        "Ordena por precio para identificar rápidamente productos que necesitan ajustes de precio",
        "La función búsqueda funciona con nombres de productos, proveedores y tipos de producto",
        "Los cambios se guardan automáticamente - no necesitas botón guardar",
        "Puedes editar múltiples productos en secuencia sin recargas de página"
      ]
    },
    support: {
      title: "🛟 ¿Necesitas ayuda?",
      content: "Si necesitas asistencia o tienes preguntas sobre el uso de esta app, por favor contáctanos en info@webtorn.com"
    }
  }
};

export default function HelpPage() {
  const [language, setLanguage] = useState<keyof typeof helpContent>('en');

  // Detect browser language on first load
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as keyof typeof helpContent;
    if (helpContent[browserLang]) {
      setLanguage(browserLang);
    }
  }, []);

  const content = helpContent[language];

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#1a365d',
      minHeight: '100vh',
      color: 'white'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px',
      paddingBottom: '20px',
      borderBottom: '2px solid #2d4a6b'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: 'white',
      margin: '0 0 10px 0',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      fontSize: '16px',
      color: '#9ca3af',
      margin: 0
    },
    languageSelector: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-end'
    },
    select: {
      backgroundColor: 'white',
      border: '2px solid #cbd5e0',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '14px',
      minWidth: '120px'
    },
    section: {
      backgroundColor: 'white',
      color: '#1a202c',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#2d4a6b'
    },
    list: {
      paddingLeft: '20px',
      margin: 0
    },
    listItem: {
      marginBottom: '8px',
      lineHeight: '1.6'
    },
    tips: {
      backgroundColor: 'white',
      color: '#1a202c',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
    },
    support: {
      backgroundColor: 'white',
      color: '#1a202c',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center' as const,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Language Selector */}
      <div style={styles.languageSelector}>
        <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as keyof typeof helpContent)}
          style={styles.select}
        >
          <option value="en">🇺🇸 English</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="es">🇪🇸 Español</option>
        </select>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📖 {content.title}</h1>
        <p style={styles.subtitle}>{content.subtitle}</p>
      </div>

      {/* Help Sections */}
      {content.sections.map((section, index) => (
        <div key={index} style={styles.section}>
          <h2 style={styles.sectionTitle}>{section.title}</h2>
          <ul style={styles.list}>
            {section.content.map((item, itemIndex) => (
              <li key={itemIndex} style={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Pro Tips */}
      <div style={styles.tips}>
        <h2 style={styles.sectionTitle}>{content.tips.title}</h2>
        <ul style={styles.list}>
          {content.tips.items.map((tip, index) => (
            <li key={index} style={styles.listItem}>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div style={styles.support}>
        <h2 style={styles.sectionTitle}>{content.support.title}</h2>
        <p style={styles.listItem}>{content.support.content}</p>
      </div>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};