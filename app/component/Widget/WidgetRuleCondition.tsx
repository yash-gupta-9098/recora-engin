import {
  LegacyStack,
  FormLayout,
  Select,
  TextField,
  InlineError,
  Button,
  LegacyCard,
  InlineStack,
  InlineGrid,
  BlockStack,
} from '@shopify/polaris';
import {DeleteIcon} from '@shopify/polaris-icons';
import {useState, useCallback, useEffect, useMemo} from 'react';
import ProductDataSearchModal from './ProductDataSearchModal';


interface WidgetRuleConditionProps {
  condition: {
    id: string;
    field: string;
    operator: string;
    value: string;
  };
  showRemoveButton?: boolean;
  onRemove: () => void;
  onChange: (field: 'field' | 'operator' | 'value', value: string) => void;
  validationError?: string;
  isValueDisabled?: boolean;
}

export default function WidgetRuleCondition({ condition, onRemove, onChange ,  showRemoveButton, validationError, isValueDisabled = false }: WidgetRuleConditionProps) {
  const availableFields = [
    {
      "value": "product_title",
      "label": "Title"
    },
    {
      "value": "product_type",
      "label": "Type"
    },
    {
      "value": "product_vendor",
      "label": "Vendor"
    },
    // {
    //   "value": "product_category",
    //   "label": "Category"
    // },
    {
      "value": "product_price",
      "label": "Price"
    },
    {
      "value": "product_tags",
      "label": "Tag"
    }
  ];

  // Define field-operator mappings based on your requirements
  const getOperatorsForField = (field: string) => {
    const operatorMappings: Record<string, Array<{value: string, label: string}>> = {
      'product_title': [
        { value: 'contains', label: 'contains' }
      ],
      'product_type': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' }
      ],
      'product_vendor': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
      ],

      // 'product_category': [
      //   { value: 'is_equal_to', label: 'is equal to' },
      //   { value: 'is_not_equal_to', label: 'is not equal to' }
      // ],
      'product_price': [
        { value: 'greater_than', label: 'is greater than' },
        { value: 'less_than', label: 'is less than' }
      ],
      'product_tags': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
      ]
    };

    return operatorMappings[field] || operatorMappings[field];
  };

  const [availableOperators, setAvailableOperators] = useState(getOperatorsForField(condition.field));
  const [isInvalid, setIsInvalid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Validate value based on field type
  const isValueValidForField = useCallback((value: string, field: string): boolean => {
    if (!value || value.trim().length === 0) {
      return false;
    }
    
    // For modal fields (vendors, types, tags), check if at least one value is selected
    if (['product_vendor', 'product_type', 'product_tags'].includes(field)) {
      const values = value.split(',').map(v => v.trim()).filter(v => v.length > 0);
      return values.length > 0;
    }
    
    // For price field, check if it's a valid number
    if (field === 'product_price') {
      const numValue = parseFloat(value.replace('$', '').trim());
      return !isNaN(numValue) && numValue >= 0;
    }
    
    // For text fields (like product_title), require at least 3 characters
    return value.trim().length >= 3;
  }, []);
  
  // Update operators when field changes
  useEffect(() => {
    const operators = getOperatorsForField(condition.field);
    setAvailableOperators(operators);
    
    // Auto-select first operator if current operator is not available for new field
    if (!operators.find(op => op.value === condition.operator)) {
      onChange('operator', operators[0]?.value || 'contains');
    }
    
    // Clear value when field changes to ensure proper validation
    if (condition.value) {
      const isValid = isValueValidForField(condition.value, condition.field);
      setIsInvalid(!isValid);
    }
  }, [condition.field, condition.value, condition.operator, isValueValidForField, onChange]);
  
  // Validate value when it changes
  useEffect(() => {
    const isValid = isValueValidForField(condition.value, condition.field);
    setIsInvalid(!isValid);
  }, [condition.value, condition.field, isValueValidForField]);

  const handleFieldChange = useCallback(
    (value: string) => {
      onChange('field', value);
    },
    [onChange]
  );

  const handleOperatorChange = useCallback(
    (value: string) => {
      onChange('operator', value);
    },
    [onChange]
  );

  const handleValueChange = useCallback(
    (value: string) => {
      onChange('value', value);
    },
    [onChange]
  );
  
  // Parse selected values from string (comma-separated)
  const selectedValues = useMemo(() => {
    if (!condition.value) return [];
    try {
      // Try parsing as JSON first (for array format)
      const parsed = JSON.parse(condition.value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // If not JSON, treat as comma-separated string
    }
    // Split by comma and trim
    return condition.value.split(',').map(v => v.trim()).filter(v => v.length > 0);
  }, [condition.value]);
  
  // Handle modal selection for multi-select fields
  const handleModalSelect = useCallback((values: string[]) => {
    // Store as comma-separated string
    const valueString = values.join(', ');
    onChange('value', valueString);
  }, [onChange]);
  
  // Get field label for modal
  const getFieldLabel = (field: string) => {
    const fieldMap: Record<string, string> = {
      'product_vendor': 'Vendors',
      'product_type': 'Types',
      'product_tags': 'Tags',
    };
    return fieldMap[field] || 'Values';
  };
  
  // Check if field requires modal
  const requiresModal = ['product_vendor', 'product_type', 'product_tags'].includes(condition.field);
  
  // Check if field is price (needs prefix and number type)
  const isPriceField = condition.field === 'product_price';

  const textFieldID = `ruleContent-${condition.id}`;
  const errorMessage = validationError || (isInvalid
    ? (requiresModal 
        ? 'Please select at least one value' 
        : isPriceField 
        ? 'Please enter a valid price' 
        : 'Enter 3 or more characters for this condition')
    : '');

  const formGroupMarkup = (
    <>
      <FormLayout>  
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' , gap: '10px'}}> 
          <div style={{display: 'flex', flexDirection: 'column' , flexGrow: 1}}>
            <FormLayout.Group condensed>
              <Select
                labelHidden
                label="Collection rule type"
                options={availableFields}
                value={condition.field}
                onChange={handleFieldChange}
              />
              <Select
                labelHidden
                label="Collection rule condition"
                options={availableOperators}
                value={condition.operator}
                onChange={handleOperatorChange}
              />

              {requiresModal ? (
                <>
                  <div 
                    onClick={() => !isValueDisabled && setModalOpen(true)} 
                    style={{ cursor: isValueDisabled ? 'not-allowed' : 'pointer', width: '100%', opacity: isValueDisabled ? 0.6 : 1 }}
                  >
                    <TextField
                      labelHidden
                      label="Collection rule content"
                      error={isInvalid}
                      id={textFieldID}
                      value={condition.value || ''}
                      onChange={() => {}} // Read-only, opens modal on click
                      onFocus={() => !isValueDisabled && setModalOpen(true)}
                      placeholder={isValueDisabled ? "Same condition already exists" : "Click to select values"}
                      autoComplete="off"
                      readOnly
                      disabled={isValueDisabled}
                    />
                  </div>
                  {!isValueDisabled && (
                    <ProductDataSearchModal
                      open={modalOpen}
                      onClose={() => setModalOpen(false)}
                      field={condition.field as 'product_vendor' | 'product_type' | 'product_tags'}
                      selectedValues={selectedValues}
                      onSelect={handleModalSelect}
                      heading={getFieldLabel(condition.field)}
                    />
                  )}
                </>
              ) : isPriceField ? (
                <TextField
                  labelHidden
                  label="Collection rule content"
                  error={isInvalid}
                  id={textFieldID}
                  value={condition.value || ''}
                  onChange={handleValueChange}
                  prefix="$"
                  type="number"
                  autoComplete="off"
                  placeholder={isValueDisabled ? "Same condition already exists" : "0.00"}
                  disabled={isValueDisabled}
                />
              ) : (
                <TextField
                  labelHidden
                  label="Collection rule content"
                  error={isInvalid}
                  id={textFieldID}
                  value={condition.value || ''}
                  onChange={handleValueChange}
                  autoComplete="off"
                  placeholder={isValueDisabled ? "Same condition already exists" : "Enter value"}
                  disabled={isValueDisabled}
                />
              )}
            </FormLayout.Group>
            
            <div style={{marginTop: '4px'}}>
              <InlineError message={errorMessage} fieldID={textFieldID} />
            </div>
          </div>
          
          
          <Button 
            icon={DeleteIcon} 
            accessibilityLabel="Remove condition" 
            onClick={onRemove}
          /> 


        </div>         
      </FormLayout>
    </>
  );

  return (
    <FormLayout>{formGroupMarkup}</FormLayout>    
  );
}