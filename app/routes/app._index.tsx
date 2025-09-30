import { useEffect, useState, useMemo } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
// Using simple HTML/CSS for better compatibility
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

// Simple i18n translations
const translations = {
  en: {
    title: "Admin Price Sort Edit",
    productsLoaded: "products loaded",
    filtersSearch: "Filters & Search",
    hideFilters: "Hide Filters",
    showFilters: "Show Filters",
    searchPlaceholder: "Search by name or vendor...",
    minPrice: "Min price",
    maxPrice: "Max price",
    itemsPerPage: "Items per page",
    clearFilters: "Clear Filters",
    productType: "Product Type",
    allProductTypes: "All Product Types",
    collection: "Collection",
    allCollections: "All Collections",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    showVariants: "Show variants",
    hideVariants: "Hide variants",
    active: "Active",
    inactive: "Inactive",
    edit: "Edit",
    showing: "Showing",
    of: "of",
    filteredProducts: "filtered products",
    page: "Page",
    prev: "« Prev",
    next: "Next »"
  },
  de: {
    title: "Admin Preis Sortier Editor",
    productsLoaded: "Produkte geladen",
    filtersSearch: "Filter & Suche",
    hideFilters: "Filter ausblenden",
    showFilters: "Filter anzeigen",
    searchPlaceholder: "Nach Name oder Anbieter suchen...",
    minPrice: "Mindestpreis",
    maxPrice: "Höchstpreis",
    itemsPerPage: "Artikel pro Seite",
    clearFilters: "Filter löschen",
    productType: "Produkttyp",
    allProductTypes: "Alle Produkttypen",
    collection: "Sammlung",
    allCollections: "Alle Sammlungen",
    priceLowToHigh: "Preis: Niedrig bis Hoch",
    priceHighToLow: "Preis: Hoch bis Niedrig",
    showVariants: "Varianten anzeigen",
    hideVariants: "Varianten ausblenden",
    active: "Aktiv",
    inactive: "Inaktiv",
    edit: "Bearbeiten",
    showing: "Zeige",
    of: "von",
    filteredProducts: "gefilterte Produkte",
    page: "Seite",
    prev: "« Zurück",
    next: "Weiter »"
  },
  fr: {
    title: "Éditeur de Tri des Prix Admin",
    productsLoaded: "produits chargés",
    filtersSearch: "Filtres et Recherche",
    hideFilters: "Masquer les filtres",
    showFilters: "Afficher les filtres",
    searchPlaceholder: "Rechercher par nom ou fournisseur...",
    minPrice: "Prix minimum",
    maxPrice: "Prix maximum",
    itemsPerPage: "Articles par page",
    clearFilters: "Effacer les filtres",
    productType: "Type de Produit",
    allProductTypes: "Tous les Types de Produits",
    collection: "Collection",
    allCollections: "Toutes les Collections",
    priceLowToHigh: "Prix : Croissant",
    priceHighToLow: "Prix : Décroissant",
    showVariants: "Afficher les variantes",
    hideVariants: "Masquer les variantes",
    active: "Actif",
    inactive: "Inactif",
    edit: "Modifier",
    showing: "Affichage",
    of: "de",
    filteredProducts: "produits filtrés",
    page: "Page",
    prev: "« Précédent",
    next: "Suivant »"
  },
  it: {
    title: "Editor Ordinamento Prezzi Admin",
    productsLoaded: "prodotti caricati",
    filtersSearch: "Filtri e Ricerca",
    hideFilters: "Nascondi filtri",
    showFilters: "Mostra filtri",
    searchPlaceholder: "Cerca per nome o fornitore...",
    minPrice: "Prezzo minimo",
    maxPrice: "Prezzo massimo",
    itemsPerPage: "Articoli per pagina",
    clearFilters: "Cancella filtri",
    productType: "Tipo di Prodotto",
    allProductTypes: "Tutti i Tipi di Prodotto",
    collection: "Collezione",
    allCollections: "Tutte le Collezioni",
    priceLowToHigh: "Prezzo: Dal basso all'alto",
    priceHighToLow: "Prezzo: Dall'alto al basso",
    showVariants: "Mostra varianti",
    hideVariants: "Nascondi varianti",
    active: "Attivo",
    inactive: "Inattivo",
    edit: "Modifica",
    showing: "Mostrando",
    of: "di",
    filteredProducts: "prodotti filtrati",
    page: "Pagina",
    prev: "« Precedente",
    next: "Successivo »"
  },
  es: {
    title: "Editor de Ordenación de Precios Admin",
    productsLoaded: "productos cargados",
    filtersSearch: "Filtros y Búsqueda",
    hideFilters: "Ocultar filtros",
    showFilters: "Mostrar filtros",
    searchPlaceholder: "Buscar por nombre o proveedor...",
    minPrice: "Precio mínimo",
    maxPrice: "Precio máximo",
    itemsPerPage: "Artículos por página",
    clearFilters: "Limpiar filtros",
    productType: "Tipo de Producto",
    allProductTypes: "Todos los Tipos de Producto",
    collection: "Colección",
    allCollections: "Todas las Colecciones",
    priceLowToHigh: "Precio: De menor a mayor",
    priceHighToLow: "Precio: De mayor a menor",
    showVariants: "Mostrar variantes",
    hideVariants: "Ocultar variantes",
    active: "Activo",
    inactive: "Inactivo",
    edit: "Editar",
    showing: "Mostrando",
    of: "de",
    filteredProducts: "productos filtrados",
    page: "Página",
    prev: "« Anterior",
    next: "Siguiente »"
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  console.log('Loader session info:', { shop: session?.shop, accessToken: !!session?.accessToken });
  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const itemsPerPage = url.searchParams.get('itemsPerPage') || '20';
  const searchTerm = url.searchParams.get('search') || '';
  const productType = url.searchParams.get('productType') || '';
  const collection = url.searchParams.get('collection') || '';
  const minPrice = url.searchParams.get('minPrice') || '';
  const maxPrice = url.searchParams.get('maxPrice') || '';
  const sortOrder = url.searchParams.get('sortOrder') || 'asc';
  
  console.log('Pagination params:', { page, itemsPerPage, searchTerm, productType, collection, sortOrder });
  
  // Handle "all" items per page - fetch a large number
  const isLoadingAll = itemsPerPage === 'all';
  const itemsPerPageNum = isLoadingAll ? 2000 : parseInt(itemsPerPage);
  
  // For now, we'll fetch all products and do client-side sorting for price
  // since GraphQL doesn't support price sorting directly
  
  // Fetch all products first, then apply sorting and pagination
  let allProducts = [];
  let totalCount = 0;
  let hasNextPage = false;
  let hasPrevPage = false;
  
  // Fetch all products for proper sorting
  let cursor = null;
  let fetchCount = 0;
  const maxFetches = 8; // Fetch up to 2000 products (250 * 8)
  hasNextPage = true;
  
  while (hasNextPage && fetchCount < maxFetches) {
    const response = await admin.graphql(
      `#graphql
        query getProducts($first: Int!, $after: String) {
          products(first: $first, after: $after, sortKey: CREATED_AT, reverse: false) {
              edges {
                cursor
                node {
                  id
                  title
                  handle
                  status
                  createdAt
                  updatedAt
                  vendor
                  productType
                  collections(first: 10) {
                    edges {
                      node {
                        id
                        title
                        handle
                      }
                    }
                  }
                  featuredImage {
                    url
                    altText
                  }
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        price
                        compareAtPrice
                        sku
                        inventoryQuantity
                        selectedOptions {
                          name
                          value
                        }
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }`,
        {
          variables: {
            first: 250,
            after: cursor,
          },
        }
      );

      const responseJson = await response.json();
      console.log('GraphQL Response for batch:', responseJson.data.products.edges.length, 'products');
      
      const products = responseJson.data.products.edges.map((edge: any) => {
        const variants = edge.node.variants.edges.map((variantEdge: any) => ({
          id: variantEdge.node.id,
          title: variantEdge.node.title,
          price: variantEdge.node.price,
          compareAtPrice: variantEdge.node.compareAtPrice,
          sku: variantEdge.node.sku,
          inventoryQuantity: variantEdge.node.inventoryQuantity,
          selectedOptions: variantEdge.node.selectedOptions
        }));
        
        const collections = edge.node.collections.edges.map((collectionEdge: any) => ({
          id: collectionEdge.node.id,
          title: collectionEdge.node.title,
          handle: collectionEdge.node.handle
        }));
        
        const product = {
          ...edge.node,
          price: edge.node.variants.edges[0]?.node.price || '0.00',
          compareAtPrice: edge.node.variants.edges[0]?.node.compareAtPrice,
          variantCount: edge.node.variants.edges.length,
          firstVariantId: edge.node.variants.edges[0]?.node.id,
          variants: variants,
          collections: collections
        };
        
        return product;
      });

    allProducts.push(...products);
    hasNextPage = responseJson.data.products.pageInfo.hasNextPage;
    cursor = responseJson.data.products.pageInfo.endCursor;
    fetchCount++;
  }
  
  // Apply filtering before sorting/pagination
  const normalizedSearch = (searchTerm || '').trim().toLowerCase();
  const hasSearch = normalizedSearch.length > 0;
  const hasType = !!productType;
  const selectedCollectionId = collection || '';
  const hasCollection = selectedCollectionId !== '';
  const min = minPrice ? parseFloat(minPrice) : Number.NEGATIVE_INFINITY;
  const max = maxPrice ? parseFloat(maxPrice) : Number.POSITIVE_INFINITY;

  let filteredProducts = allProducts.filter((p: any) => {
    // Search by title, vendor, or handle
    const matchesSearch = !hasSearch
      ? true
      : (p.title?.toLowerCase().includes(normalizedSearch) ||
         p.vendor?.toLowerCase().includes(normalizedSearch) ||
         p.handle?.toLowerCase().includes(normalizedSearch));

    // Product type equality
    const matchesType = !hasType ? true : (p.productType === productType);

    // Collection match by ID
    const matchesCollection = !hasCollection
      ? true
      : Array.isArray(p.collections) && p.collections.some((c: any) => c.id === selectedCollectionId);

    // Price within range (check all variants if present)
    const prices: number[] = Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v: any) => parseFloat(v.price)).filter((n: number) => !Number.isNaN(n))
      : [parseFloat(p.price)];
    const productMin = Math.min(...prices);
    const productMax = Math.max(...prices);
    const matchesPrice = productMax >= min && productMin <= max; // any variant overlaps range

    return matchesSearch && matchesType && matchesCollection && matchesPrice;
  });

  // Sort filtered products by price
  if (sortOrder === 'desc') {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceB - priceA; // desc
    });
  } else {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceA - priceB; // asc
    });
  }
  
  // Apply pagination to sorted & filtered products
  totalCount = filteredProducts.length;
  if (isLoadingAll) {
    // Return all filtered products
    hasNextPage = false;
    hasPrevPage = false;
    allProducts = filteredProducts;
  } else {
    // Apply pagination
    const startIndex = (page - 1) * itemsPerPageNum;
    const endIndex = startIndex + itemsPerPageNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    allProducts = paginatedProducts;
    hasNextPage = endIndex < totalCount;
    hasPrevPage = startIndex > 0;
  }
  
  // Get all unique collections for filter dropdown (from first 100 products)
  const collectionsResponse = await admin.graphql(
    `#graphql
      query getCollections {
        collections(first: 100) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }`,
    { variables: {} }
  );
  
  const collectionsJson = await collectionsResponse.json();
  const allCollections = collectionsJson.data.collections.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle
  }));

  return { 
    products: allProducts,
    totalFetched: allProducts.length,
    hasMoreData: hasNextPage,
    hasPrevPage: hasPrevPage,
    currentPage: page,
    itemsPerPage: itemsPerPage,
    totalEstimate: totalCount,
    allCollections: allCollections
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  console.log('Action session info:', { shop: session?.shop, accessToken: !!session?.accessToken });
  
  const formData = await request.formData();
  const actionType = formData.get('actionType') as string;
  const productId = formData.get('productId') as string;
  
  try {
    if (actionType === 'updatePrice') {
      const newPrice = formData.get('newPrice') as string;
      const variantId = formData.get('variantId') as string;
      
      console.log('Updating price:', { newPrice, variantId });
      
      console.log('Updating variant price with GraphQL:', { variantId, newPrice });
      
      // Update variant price via GraphQL (REST /variants is deprecated)
      const gqlResp = await admin.graphql(
        `#graphql
          mutation variantPriceUpdate($id: ID!, $price: Money!) {
            productVariantUpdate(input: { id: $id, price: $price }) {
              productVariant { id price }
              userErrors { field message }
            }
          }`,
        {
          variables: {
            id: variantId,
            price: parseFloat(newPrice).toFixed(2),
          },
        },
      );

      const gqlJson = await gqlResp.json();
      const vUpdate = gqlJson?.data?.productVariantUpdate;
      if (!vUpdate || (vUpdate.userErrors && vUpdate.userErrors.length)) {
        console.error('GraphQL variantPriceUpdate errors:', vUpdate?.userErrors);
        return {
          success: false,
          error: vUpdate?.userErrors?.map((e: any) => e.message).join(', ') || 'Variant price update failed',
        };
      }

      return { success: true, type: 'price', newPrice };
      
    } else if (actionType === 'updateStatus') {
      const newStatus = formData.get('newStatus') as string;
      
      // Update product status via GraphQL (REST /products is deprecated)
      const prodResp = await admin.graphql(
        `#graphql
          mutation productStatusUpdate($id: ID!, $status: ProductStatus!) {
            productUpdate(input: { id: $id, status: $status }) {
              product { id status }
              userErrors { field message }
            }
          }`,
        {
          variables: {
            id: productId,
            status: newStatus,
          },
        },
      );

      const prodJson = await prodResp.json();
      const pUpdate = prodJson?.data?.productUpdate;
      if (!pUpdate || (pUpdate.userErrors && pUpdate.userErrors.length)) {
        console.error('GraphQL productStatusUpdate errors:', pUpdate?.userErrors);
        return {
          success: false,
          error: pUpdate?.userErrors?.map((e: any) => e.message).join(', ') || 'Product status update failed',
        };
      }

      return { success: true, type: 'status', newStatus };
    }
    
    return { success: false, error: 'Invalid action type' };
    
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Failed to update product' };
  }
};

