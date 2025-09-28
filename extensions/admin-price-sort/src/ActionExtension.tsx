import {useEffect, useState} from 'react';
import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
  InlineStack,
  Banner,
} from '@shopify/ui-extensions-react/admin';

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-index.action.render';

export default reactExtension(TARGET, () => <App />);

interface Product {
  id: string;
  title: string;
  handle: string;
  price: string;
  compareAtPrice?: string;
}

function App() {
  // The useApi hook provides access to several useful APIs like i18n, close, and data.
  const {i18n, close, data} = useApi(TARGET);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [priceColumnAdded, setPriceColumnAdded] = useState(false);
  
  const openBulkEditor = () => {
    // Get selected products or all products if none selected
    const selectedIds = data.selected?.map((item: any) => item.id) || [];
    
    if (selectedIds.length === 0) {
      // If no products selected, we'll create a bulk edit URL for all products
      // This is a simplified approach - in practice you might want to fetch product IDs
      window.open('/admin/bulk/product?resource_name=Product&edit=variants.price', '_blank');
    } else {
      // Create bulk edit URL with selected product IDs
      const idsParam = selectedIds.join('%2C');
      const bulkUrl = `/admin/bulk/product?resource_name=Product&edit=variants.price&ids=${idsParam}`;
      window.open(bulkUrl, '_blank');
    }
  };
  
  const addPriceColumn = async () => {
    try {
      // Since direct DOM manipulation is restricted, we'll fetch and display product data within the extension
      setIsLoading(true);
      
      const productsQuery = {
        query: `query getProducts($first: Int!) {
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price
                      compareAtPrice
                    }
                  }
                }
              }
            }
          }
        }`,
        variables: { first: 50 }
      };

      const response = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(productsQuery),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      const fetchedProducts = result.data.products.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        price: edge.node.variants.edges[0]?.node.price || '0',
        compareAtPrice: edge.node.variants.edges[0]?.node.compareAtPrice
      }));

      setProducts(fetchedProducts);
      setPriceColumnAdded(true);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sortProductsByPrice = async (order: 'asc' | 'desc') => {
    setIsLoading(true);
    setSortOrder(order);
    
    try {
      // Use Shopify's native URL parameters for sorting
      const currentUrl = new URL(window.location.href);
      
      // Clear existing sort parameters
      currentUrl.searchParams.delete('sort_key');
      currentUrl.searchParams.delete('reverse');
      
      // Set new sort parameters
      currentUrl.searchParams.set('sort_key', 'price');
      if (order === 'desc') {
        currentUrl.searchParams.set('reverse', 'true');
      }
      
      // Navigate to the sorted page
      window.location.href = currentUrl.toString();
      
    } catch (error) {
      console.error('Error sorting products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAction
      primaryAction={
        <Button
          onPress={() => {
            close();
          }}
        >
          Done
        </Button>
      }
    >
      <BlockStack gap="400">
        <Text fontWeight="bold">{i18n.translate('welcome', {target: TARGET})}</Text>
        
        <Text tone="subdued" size="small">
          🚀 Professional tool by{' '}
          <Text fontWeight="medium" tone="success">
            Trendy Designs LLC
          </Text>{' '}
          - Visit{' '}
          <Text fontWeight="medium" tone="magic">
            trendyappshopify.com
          </Text>
        </Text>
        
        {showInstructions && (
          <Banner tone="info" onDismiss={() => setShowInstructions(false)}>
            <Text>
              💡 <strong>Price Sorting Tool:</strong> This extension helps you sort and view products by price. 
              Works best in Bulk Editor where price columns are already visible!
            </Text>
            <Text size="small">
              🔗 Tip: Use "Bulk actions" → "Edit products" from the main products page to access the bulk editor with price columns.
            </Text>
          </Banner>
        )}
        
        <BlockStack gap="300">
          <Text fontWeight="bold">💼 Best Option: Use Bulk Editor</Text>
          <Button
            onPress={openBulkEditor}
            variant="primary"
          >
            📊 Open Bulk Price Editor
          </Button>
          <Text size="small" tone="subdued">
            ✨ Bulk Editor already has price columns and sorting! Perfect for price management.
          </Text>
        </BlockStack>
        
        <BlockStack gap="300">
          <Text fontWeight="bold">💰 Or View Products with Prices Here</Text>
          <Button
            onPress={addPriceColumn}
            variant="secondary"
            loading={isLoading}
          >
            {isLoading ? 'Loading Products...' : '📊 Show Products with Prices'}
          </Button>
          
          {products.length > 0 && (
            <BlockStack gap="200">
              <Text fontWeight="bold">Products ({products.length} found):</Text>
              <BlockStack gap="100">
                {products
                  .sort((a, b) => {
                    const priceA = parseFloat(a.price);
                    const priceB = parseFloat(b.price);
                    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
                  })
                  .slice(0, 10) // Show first 10 products
                  .map((product) => (
                    <BlockStack key={product.id} gap="50">
                      <InlineStack gap="200">
                        <Text fontWeight="medium">{product.title}</Text>
                        <Text fontWeight="bold" tone="success">
                          ${product.price}
                        </Text>
                        {product.compareAtPrice && (
                          <Text tone="subdued" size="small">
                            (was ${product.compareAtPrice})
                          </Text>
                        )}
                      </InlineStack>
                    </BlockStack>
                  ))}
                {products.length > 10 && (
                  <Text tone="subdued" size="small">
                    ... and {products.length - 10} more products
                  </Text>
                )}
              </BlockStack>
            </BlockStack>
          )}
        </BlockStack>
        
        {products.length > 0 && (
          <BlockStack gap="300">
            <Text fontWeight="bold">⚡ Sort Products</Text>
            <InlineStack gap="200">
              <Button
                onPress={() => {
                  setSortOrder('asc');
                  sortProductsByPrice('asc');
                }}
                variant={sortOrder === 'asc' ? 'primary' : 'secondary'}
              >
                💰 Price: Low to High
              </Button>
              
              <Button
                onPress={() => {
                  setSortOrder('desc');
                  sortProductsByPrice('desc');
                }}
                variant={sortOrder === 'desc' ? 'primary' : 'secondary'}
              >
                💎 Price: High to Low
              </Button>
            </InlineStack>
            
            <Button
              onPress={() => {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('sort_key', 'price');
                if (sortOrder === 'desc') {
                  currentUrl.searchParams.set('reverse', 'true');
                } else {
                  currentUrl.searchParams.delete('reverse');
                }
                window.location.href = currentUrl.toString();
              }}
              variant="primary"
            >
              🔄 Apply Sort to Shopify Page
            </Button>
          </BlockStack>
        )}
        
        <Text tone="subdued" size="small">
          Note: Shopify natively sorts by the first variant's price for products with multiple variants.
        </Text>
      </BlockStack>
    </AdminAction>
  );
}
