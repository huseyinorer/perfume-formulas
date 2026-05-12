import shopier from '@api/shopier';

const SHOPIER_REGISTRY = process.env.SHOPIER_API_REGISTRY || '@shopier/v1.0';
const SHOPIER_PAGE_SIZE = 50;
const SHOPIER_MAX_PAGES = 5;

function normalizeShopierProduct(product) {
  const id = product?.id ? String(product.id) : '';
  const name = product?.title ? String(product.title) : '';

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    stock: product.stockQuantity ?? null,
    price: product.priceData?.price ?? null,
    status: product.stockStatus ?? null,
    raw: product,
  };
}

function parseMockProducts() {
  const raw = process.env.SHOPIER_PRODUCTS_MOCK;

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => item?.id && item?.name);
  } catch (error) {
    console.warn('Failed to parse SHOPIER_PRODUCTS_MOCK:', error.message);
    return [];
  }
}

function getShopierSdk() {
  const token = process.env.SHOPIER_PAT;
 
  if (!token) {
    return null;
  }

  shopier.auth(token);

  if (SHOPIER_REGISTRY) {
    // Registry identifier is kept for documentation parity and future override needs.
  }

  return shopier;
}

async function listShopierProducts() {
  const sdk = getShopierSdk();

  if (!sdk) {
    return parseMockProducts();
  }

  const products = [];

  for (let page = 1; page <= SHOPIER_MAX_PAGES; page += 1) {
    const { data } = await sdk.getProducts({
      limit: String(SHOPIER_PAGE_SIZE),
      page: String(page),
      sort: 'dateDesc',
    });

    const batch = Array.isArray(data) ? data.map(normalizeShopierProduct).filter(Boolean) : [];

    products.push(...batch);

    if (batch.length < SHOPIER_PAGE_SIZE) {
      break;
    }
  }

  return products;
}

export async function listStoreProducts({ provider }) {
  if (provider !== 'shopier') {
    return [];
  }

  return listShopierProducts();
}

export async function getShopierProduct(productId) {
  const sdk = getShopierSdk();

  if (!sdk) {
    const mockProduct = parseMockProducts().find((item) => String(item.id) === String(productId));
    return mockProduct || null;
  }

  const { data } = await sdk.getProductsId({ id: String(productId) });
  return normalizeShopierProduct(data);
}

export async function updateShopierProduct(productId, { price, stockQuantity }) {
  const sdk = getShopierSdk();

  if (!sdk) {
    throw new Error('SHOPIER_PAT tanımlı değil');
  }

  const body = {};

  if (price !== undefined && price !== null) {
    body.priceData = { price: String(price) };
  }

  if (stockQuantity !== undefined && stockQuantity !== null) {
    body.stockQuantity = Number(stockQuantity);
  }

  const { data } = await sdk.putProductsId(body, { id: String(productId) });
  return normalizeShopierProduct(data);
}

export async function createShopierProduct(body) {
  const sdk = getShopierSdk();

  if (!sdk) {
    throw new Error('SHOPIER_PAT tanimli degil');
  }

  const { data } = await sdk.postProducts(body);
  return normalizeShopierProduct(data);
}