interface Variant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  sku?: string;
  inventoryQuantity?: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  status: string;
  price: string; // First variant price for backward compatibility
  compareAtPrice?: string;
  vendor: string;
  productType: string;
  collections: Collection[];
  featuredImage?: {
    url: string;
    altText?: string;
  };
  variantCount: number;
  firstVariantId?: string;
  variants: Variant[]; // All variants
}

export default function PriceSortingApp() {
  const { 
    products: initialProducts, 
    totalFetched, 
    hasMoreData, 
    hasPrevPage, 
    currentPage, 
    itemsPerPage: currentItemsPerPage,
    totalEstimate,
    allCollections: serverCollections
  } = useLoaderData<typeof loader>();
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Sync initial UI state from URL on mount (sort order, search, filters)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSortOrder = urlParams.get('sortOrder');
      setSortOrder(urlSortOrder === 'desc' ? 'desc' : 'asc');

      const urlSearch = urlParams.get('search') || '';
      setSearchTerm(urlSearch);
      setDebouncedSearchTerm(urlSearch);

      setProductTypeFilter(urlParams.get('productType') || '');
      setCollectionFilter(urlParams.get('collection') || '');

      setPriceFilter({
        min: urlParams.get('minPrice') || '',
        max: urlParams.get('maxPrice') || '',
      });
    }
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState<keyof typeof translations>('en');
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  
  // Use server-side pagination values
  const itemsPerPage = currentItemsPerPage === 'all' ? 'all' : parseInt(currentItemsPerPage);
  
  // Translation function
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  };

  // Detect browser language on first load
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as keyof typeof translations;
    if (translations[browserLang]) {
      setLanguage(browserLang);
    }
  }, []);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Debounce search term for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized unique product types for filter dropdown
  const uniqueProductTypes = useMemo(() => {
    const types = products
      .map(product => product.productType)
      .filter(type => type && type.trim() !== '')
      .sort();
    return [...new Set(types)];
  }, [products]);

  // Use server-provided collections for filter dropdown
  const uniqueCollections = useMemo(() => {
    return serverCollections || [];
  }, [serverCollections]);

  // For true server-side pagination, we'll use products as-is
  // Sorting will be handled via URL navigation to fetch sorted data from server
  const sortedAndFilteredProducts = products;
  
  // Navigation helper to update URL with new parameters (force server loader)
  const navigate = (params: Record<string, string | number>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, String(value));
      }
    });
    window.location.href = `${url.pathname}?${url.searchParams.toString()}`;
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    navigate({ sortOrder: order, page: 1 });
    shopify.toast.show(`Products sorted by price ${order === 'asc' ? 'Low to High' : 'High to Low'}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setPriceFilter({ min: '', max: '' });
    setProductTypeFilter('');
    setCollectionFilter('');
    navigate({ 
      search: '', 
      productType: '', 
      collection: '', 
      minPrice: '', 
      maxPrice: '', 
      page: 1 
    });
  };
  
  // Handle filter changes with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Debounce the server request
    setTimeout(() => {
      navigate({ search: value, page: 1 });
    }, 500);
  };
  
  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    navigate({ itemsPerPage: newItemsPerPage, page: 1 });
  };
  
  const handleProductTypeChange = (value: string) => {
    setProductTypeFilter(value);
    navigate({ productType: value, page: 1 });
  };
  
  const handleCollectionChange = (value: string) => {
    setCollectionFilter(value);
    navigate({ collection: value, page: 1 });
  };
  
  const handlePriceFilterChange = (type: 'min' | 'max', value: string) => {
    setPriceFilter(prev => ({ ...prev, [type]: value }));
    // Debounce price filter changes
    setTimeout(() => {
      const newMinPrice = type === 'min' ? value : priceFilter.min;
      const newMaxPrice = type === 'max' ? value : priceFilter.max;
      navigate({ minPrice: newMinPrice, maxPrice: newMaxPrice, page: 1 });
    }, 500);
  };

  const toggleVariantsExpanded = (productId: string) => {
    const newExpanded = new Set(expandedVariants);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedVariants(newExpanded);
  };

  // Price editing functions
  const startEditingPrice = (productId: string, currentPrice: string, variantId?: string) => {
    const editingKey = variantId ? `${productId}-${variantId}` : productId;
    setEditingPrice(editingKey);
    setTempPrice(currentPrice);
  };

  const cancelEditingPrice = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const savePrice = async (productId: string, variantId?: string) => {
    console.log('savePrice called:', { productId, variantId, tempPrice });
    
    if (!tempPrice || tempPrice === '') {
      cancelEditingPrice();
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      const targetVariantId = variantId || product?.firstVariantId;
      
      console.log('Product found:', product?.title);
      console.log('Target variant ID:', targetVariantId);
      
      if (!product || !targetVariantId) {
        console.error('Product or variant not found:', { product: !!product, targetVariantId });
        shopify.toast.show('Error: Product variant not found', { isError: true });
        return;
      }

      // Update local state immediately for better UX
      const updatedProducts = products.map(p => {
        if (p.id !== productId) return p;
        
        // Update the specific variant
        const updatedVariants = p.variants.map(v => 
          v.id === targetVariantId 
            ? { ...v, price: parseFloat(tempPrice).toFixed(2) }
            : v
        );
        
        // If updating first variant, also update main price
        const updatedMainPrice = targetVariantId === p.firstVariantId 
          ? parseFloat(tempPrice).toFixed(2) 
          : p.price;
        
        return {
          ...p,
          price: updatedMainPrice,
          variants: updatedVariants
        };
      });
      setProducts(updatedProducts);
      
      // Make real API call
      const formData = new FormData();
      formData.append('actionType', 'updatePrice');
      formData.append('productId', productId);
      formData.append('variantId', targetVariantId);
      formData.append('newPrice', parseFloat(tempPrice).toFixed(2));
      
      fetcher.submit(formData, { method: 'POST' });
      
      // Show success message
      shopify.toast.show(`Price updated to $${parseFloat(tempPrice).toFixed(2)}`, { duration: 3000 });
      
      cancelEditingPrice();
    } catch (error) {
      console.error('Error updating price:', error);
      shopify.toast.show('Error updating price. Please try again.', { isError: true });
      
      // Revert local changes on error
      const originalProduct = products.find(p => p.id === productId);
      if (originalProduct) {
        const revertedProducts = products.map(p => 
          p.id === productId ? originalProduct : p
        );
        setProducts(revertedProducts);
      }
    }
  };

  const handlePriceKeyPress = (e: React.KeyboardEvent, productId: string, variantId?: string) => {
    if (e.key === 'Enter') {
      savePrice(productId, variantId);
    } else if (e.key === 'Escape') {
      cancelEditingPrice();
    }
  };

  // Status toggle function
  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    setUpdatingStatus(productId);
    const newStatus = currentStatus === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    
    try {
      // Update local state immediately for better UX
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus }
          : product
      );
      setProducts(updatedProducts);
      
      // Make real API call
      const formData = new FormData();
      formData.append('actionType', 'updateStatus');
      formData.append('productId', productId);
      formData.append('newStatus', newStatus);
      
      fetcher.submit(formData, { method: 'POST' });
      
      // Show success message
      shopify.toast.show(
        `Product ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`, 
        { duration: 2000 }
      );
      
    } catch (error) {
      console.error('Error updating status:', error);
      shopify.toast.show('Error updating product status. Please try again.', { isError: true });
      
      // Revert local changes on error
      const revertedProducts = products.map(product => 
        product.id === productId 
          ? { ...product, status: currentStatus }
          : product
      );
      setProducts(revertedProducts);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Server-side pagination logic
  const currentProducts = sortedAndFilteredProducts; // Products already paginated on server
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(totalEstimate / (typeof itemsPerPage === 'number' ? itemsPerPage : 20));
  const startIndex = itemsPerPage === 'all' ? 1 : (currentPage - 1) * (typeof itemsPerPage === 'number' ? itemsPerPage : 20) + 1;
  const endIndex = itemsPerPage === 'all' ? totalFetched : Math.min(startIndex + totalFetched - 1, totalEstimate);
  
  const goToPage = (page: number) => {
    navigate({ page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const goToNextPage = () => {
    if (hasMoreData) {
      goToPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  };

  // Handle API responses
  useEffect(() => {
    if (fetcher.data) {
      const response = fetcher.data as any;
      if (!response.success) {
        shopify.toast.show(response.error || 'Update failed', { isError: true });
        
        // Revert local changes on API error
        setProducts(initialProducts);
        setUpdatingStatus(null);
        cancelEditingPrice();
      } else {
        // Success - the local state is already updated optimistically
        if (response.type === 'price') {
          shopify.toast.show('Price updated successfully on Shopify!', { duration: 2000 });
        } else if (response.type === 'status') {
          shopify.toast.show('Product status updated successfully on Shopify!', { duration: 2000 });
        }
      }
    }
  }, [fetcher.data, shopify, initialProducts]);

  const styles = {
    body: {
      backgroundColor: '#1a365d',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#1a365d',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      borderBottom: '2px solid #2d4a6b',
      paddingBottom: '16px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: 'white',
      margin: 0,
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    primaryButton: {
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '14px 20px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 4px 12px rgba(49, 130, 206, 0.4)',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#2c5aa0',
        transform: 'translateY(-1px)',
        boxShadow: '0 6px 16px rgba(49, 130, 206, 0.5)'
      }
    },
    card: {
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '12px',
      marginBottom: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
    },
    filterSection: {
      padding: '20px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      backgroundColor: '#f8fafc'
    },
    input: {
      border: '2px solid #cbd5e0',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '14px',
      minWidth: '200px',
      transition: 'border-color 0.2s ease',
      ':focus': {
        borderColor: '#3182ce',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)'
      }
    },
    select: {
      border: '2px solid #cbd5e0',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      padding: '20px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    button: {
      border: '2px solid #2d3748',
      borderRadius: '8px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      backgroundColor: 'white',
      color: '#2d3748',
      transition: 'all 0.2s ease'
    },
    buttonActive: {
      backgroundColor: '#2d4a6b',
      color: 'white',
      borderColor: '#2d4a6b',
      boxShadow: '0 4px 12px rgba(45, 74, 107, 0.3)'
    },
    productList: {
      minHeight: '400px'
    },
    productItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #f1f5f9',
      gap: '16px',
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: '#f8fafc'
      }
    },
    productImage: {
      width: '56px',
      height: '56px',
      borderRadius: '10px',
      objectFit: 'cover',
      backgroundColor: '#f1f5f9',
      border: '2px solid #e2e8f0'
    },
    productInfo: {
      flex: 1
    },
    productTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1a202c',
      margin: '0 0 6px 0'
    },
    productMeta: {
      fontSize: '13px',
      color: '#718096',
      margin: 0
    },
    productPrice: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#2d4a6b',
      textAlign: 'right'
    },
    badge: {
      display: 'inline-block',
      padding: '6px 12px',
      fontSize: '11px',
      fontWeight: '600',
      borderRadius: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    badgeSuccess: {
      backgroundColor: '#c6f6d5',
      color: '#22543d'
    },
    badgeDefault: {
      backgroundColor: '#edf2f7',
      color: '#4a5568'
    },
    editButton: {
      color: '#3182ce',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '600',
      padding: '8px 12px',
      border: '1px solid #3182ce',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#3182ce',
        color: 'white'
      }
    },
    summary: {
      padding: '16px 20px',
      fontSize: '14px',
      color: '#4a5568',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      gap: '8px',
      backgroundColor: 'white',
      borderTop: '1px solid #e2e8f0'
    },
    pageButton: {
      border: '1px solid #cbd5e0',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      backgroundColor: 'white',
      color: '#4a5568',
      minWidth: '40px',
      textAlign: 'center',
      transition: 'all 0.2s ease'
    },
    pageButtonActive: {
      backgroundColor: '#2d4a6b',
      color: 'white',
      borderColor: '#2d4a6b'
    },
    pageButtonDisabled: {
      opacity: 0.4,
      cursor: 'not-allowed'
    },
    pageInfo: {
      color: '#718096',
      fontSize: '14px',
      margin: '0 16px'
    },
    footer: {
      textAlign: 'center',
      padding: '24px 20px',
      marginTop: '40px',
      borderTop: '2px solid #2d4a6b',
      color: '#9ca3af'
    },
    footerBrand: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    footerLink: {
      color: '#60a5fa',
      textDecoration: 'none',
      fontWeight: '600'
    },
    footerCompany: {
      fontSize: '12px',
      opacity: 0.8
    },
    toggleSwitch: {
      position: 'relative',
      width: '56px',
      height: '28px',
      backgroundColor: '#e2e8f0',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      border: '2px solid #f1f5f9',
      outline: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    },
    toggleSwitchActive: {
      backgroundColor: '#3182ce',
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1), 0 2px 6px rgba(0,0,0,0.1)'
    },
    toggleKnob: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    toggleKnobActive: {
      transform: 'translateX(28px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    toggleLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#4a5568'
    },
    priceInput: {
      border: '2px solid #3182ce',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#2d4a6b',
      textAlign: 'right',
      minWidth: '80px',
      backgroundColor: '#f0f9ff'
    },
    priceDisplay: {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      padding: '4px 8px',
      borderRadius: '4px',
      ':hover': {
        backgroundColor: '#f0f9ff',
        transform: 'scale(1.05)'
      }
    },
    saveButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '11px',
      fontWeight: '500',
      cursor: 'pointer',
      marginLeft: '4px'
    },
    cancelButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '11px',
      fontWeight: '500',
      cursor: 'pointer',
      marginLeft: '4px'
    },
    statusToggleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    },
    statusToggle: {
      position: 'relative',
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      border: 'none',
      outline: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    statusToggleActive: {
      backgroundColor: '#10b981', // Green for active
    },
    statusToggleInactive: {
      backgroundColor: '#6b7280', // Gray for inactive  
    },
    statusKnob: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statusKnobActive: {
      transform: 'translateX(20px)'
    },
    statusLabel: {
      fontSize: '10px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    statusLabelActive: {
      color: '#10b981'
    },
    statusLabelInactive: {
      color: '#6b7280'
    },
    variantContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      marginTop: '8px'
    },
    variantItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    },
    variantTitle: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#4a5568'
    },
    variantOptions: {
      fontSize: '12px',
      color: '#718096',
      marginTop: '2px'
    },
    expandButton: {
      fontSize: '12px',
      color: '#3182ce',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🚀 {t('title')}</h1>
            <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
              📄 {totalFetched} {t('productsLoaded')} {hasMoreData && '(more available)'}
            </div>
            <div style={{ color: '#60a5fa', fontSize: '12px', marginTop: '2px', fontWeight: '500' }}>
              by Trendy Designs LLC
            </div>
          </div>
          
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px' }}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as keyof typeof translations)}
                style={{
                  ...styles.select,
                  minWidth: '120px',
                  backgroundColor: 'white',
                  border: '2px solid #cbd5e0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px'
                }}
              >
                <option value="en">🇺🇸 English</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>
          </div>
      </div>

      <div style={styles.card}>
        {/* Filter Toggle Header */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1a202c', fontSize: '18px', fontWeight: '600' }}>🔍 {t('filtersSearch')}</h3>
          <div style={styles.toggleContainer}>
            <span style={{
              ...styles.toggleLabel,
              color: showFilters ? '#3182ce' : '#9ca3af'
            }}>
              {showFilters ? t('hideFilters') : t('showFilters')}
            </span>
            <button
              style={{
                ...styles.toggleSwitch,
                ...(showFilters ? styles.toggleSwitchActive : {})
              }}
              onClick={() => setShowFilters(!showFilters)}
              onMouseOver={(e) => {
                if (showFilters) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                } else {
                  e.currentTarget.style.backgroundColor = '#cbd5e0';
                }
              }}
              onMouseOut={(e) => {
                if (showFilters) {
                  e.currentTarget.style.backgroundColor = '#3182ce';
                } else {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }
              }}
              aria-label="Toggle filters"
            >
              <div style={{
                ...styles.toggleKnob,
                ...(showFilters ? styles.toggleKnobActive : {})
              }}>
                <span style={{ 
                  fontSize: '8px', 
                  color: showFilters ? '#10b981' : '#6b7280',
                  fontWeight: '900'
                }}>
                  {showFilters ? '✓' : '✕'}
                </span>
              </div>
            </button>
          </div>
        </div>
        
        {showFilters && (
        <div style={styles.filterSection}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4a5568', marginBottom: '4px', fontWeight: '500' }}>Search products</label>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={styles.input}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4a5568', marginBottom: '4px', fontWeight: '500' }}>{t('minPrice')}</label>
            <input
              type="number"
              placeholder="0.00"
              value={priceFilter.min}
              onChange={(e) => handlePriceFilterChange('min', e.target.value)}
              style={{ ...styles.input, minWidth: '120px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4a5568', marginBottom: '4px', fontWeight: '500' }}>{t('maxPrice')}</label>
            <input
              type="number"
              placeholder="999.99"
              value={priceFilter.max}
              onChange={(e) => handlePriceFilterChange('max', e.target.value)}
              style={{ ...styles.input, minWidth: '120px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4a5568', marginBottom: '4px', fontWeight: '500' }}>{t('itemsPerPage')}</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              style={styles.select}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={100}>100</option>
              <option value={1000}>1000</option>
              <option value={2000}>2000</option>
              <option value="all">All</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4a5568', marginBottom: '4px', fontWeight: '500' }}>{t('productType')}</label>
            <select
              value={productTypeFilter}
              onChange={(e) => handleProductTypeChange(e.target.value)}
              style={{ ...styles.select, minWidth: '200px' }}
            >
              <option value="">{t('allProductTypes')}</option>
              {uniqueProductTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4a5568', marginBottom: '4px', fontWeight: '500' }}>{t('collection')}</label>
            <select
              value={collectionFilter}
              onChange={(e) => handleCollectionChange(e.target.value)}
              style={{ ...styles.select, minWidth: '200px' }}
            >
              <option value="">{t('allCollections')}</option>
              {uniqueCollections.map((collection) => (
                <option key={collection.id} value={collection.id}>{collection.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={clearAllFilters}
            style={{ ...styles.button, alignSelf: 'flex-end' }}
          >
            {t('clearFilters')}
          </button>
        </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            style={{
              ...styles.button,
              ...(sortOrder === 'asc' ? styles.buttonActive : {})
            }}
            onClick={() => handleSortChange('asc')}
          >
            ↑ {t('priceLowToHigh')}
          </button>
          <button
            style={{
              ...styles.button,
              ...(sortOrder === 'desc' ? styles.buttonActive : {})
            }}
            onClick={() => handleSortChange('desc')}
          >
            ↓ {t('priceHighToLow')}
          </button>
        </div>

        <div style={styles.summary}>
          <div>
            {t('showing')} {startIndex}-{endIndex} {t('of')} {itemsPerPage === 'all' ? totalFetched : totalEstimate} {t('filteredProducts')}
            {searchTerm && ` for "${searchTerm}"`}
            <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>
              (Server-side pagination active)
            </span>
          </div>
          <div>
            {itemsPerPage !== 'all' && (
              <span>{t('page')} {currentPage} of {totalPages}</span>
            )}
            {itemsPerPage === 'all' && (
              <span>Showing all available products</span>
            )}
          </div>
        </div>

        <div style={styles.productList}>
          {currentProducts.map((product) => {
            const productId = product.id.replace('gid://shopify/Product/', '');
            return (
              <div 
                key={product.id} 
                style={styles.productItem}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {product.featuredImage ? (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    style={styles.productImage}
                  />
                ) : (
                  <div style={{
                    ...styles.productImage,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#9ca3af'
                  }}>📦</div>
                )}
                
                <div style={styles.productInfo}>
                  <h3 style={styles.productTitle}>{product.title}</h3>
                  <p style={styles.productMeta}>
                    {product.handle} • {product.vendor}
                  </p>
                  <p style={{ ...styles.productMeta, marginTop: '2px' }}>
                    📂 <span style={{ color: '#2d4a6b', fontWeight: '600' }}>{product.productType || 'Uncategorized'}</span> • {product.variantCount} variant{product.variantCount !== 1 ? 's' : ''}
                  </p>
                  {product.collections.length > 0 && (
                    <p style={{ ...styles.productMeta, marginTop: '2px' }}>
                      🏷️ <span style={{ color: '#059669', fontWeight: '500' }}>
                        {product.collections.map(c => c.title).join(', ')}
                      </span>
                    </p>
                  )}
                  <p style={{ ...styles.productMeta, marginTop: '2px' }}>
                    {console.log('Product variants info:', { title: product.title, variantCount: product.variantCount, actualVariants: product.variants?.length }) || ''}
                    {(product.variantCount > 1 || product.variants?.length > 1) && (
                      <button 
                        style={styles.expandButton}
                        onClick={() => {
                          console.log('Expand button clicked for:', product.title);
                          toggleVariantsExpanded(product.id);
                        }}
                      >
                        {expandedVariants.has(product.id) ? `▼ ${t('hideVariants')}` : `▶ ${t('showVariants')}`}
                      </button>
                    )}
                  </p>
                  
                  {/* Variants Section */}
                  {(product.variantCount > 1 || product.variants?.length > 1) && expandedVariants.has(product.id) && (
                    <div style={styles.variantContainer}>
                      {product.variants.map((variant, index) => {
                        const editingKey = `${product.id}-${variant.id}`;
                        const isEditing = editingPrice === editingKey;
                        
                        return (
                          <div key={variant.id} style={styles.variantItem}>
                            <div>
                              <div style={styles.variantTitle}>
                                {variant.title} {variant.sku && `(${variant.sku})`}
                              </div>
                              {variant.selectedOptions.length > 0 && (
                                <div style={styles.variantOptions}>
                                  {variant.selectedOptions.map(option => `${option.name}: ${option.value}`).join(' | ')}
                                </div>
                              )}
                            </div>
                            
                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                              {isEditing ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600' }}>$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    onKeyDown={(e) => handlePriceKeyPress(e, product.id, variant.id)}
                                    onBlur={() => cancelEditingPrice()}
                                    style={{ ...styles.priceInput, fontSize: '14px', minWidth: '60px' }}
                                    autoFocus
                                  />
                                  <button
                                    style={{ ...styles.saveButton, fontSize: '10px', padding: '2px 6px' }}
                                    onClick={() => savePrice(product.id, variant.id)}
                                    onMouseDown={(e) => e.preventDefault()}
                                  >
                                    ✓
                                  </button>
                                  <button
                                    style={{ ...styles.cancelButton, fontSize: '10px', padding: '2px 6px' }}
                                    onClick={cancelEditingPrice}
                                    onMouseDown={(e) => e.preventDefault()}
                                  >
                                    ✖
                                  </button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    ...styles.priceDisplay,
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#2d4a6b',
                                    cursor: 'pointer',
                                    padding: '2px 6px'
                                  }}
                                  onClick={() => startEditingPrice(product.id, variant.price, variant.id)}
                                  title="Click to edit variant price"
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                                    <span>${parseFloat(variant.price).toFixed(2)}</span>
                                    <span style={{ fontSize: '8px', opacity: 0.6 }}>✏️</span>
                                  </div>
                                </div>
                              )}
                              {variant.compareAtPrice && (
                                <div style={{ fontSize: '10px', color: '#9ca3af', textDecoration: 'line-through', marginTop: '1px' }}>
                                  Was: ${parseFloat(variant.compareAtPrice).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: 'center', minWidth: '140px' }}>
                  {editingPrice === product.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '600' }}>$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        onKeyDown={(e) => handlePriceKeyPress(e, product.id)}
                        onBlur={() => cancelEditingPrice()}
                        style={styles.priceInput}
                        autoFocus
                      />
                      <button
                        style={styles.saveButton}
                        onClick={() => savePrice(product.id)}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur
                      >
                        ✓
                      </button>
                      <button
                        style={styles.cancelButton}
                        onClick={cancelEditingPrice}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        ...styles.priceDisplay,
                        ...styles.productPrice
                      }}
                      onClick={() => startEditingPrice(product.id, product.price)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="Click to edit price"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span>${parseFloat(product.price).toFixed(2)}</span>
                        <span style={{ fontSize: '10px', opacity: 0.6 }}>✏️</span>
                      </div>
                    </div>
                  )}
                  {product.compareAtPrice && (
                    <div style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through', marginTop: '2px' }}>
                      Was: ${parseFloat(product.compareAtPrice).toFixed(2)}
                    </div>
                  )}
                </div>
                
                <div style={styles.statusToggleContainer}>
                  <button
                    style={{
                      ...styles.statusToggle,
                      ...(product.status === 'ACTIVE' ? styles.statusToggleActive : styles.statusToggleInactive),
                      opacity: updatingStatus === product.id ? 0.5 : 1,
                      pointerEvents: updatingStatus === product.id ? 'none' : 'auto'
                    }}
                    onClick={() => toggleProductStatus(product.id, product.status)}
                    disabled={updatingStatus === product.id}
                    title={`Click to ${product.status === 'ACTIVE' ? 'deactivate' : 'activate'} product`}
                  >
                    <div style={{
                      ...styles.statusKnob,
                      ...(product.status === 'ACTIVE' ? styles.statusKnobActive : {})
                    }}>
                      {updatingStatus === product.id ? (
                        <span style={{ fontSize: '8px' }}>⏳</span>
                      ) : (
                        <span style={{ 
                          fontSize: '8px', 
                          color: product.status === 'ACTIVE' ? '#10b981' : '#6b7280',
                          fontWeight: '900'
                        }}>
                          {product.status === 'ACTIVE' ? '✓' : '✕'}
                        </span>
                      )}
                    </div>
                  </button>
                  <span style={{
                    ...styles.statusLabel,
                    ...(product.status === 'ACTIVE' ? styles.statusLabelActive : styles.statusLabelInactive)
                  }}>
                    {product.status === 'ACTIVE' ? t('active') : t('inactive')}
                  </span>
                </div>
                
                <a
                  href={`shopify:admin/products/${productId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.editButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#3182ce';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#3182ce';
                  }}
                >
                  {t('edit')}
                </a>
              </div>
            );
          })}
          
          {currentProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ margin: '0 0 12px 0', color: '#4a5568' }}>No products found</h3>
              <p style={{ margin: 0 }}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {itemsPerPage !== 'all' && totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.pageButton,
                ...(!hasPrevPage ? styles.pageButtonDisabled : {})
              }}
              onClick={goToPrevPage}
              disabled={!hasPrevPage}
            >
              {t('prev')}
            </button>
            
            {generatePageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} style={styles.pageInfo}>
                    ...
                  </span>
                );
              }
              
              return (
                <button
                  key={page}
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === page ? styles.pageButtonActive : {})
                  }}
                  onClick={() => goToPage(page as number)}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              style={{
                ...styles.pageButton,
                ...(!hasMoreData ? styles.pageButtonDisabled : {})
              }}
              onClick={goToNextPage}
              disabled={!hasMoreData}
            >
              {t('next')}
            </button>
            
            <span style={styles.pageInfo}>
              {startIndex}-{endIndex} of {totalEstimate}
            </span>
          </div>
        )}
      </div>

      {/* Professional Footer */}
      <div style={styles.footer}>
        <div style={styles.footerBrand}>
          🚀 Powered by{' '}
          <a 
            href="https://trendyappshopify.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.footerLink}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#60a5fa';
            }}
          >
            trendyappshopify.com
          </a>
        </div>
        <div style={styles.footerCompany}>
          © {new Date().getFullYear()} Trendy Designs LLC - Professional Shopify App Solutions
        </div>
        <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.6 }}>
          Admin Price Sort Edit v2.0 | Built with ❤️ for Shopify Merchants
        </div>
      </div>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
