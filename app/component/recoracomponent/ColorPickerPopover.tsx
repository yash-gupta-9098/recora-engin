import {
  Box,
  ColorPicker,
  Popover,
  rgbToHsb,
  hsbToRgb,
  TextField,
} from '@shopify/polaris';
import React, { useEffect, useState } from 'react'

// ---- Types ----

interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface ColorPickerPopoverProps {
  label: string;
  colorValue: string;
  onChange: (newColor: string) => void;
}

// ---- Component ----

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  label,
  colorValue,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<string>(colorValue);
  const [error, setError] = useState<string>("");
  const [contrastColor, setContrastColor] = useState<
    ReturnType<typeof rgbToHsb> | undefined
  >(undefined);

  // ---- Util Functions ----

  function rgbaToHex(r: number, g: number, b: number, a: number): string {
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    a = Math.max(0, Math.min(1, a));

    const redHex = r.toString(16).padStart(2, '0');
    const greenHex = g.toString(16).padStart(2, '0');
    const blueHex = b.toString(16).padStart(2, '0');
    const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');

    return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
  }

  function hexToRgba(hex: string): RGBA {
    hex = hex.replace(/^#/, '');

    if ([1, 2, 3, 4].includes(hex.length)) {
      hex = hex.split('').map((c) => c + c).join('');
    }

    if (hex.length === 6) {
      hex += 'FF';
    }

    if (hex.length !== 8) {

      setError("Invalid color format #RRGGBBAA");
      // throw new Error('Invalid hex color format. Expected #RRGGBBAA');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = parseInt(hex.substring(6, 8), 16) / 255;

    return { red: r, green: g, blue: b, alpha: a };
  }

  // ---- Effects ----

  useEffect(() => {
    const rgba = hexToRgba(color);
    setContrastColor(rgbToHsb(rgba));
  }, [color]);

  useEffect(() => {
    if (color !== colorValue) {
    onChange(color);
  }
  }, [color, colorValue]);

  // ---- Handlers ----

  const handleColor = (value: string) => {
    setColor(value);
    setError("");
  };

  const handleColor2 = (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const rgba = hexToRgba(e.target.value);
      const hex = rgbaToHex(rgba.red, rgba.green, rgba.blue, rgba.alpha);
      setColor(hex);
      setError("");
    } catch (error) {
      console.warn('Invalid color format:', e.target.value);
    }
  };

  const handleContrastColor = (value: ReturnType<typeof rgbToHsb>) => {
    setContrastColor(value);
    const rgba = hsbToRgb(value);
    const hex = rgbaToHex(rgba.red, rgba.green, rgba.blue, rgba.alpha);
    setColor(hex);
    setError("");
  };

  return (
    <Popover
      active={isOpen}
      activator={
        <TextField
          label={
            <div style={{ textTransform: 'capitalize' }}>
              {label.replace(/_/g, ' ')}
            </div>
          }
          prefix={
            <Box
              as="span"
              style={{
                width: '20px',
                height: '20px',
                background: color,
                borderRadius: '50%',
                display: 'block',
              }}
            />
          }
          value={color}
          onFocus={() => setIsOpen(true)}
          onChange={handleColor}
          onBlur={handleColor2}
          error={error}
        />
      }
      onClose={() => setIsOpen(false)}
    >
      <Box padding={300}>
        {contrastColor && (
          <ColorPicker
            color={contrastColor}
            onChange={handleContrastColor}
            allowAlpha
          />
        )}
      </Box>
    </Popover>
  );
};

export default ColorPickerPopover;
