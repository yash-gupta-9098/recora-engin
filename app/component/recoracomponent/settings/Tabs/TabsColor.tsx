import {
  Box,
  BlockStack,
  Collapsible,
  InlineGrid,
  InlineStack,
  Text,
  Icon,
} from '@shopify/polaris';
import { ChevronDownIcon, ChevronUpIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import ColorScheme from '../../ColorScheme';

interface TabsColorProps {
  settingfromDb: {
    colorScheme: Record<string, any>;
    
  };
  dispatch: React.Dispatch<any>;
}

export const TabsColor: React.FC<TabsColorProps> = ({ settingfromDb , dispatch }) => {
  const [openSection, setOpenSection] = useState<'Primary' | 'Secondary'>('Primary');

  // const [selectedColorSchemes, setSelectedColorSchemes] = useState<Record<string, any>>(
  //   settingfromDb.colorScheme || {}
  // );

  const handleToggle = (section: 'Primary' | 'Secondary') => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <Box
            as="ul"
            style={{ maxHeight: '600px', overflowY: 'scroll' }}
            borderStyle="solid"
            // minHeight='600px'
            overflowY='scroll'
        >
      {(['Primary', 'Secondary'] as const).map((type) => {
        const isOpen = openSection === type;
        const colorScheme = type === 'Primary' ? 'Scheme 1' : 'Scheme 2';

        return (
          
            <Box as="li" key={type} borderStyle="solid" printHidden={false} visuallyHidden={false} borderBlockEndWidth='025' borderColor='border-secondary'>
            <Box
              as="div"
              padding={"300"}
              onClick={() => handleToggle(type)}
              background={isOpen ? 'bg-fill-secondary' : 'bg-fill'}
              cursor="pointer"
            >
              <InlineStack gap="200" align="space-between">
                <InlineStack gap="100" blockAlign="center">
                  <Text as="h3" variant="headingSm" fontWeight="bold">
                    {type}
                  </Text>
                </InlineStack>
                <InlineGrid alignItems="end">
                  <Icon
                    source={isOpen ? ChevronUpIcon : ChevronDownIcon}
                    tone="base"
                  />
                </InlineGrid>
              </InlineStack>
            </Box>

            <Collapsible open={isOpen} expandOnPrint transition>
              <Box paddingBlock={400} paddingInline={300} position="relative" borderBlockStartWidth='025' borderColor='border-inverse'>
                <BlockStack gap="300">
                  <ColorScheme
                    colorScheme={colorScheme} // ✅ Pass "Scheme 1" or "Scheme 2"
                    setColorScheme={() => {}}   // no-op since it's fixed now
                    selectedColorSchemes={settingfromDb.colorScheme}
                    dispatch ={dispatch}
                    
                  />
                </BlockStack>
              </Box>
            </Collapsible>
            </Box>  
          
        );
      })}
    </Box>
  );
};

export default TabsColor;
