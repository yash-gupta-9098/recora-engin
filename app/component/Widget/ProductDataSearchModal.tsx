import {
  Modal,
  TextField,
  OptionList,
  Spinner,
  BlockStack,
  Text,
} from '@shopify/polaris';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'app/redux/store/store';
import { fetchProductData, ProductDataType } from 'app/redux/slices/productDataSlice';

interface ProductDataSearchModalProps {
  open: boolean;
  onClose: () => void;
  field: 'product_vendor' | 'product_type' | 'product_tags';
  selectedValues: string[];
  onSelect: (values: string[]) => void;
  heading: string;
}

const fieldToDataType: Record<string, ProductDataType> = {
  product_vendor: 'vendors',
  product_type: 'types',
  product_tags: 'tags',
};

export default function ProductDataSearchModal({
  open,
  onClose,
  field,
  selectedValues,
  onSelect,
  heading,
}: ProductDataSearchModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const dataType = fieldToDataType[field];
  
  const { items, loading, error, pagination } = useSelector((state: RootState) => ({
    items: state.productData[dataType],
    loading: state.productData.loading[dataType],
    error: state.productData.error[dataType],
    pagination: state.productData.pagination[dataType],
  }));

  const [searchQuery, setSearchQuery] = useState('');
  const [localSelected, setLocalSelected] = useState<string[]>(selectedValues);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingMoreRef = useRef(false);
  const isFetchingAllRef = useRef(false);

  // Convert items to OptionList format
  const options = useMemo(() => {
    return items.map((item) => ({
      value: item,
      label: item,
    }));
  }, [items]);

  // Fetch initial data when modal opens (only if not already loaded)
  useEffect(() => {
    if (open && dataType) {
      // Only fetch if we don't have data - keep Redux cache
      if (items.length === 0) {
        dispatch(fetchProductData({ type: dataType, search: '', limit: 10 }));
      }
      setSearchQuery('');
      setLocalSelected(selectedValues);
    }
  }, [open, dataType, dispatch, selectedValues, items.length]);

  // Function to fetch all data until cursor is empty
  const fetchAllData = useCallback(async (startCursor?: string | null) => {
    if (isFetchingAllRef.current) return;
    
    isFetchingAllRef.current = true;
    
    // Use provided cursor or get from current pagination
    let currentCursor = startCursor || pagination.cursor;
    let hasMore = pagination.hasNextPage;

    // Keep fetching until no more pages
    while (hasMore && currentCursor) {
      const result = await dispatch(
        fetchProductData({
          type: dataType,
          search: '',
          cursor: currentCursor,
          limit: 10,
        })
      );

      if (fetchProductData.fulfilled.match(result)) {
        currentCursor = result.payload.cursor;
        hasMore = result.payload.hasNextPage;
      } else {
        break;
      }
    }

    isFetchingAllRef.current = false;
  }, [dataType, dispatch, pagination.cursor, pagination.hasNextPage]);

  // Handle search change - fetch all data when search is clicked
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    // When user types in search, fetch all remaining data if not already fetched
    if (value.trim() && pagination.hasNextPage && !isFetchingAllRef.current) {
      fetchAllData();
    }
  }, [fetchAllData, pagination.hasNextPage]);

  const handleSelectionChange = useCallback((selected: string[]) => {
    // Find what was unselected (removed from localSelected)
    const unselected = localSelected.filter((item) => !selected.includes(item));
    
    // Update localSelected with new selection
    setLocalSelected(selected);
    
    // Note: Unselected items will automatically appear in filteredOptions
    // because filteredOptions excludes items in localSelected
  }, [localSelected]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loading || isLoadingMoreRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Load more when user scrolls near bottom (within 100px)
    if (scrollHeight - scrollTop - clientHeight < 100) {
      // Load more if there's a next page and cursor exists
      if (pagination.hasNextPage && pagination.cursor) {
        isLoadingMoreRef.current = true;
        dispatch(
          fetchProductData({
            type: dataType,
            search: '',
            cursor: pagination.cursor,
            limit: 10,
          })
        ).finally(() => {
          isLoadingMoreRef.current = false;
        });
      }
    }
  }, [pagination.hasNextPage, pagination.cursor, loading, dataType, dispatch]);

  const handleApply = useCallback(() => {
    onSelect(localSelected);
    onClose();
  }, [localSelected, onSelect, onClose]);

  const handleCancel = useCallback(() => {
    setLocalSelected(selectedValues);
    setSearchQuery('');
    onClose();
  }, [selectedValues, onClose]);

  // Filter options based on search (client-side filtering)
  // Exclude selected values from filtered options
  const filteredOptions = useMemo(() => {
    let filtered = options;
    
    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = options.filter((opt) => opt.label.toLowerCase().includes(query));
    }
    
    // Exclude selected values from filtered options
    return filtered.filter((opt) => !localSelected.includes(opt.value));
  }, [options, searchQuery, localSelected]);

  // Convert localSelected to options format
  const selectedOptions = useMemo(() => {
    let selected = localSelected.map((value) => {
      // Try to find in options to get label, otherwise use value as label
      const option = options.find((opt) => opt.value === value);
      return {
        value,
        label: option?.label || value,
      };
    });

    // Apply search filter to selected options if search query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      selected = selected.filter((opt) => opt.label.toLowerCase().includes(query));
    }

    return selected;
  }, [localSelected, options, searchQuery]);

  // Handle tab change
 

  // Note: Scroll handler is attached directly to div via onScroll prop

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={heading}
      primaryAction={{
        content: 'Apply',
        onAction: handleApply,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleCancel,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack >
          <TextField
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={`Search ${heading.toLowerCase()}...`}
            autoComplete="off"
          />

          {loading && items.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <Spinner size="small" />
            </div>
          ) : error ? (
            <Text as="p" tone="critical">
              {error}
            </Text>
          ) : (
            <>
              {/* Build sections conditionally - only show if they have options */}
              {selectedOptions.length === 0 && filteredOptions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Text as="p" tone="subdued">
                      No {heading.toLowerCase()} found{searchQuery ? ` matching "${searchQuery}"` : ''}
                    </Text>
                </div>
              ) : (
                <div 
                  ref={scrollContainerRef}
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                  onScroll={handleScroll}
                >
                  <OptionList
                    selected={localSelected}
                    sections={[
                      // Only add Selected section if it has options
                      ...(selectedOptions.length > 0 ? [{
                        title: 'Selected',
                        options: selectedOptions,
                      }] : []),
                      // Only add Available section if it has options
                      ...(filteredOptions.length > 0 ? [{
                        title: 'Available',
                        options: filteredOptions,
                      }] : []),
                    ]}
                    onChange={handleSelectionChange}
                    allowMultiple
                  />
                  {loading && pagination.hasNextPage && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <Spinner size="small" />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

