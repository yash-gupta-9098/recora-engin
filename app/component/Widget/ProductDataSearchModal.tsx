// ProductDataSearchModal_ALTERNATIVE.tsx
// Alternative approach: Show disabled values in separate "Unavailable" section

import {
  Modal,
  TextField,
  OptionList,
  Spinner,
  BlockStack,
  Text,
  Banner,
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
  disabledValues?: string[];
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
  disabledValues = [],
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
    
    let currentCursor = startCursor || pagination.cursor;
    let hasMore = pagination.hasNextPage;

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

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    if (value.trim() && pagination.hasNextPage && !isFetchingAllRef.current) {
      fetchAllData();
    }
  }, [fetchAllData, pagination.hasNextPage]);

  const handleSelectionChange = useCallback((selected: string[]) => {
    console.log('🔄 Selection changed:', {
      rawSelection: selected,
      disabledValues: disabledValues,
      previousSelection: localSelected
    });
    
    // Filter out disabled values from selection
    const validSelection = selected.filter((item) => !disabledValues.includes(item));
    
    console.log('  ✅ Valid selection after filtering:', validSelection);
    
    // If user tried to select a disabled value, show warning
    if (validSelection.length !== selected.length) {
      console.warn('⚠️ Attempted to select disabled values - selection blocked');
    }
    
    setLocalSelected(validSelection);
  }, [localSelected, disabledValues]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loading || isLoadingMoreRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < 100) {
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

  // Filter options: Exclude selected AND disabled values
  const filteredOptions = useMemo(() => {
    let filtered = options;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = options.filter((opt) => opt.label.toLowerCase().includes(query));
    }
    
    // Exclude BOTH selected values AND disabled values
    return filtered.filter((opt) => 
      !localSelected.includes(opt.value) && 
      !disabledValues.includes(opt.value)
    );
  }, [options, searchQuery, localSelected, disabledValues]);

  // Selected options (including search filter)
  const selectedOptions = useMemo(() => {
    let selected = localSelected.map((value) => {
      const option = options.find((opt) => opt.value === value);
      return {
        value,
        label: option?.label || value,
      };
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      selected = selected.filter((opt) => opt.label.toLowerCase().includes(query));
    }

    return selected;
  }, [localSelected, options, searchQuery]);

  // Disabled/Unavailable options
  const unavailableOptions = useMemo(() => {
    let unavailable = options.filter(opt => disabledValues.includes(opt.value));
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      unavailable = unavailable.filter((opt) => opt.label.toLowerCase().includes(query));
    }
    
    return unavailable.map(opt => ({
      ...opt,
      label: `${opt.label} (Used in another condition)`,
      disabled: true, // Still mark as disabled even though in separate section
    }));
  }, [options, disabledValues, searchQuery]);

  const disabledCount = useMemo(() => {
    return disabledValues.length;
  }, [disabledValues]);

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
        <BlockStack gap="400">
          <TextField
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={`Search ${heading.toLowerCase()}...`}
            autoComplete="off"
          />

          {disabledCount > 0 && (
            <Banner tone="info">
              {disabledCount} value{disabledCount > 1 ? 's are' : ' is'} unavailable because {disabledCount > 1 ? 'they are' : 'it is'} already used in other conditions with the same field.
            </Banner>
          )}

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
              {selectedOptions.length === 0 && filteredOptions.length === 0 && unavailableOptions.length === 0 ? (
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
                      // Selected section
                      ...(selectedOptions.length > 0 ? [{
                        title: 'Selected',
                        options: selectedOptions,
                      }] : []),
                      // Available section (excludes both selected AND disabled)
                      ...(filteredOptions.length > 0 ? [{
                        title: 'Available',
                        options: filteredOptions,
                      }] : []),
                      // Unavailable section (shows disabled values, cannot be selected)
                      ...(unavailableOptions.length > 0 ? [{
                        title: 'Unavailable',
                        options: unavailableOptions,
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