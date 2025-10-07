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
import {useState, useCallback, useEffect} from 'react';

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
}

export default function WidgetRuleCondition({ condition, onRemove, onChange ,  showRemoveButton }: WidgetRuleConditionProps) {
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
    {
      "value": "variant_title",
      "label": "Variant Title"
    },
    {
      "value": "product_category",
      "label": "Category"
    },
    {
      "value": "product_price",
      "label": "Price"
    },
    {
      "value": "compare_at_price",
      "label": "Compare-at Price"
    },
    {
      "value": "inventory_quantity",
      "label": "Inventory"
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
        { value: 'contains', label: 'contains' },
        { value: 'starts_with', label: 'starts with' },
        { value: 'ends_with', label: 'ends with' },
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
        { value: 'does_not_contain', label: 'does not contain' }
      ],
      'product_type': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
        { value: 'contains', label: 'contains' },
        { value: 'starts_with', label: 'starts with' },
        { value: 'ends_with', label: 'ends with' },
        { value: 'does_not_contain', label: 'does not contain' }
      ],
      'product_vendor': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
        { value: 'contains', label: 'contains' },
        { value: 'starts_with', label: 'starts with' },
        { value: 'ends_with', label: 'ends with' },
        { value: 'does_not_contain', label: 'does not contain' }
      ],
      'variant_title': [
        { value: 'contains', label: 'contains' },
        { value: 'starts_with', label: 'starts with' },
        { value: 'ends_with', label: 'ends with' },
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
        { value: 'does_not_contain', label: 'does not contain' }
      ],
      'product_category': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' }
      ],
      'product_price': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
        { value: 'greater_than', label: 'is greater than' },
        { value: 'less_than', label: 'is less than' }
      ],
      'compare_at_price': [
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'is_not_equal_to', label: 'is not equal to' },
        { value: 'greater_than', label: 'is greater than' },
        { value: 'less_than', label: 'is less than' },
        { value: 'is_empty', label: 'is empty' },
        { value: 'is_not_empty', label: 'is not empty' }
      ],
      'inventory_quantity': [
        { value: 'greater_than', label: 'is greater than' },
        { value: 'is_equal_to', label: 'is equal to' },
        { value: 'less_than', label: 'is less than' }
      ],
      'product_tags': [
        { value: 'is_equal_to', label: 'is equal to' }
      ]
    };

    return operatorMappings[field] || operatorMappings['product_title'];
  };

  const [availableOperators, setAvailableOperators] = useState(getOperatorsForField(condition.field));
  const [isInvalid, setIsInvalid] = useState(false);
  // Update operators when field changes
  useEffect(() => {
    const operators = getOperatorsForField(condition.field);
    setAvailableOperators(operators);
    
    // Auto-select first operator if current operator is not available for new field
    if (!operators.find(op => op.value === condition.operator)) {
      onChange('operator', operators[0]?.value || 'contains');
    }
  }, []);

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
      if (isValueInvalid(value)){
      setIsInvalid(prev => !prev);
      }
    },
    [onChange]
  );

  const textFieldID = `ruleContent-${condition.id}`;
  const errorMessage = isInvalid
    ? 'Enter 3 or more characters for this condition'
    : '';

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
              <TextField 
                labelHidden
                label="Collection rule content"
                error={isInvalid}
                id={textFieldID}
                value={condition.value}
                onChange={handleValueChange}
                autoComplete="off"
              />            
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

  function isValueInvalid(content: string) {
    if (!content) {
      return true;
    }

    return content.length < 3;
  }
}