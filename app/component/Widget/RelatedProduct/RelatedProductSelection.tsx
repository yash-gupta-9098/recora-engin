import { Autocomplete, BlockStack, ExceptionList, Icon, InlineStack, Tag, Text, Tooltip } from "@shopify/polaris";
import { AlertBubbleIcon, CaretDownIcon, NoteIcon, PlusCircleIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useMemo } from "react";

function RelatedProductSelection() {
  const initialOptions = useMemo(
    () => [
      { label: "Collection", value: "collection" },
      { label: "Product Type", value: "productType" },
      { label: "Product Vendor", value: "vendor" },
      { label: "Product Tag", value: "tag" },
      { label: "Product Category", value: "category" },
      { label: "Product Variant", value: "variant" },
      { label: "Less than Price", value: "ltPrice" },
      { label: "Greater than Price", value: "gtPrice" },
    ],
    []
  );

  const [selectedValues, setSelectedValues] = useState<string[]>(["collection"]);
  const [availableOptions, setAvailableOptions] = useState(initialOptions);

  const handleRemoveTag = useCallback(
    (tag: string) => () => {
      const updated = [...selectedValues];
      updated.splice(updated.indexOf(tag), 1);
      setSelectedValues(updated);
    },
    [selectedValues]
  );

  

  const handleSelect = useCallback(
    (selected: string[]) => {
      const selectedLabels = selected.map((item) => {
        const match = availableOptions.find((option) =>
          option.value.match(item)
        );
        return match && match.label;
      });

      setSelectedValues(selected);
      setSearchValue(selectedLabels[0] || "");
    },
    [availableOptions]
  );

  const hasSelected = selectedValues.length > 0;

  const tagsMarkup = hasSelected
    ? selectedValues.map((value) => {
        const label = titleCase(value.replace("_", " "));
        return (
          <Tag key={value} onRemove={handleRemoveTag(value)}>
            {label}
          </Tag>
        );
      })
    : null;

  const textField = (
    <>
    
    <Autocomplete.TextField
      label=""
      value={""}
      placeholder={availableOptions.length == selectedValues.length && `All conditions Picked` || `Pick one or more conditions to show related products`}
      suffix={<Icon source={CaretDownIcon} tone="base" />}
      autoComplete="off"
      disabled={availableOptions.length == selectedValues.length}
    />
    </>
  );

  return (
    <>
    <BlockStack gap="0">    
    <Text as="p" fontWeight="semibold">Show related products By </Text> 
    <InlineStack align="start" gap="0" wrap={false} blockAlign="center">
      <Text as="p" variant="bodySm"><Icon source={AlertBubbleIcon} tone="info"/></Text>
      <Text as="p" fontWeight="regular" variant="bodySm">Priority follows the order below.</Text>     
    </InlineStack> 
    </BlockStack>   
    {hasSelected && <InlineStack gap="200" align="start" >{tagsMarkup}</InlineStack>}
    {/* <ExceptionList
      items={[
        {
          icon: AlertBubbleIcon,
          description:
            'Priority follows the order above.',
        },
      ]}
    /> */}
    <div style={{ width: "200px" }}>
      <Autocomplete
    //   actionBefore={{
    //       accessibilityLabel: 'Action label',
    //       badge: {
    //         tone: 'new',
    //         content: 'New!',
    //       },
    //       content:
    //         'Pick one or more conditions to show related products. Priority follows the order above.',
    //       ellipsis: true,
    //       helpText: 'Help text',
    //       icon: PlusCircleIcon,
    //       wrapOverflow: true,
    //       onAction: () => {
    //         console.log('actionBefore clicked!');
    //       },
    //     }}
        options={availableOptions}
        allowMultiple
        selected={selectedValues}
        onSelect={handleSelect}
        textField={textField}
      />      
    </div>
    </>
  );
}

export default RelatedProductSelection;

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
}
