import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type ProductDataType = 'tags' | 'vendors' | 'types';

interface ProductDataState {
  tags: string[];
  vendors: string[];
  types: string[];
  loading: {
    tags: boolean;
    vendors: boolean;
    types: boolean;
  };
  error: {
    tags: string | null;
    vendors: string | null;
    types: string | null;
  };
  pagination: {
    tags: { hasNextPage: boolean; cursor: string | null };
    vendors: { hasNextPage: boolean; cursor: string | null };
    types: { hasNextPage: boolean; cursor: string | null };
  };
}

const initialState: ProductDataState = {
  tags: [],
  vendors: [],
  types: [],
  loading: {
    tags: false,
    vendors: false,
    types: false,
  },
  error: {
    tags: null,
    vendors: null,
    types: null,
  },
  pagination: {
    tags: { hasNextPage: false, cursor: null },
    vendors: { hasNextPage: false, cursor: null },
    types: { hasNextPage: false, cursor: null },
  },
};

// GraphQL queries for fetching tags, vendors, and types directly
const GET_PRODUCT_TAGS_QUERY = `
  query GetProductTags($first: Int!, $after: String) {
    productTags(first: $first, after: $after) {
      edges {
        node
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_PRODUCT_VENDORS_QUERY = `
  query GetProductVendors($first: Int!, $after: String) {
    productVendors(first: $first, after: $after) {
      edges {
        node
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_PRODUCT_TYPES_QUERY = `
  query GetProductTypes($first: Int!, $after: String) {
    productTypes(first: $first, after: $after) {
      edges {
        node
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Get the appropriate query based on type
const getQueryForType = (type: ProductDataType) => {
  switch (type) {
    case 'tags':
      return GET_PRODUCT_TAGS_QUERY;
    case 'vendors':
      return GET_PRODUCT_VENDORS_QUERY;
    case 'types':
      return GET_PRODUCT_TYPES_QUERY;
  }
};

// Async thunk to fetch product data using GraphQL
// Search parameter is ignored - filtering is done client-side on stored data
export const fetchProductData = createAsyncThunk(
  'productData/fetchProductData',
  async ({ 
    type, 
    search = '', 
    cursor = null,
    limit = 10 // Default limit is 10 for tags, vendors, types
  }: { 
    type: ProductDataType; 
    search?: string; // Not used in GraphQL query, kept for compatibility
    cursor?: string | null;
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      // Build variables object
      const variables: Record<string, any> = {
        first: limit,
      };

      // Only add after cursor if it exists
      if (cursor) {
        variables.after = cursor;
      }

      // Get the appropriate query for the type
      const query = getQueryForType(type);

      // Execute GraphQL query
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GraphQL API error:', errorText);
        throw new Error(`HTTP ${response.status}: Failed to fetch ${type}`);
      }

      const result = await response.json();

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        const errorMessage = result.errors[0]?.message || `GraphQL error: ${type}`;
        console.error('GraphQL errors:', result.errors);
        throw new Error(errorMessage);
      }

      // Check for API-level errors
      if (result.error) {
        console.error('API error:', result.error);
        throw new Error(result.error);
      }

      // Extract data based on type
      let edges: any[] = [];
      let pageInfo: any = { hasNextPage: false, endCursor: null };

      if (type === 'tags') {
        edges = result.data?.productTags?.edges || [];
        pageInfo = result.data?.productTags?.pageInfo || { hasNextPage: false, endCursor: null };
      } else if (type === 'vendors') {
        edges = result.data?.productVendors?.edges || [];
        pageInfo = result.data?.productVendors?.pageInfo || { hasNextPage: false, endCursor: null };
      } else if (type === 'types') {
        edges = result.data?.productTypes?.edges || [];
        pageInfo = result.data?.productTypes?.pageInfo || { hasNextPage: false, endCursor: null };
      }

      // Extract values directly from edges (node is the string value)
      const items = edges
        .map((edge: any) => edge.node)
        .filter((node: any) => node && typeof node === 'string')
        .sort();

      return {
        type,
        items,
        hasNextPage: pageInfo.hasNextPage || false,
        cursor: pageInfo.endCursor || null,
        append: !!cursor, // If cursor exists, we're appending to existing data
      };
    } catch (error: any) {
      console.error(`Error fetching ${type}:`, error);
      return rejectWithValue(error.message || `Failed to fetch ${type}`);
    }
  }
);

const productDataSlice = createSlice({
  name: 'productData',
  initialState,
  reducers: {
    clearProductData(state, action: PayloadAction<ProductDataType>) {
      const type = action.payload;
      state[type] = [];
      state.pagination[type] = { hasNextPage: false, cursor: null };
      state.error[type] = null;
    },
    clearAllProductData(state) {
      state.tags = [];
      state.vendors = [];
      state.types = [];
      state.pagination = {
        tags: { hasNextPage: false, cursor: null },
        vendors: { hasNextPage: false, cursor: null },
        types: { hasNextPage: false, cursor: null },
      };
      state.error = {
        tags: null,
        vendors: null,
        types: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductData.pending, (state, action) => {
        const type = action.meta.arg.type;
        state.loading[type] = true;
        state.error[type] = null;
      })
      .addCase(fetchProductData.fulfilled, (state, action) => {
        const { type, items, hasNextPage, cursor, append } = action.payload;
        state.loading[type] = false;
        
        if (append) {
          // Append new items to existing ones, avoiding duplicates
          const existingItems = new Set(state[type]);
          items.forEach((item: string) => existingItems.add(item));
          state[type] = Array.from(existingItems);
        } else {
          // Replace existing items
          state[type] = items;
        }
        
        state.pagination[type] = {
          hasNextPage,
          cursor,
        };
      })
      .addCase(fetchProductData.rejected, (state, action) => {
        const type = action.meta.arg.type;
        state.loading[type] = false;
        state.error[type] = action.payload as string || 'Failed to fetch data';
      });
  },
});

export const { clearProductData, clearAllProductData } = productDataSlice.actions;
export const productDataReducer = productDataSlice.reducer;

