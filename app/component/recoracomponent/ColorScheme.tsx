import {
  BlockStack,
  Box,
  Button,
  Divider,
  Grid,
  InlineGrid,
  InlineStack,
  Text,
} from '@shopify/polaris';
import { ChevronLeftIcon } from '@shopify/polaris-icons';
import ColorPickerPopover from './ColorPickerPopover'; // Adjust the path as needed
import React from 'react';


// Type for the color values (assuming they're strings like hex or rgba)
type ColorValue = string;

// Keys for your color scheme object
interface ColorSchemeValues {
  background: ColorValue;
  text: ColorValue;
  text_Secondary: ColorValue;
  border: ColorValue;
  primary_Outline_Button: ColorValue;
  secondary_Outline_Button: ColorValue;
  secondary_Button: ColorValue;
  secondary_Button_Label: ColorValue;
  primary_Button_Label: ColorValue;
  primary_Button: ColorValue;
  [key: string]: ColorValue; // For dynamic keys
}

// Type for the map of color schemes
type SelectedColorSchemes = Record<string, ColorSchemeValues>;

// Props for the component
interface ColorSchemeProps {
  colorScheme: string | null;
  setColorScheme: (value: string | null) => void;
  selectedColorSchemes: SelectedColorSchemes;
  dispatch: React.Dispatch<any>;
}

export const ColorScheme: React.FC<ColorSchemeProps> = ({
  colorScheme , selectedColorSchemes ,
  dispatch
}) => {
  if (!colorScheme || !selectedColorSchemes[colorScheme]) {
    return null; // If color scheme is not selected, return nothing
  }



  const schemeColors = selectedColorSchemes[colorScheme];
  // console.log(  'schemeColors', schemeColors);

  const {
    background,
    text,
    text_Secondary,
    card_border, 
    button_background,
    button_text,
    button_outline,
  } = schemeColors;

  return (
    
      <Box padding={300}>
        <BlockStack gap="300">         

          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: `${background}`,
                  border: `1px solid ${card_border}`,
                  borderRadius: 'var(--p-border-radius-100)',
                  padding: 'var(--p-space-200)',
                }}
              >
                <InlineGrid gap="100" columns={2} alignItems="center">
                  <Text
                    as="h3"
                    variant="headingLg"
                    fontWeight="bold"
                    alignment="end"
                  >
                    <p style={{ color: `${text}` }}>A</p>
                  </Text>
                  <Text as="h4" variant="headingLg" fontWeight="bold">
                    <p style={{ color: `${text_Secondary}` }}>a</p>
                  </Text>
                  <Box
                    style={{
                      padding: '2px',
                      borderRadius: 'var(--p-border-radius-100)',
                      border: `1px solid ${button_outline}`,
                      background: `${button_background}`,
                      width:"28px",
                      textAlign:"center"
                    }}
                  />
                  {/* <Box
                    style={{
                      padding: '2px',
                      borderRadius: 'var(--p-border-radius-100)',
                      border: `1px solid ${button_outline}`,
                      background: `${button_background}`,
                    }}
                  /> */}
                </InlineGrid>
              </Box>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8, xl: 8 }}>
              <Text as="p" variant="headingXs">
                Editing this scheme&apos;s colors for widgets
              </Text>
            </Grid.Cell>
          </Grid>

          <Divider />

          <BlockStack gap="300">
            {Object.entries(schemeColors).map(([key, value]) => (
              <ColorPickerPopover
                key={key}
                label={key}
                colorValue={value}
                onChange={(newColor: string) => dispatch({ type: "UPDATE_COLOR_SCHEME", schemeName: colorScheme,  payload: { [key] : newColor } })}
                //   {
                  
                //   setSelectedColorSchemes((prev) => ({
                //     ...prev,
                //     [colorScheme]: {
                //       ...prev[colorScheme],
                //       [key]: newColor,
                //     },
                //   }));
                // }
              
              
              />
            ))}
          </BlockStack>
        </BlockStack>
      </Box>
    
  );
};

export default ColorScheme;
