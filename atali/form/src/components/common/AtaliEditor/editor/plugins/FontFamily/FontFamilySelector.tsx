//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const fontFamiliesType = [
  'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold',
  'Avant Garde', 'Baskerville', 'Bodoni MT', 'Book Antiqua', 'Big Caslon', 'Calibri', 'Calisto MT', 'Cambria', 'Candara', 'Century Gothic',
  'Charcoal', 'Copperplate',
  'Comic Sans MS', 'Courier New',
  'Didot',
  'Franklin Gothic Medium',
  'Futura', 'Geneva', 'Gill Sans', 'Garamond', 'Georgia', 'Goudy Old Style',
  'Hoefler Text',
  'Helvetica',
  'Helvetica Neue', 'Impact', 'Lucida Sans Unicode', 'Lato', 'Lucida Grande', 'Lucida Bright', 'Monaco', 'Optima', 'Papyrus',
  'PT Mono', 'Palatino', 'Perpetua', 'Rockwell', 'Roboto', 'Rockwell Extra Bold', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
];

interface FontFamilyToolConfig {
  fontFamilyList?: string[];
}

interface FontFamilySelectorProps {
  api: any;
  config: FontFamilyToolConfig;
}

const FontFamilySelector: React.FC<FontFamilySelectorProps> = ({ api, config }) => {
  const [selectedFontFamily, setSelectedFontFamily] = useState<string | undefined>(undefined);
  const fontFamilyList = config.fontFamilyList || fontFamiliesType;

  useEffect(() => {
    api.inlineToolbar.inputs.fontFamily = selectedFontFamily;
  }, [selectedFontFamily, api]);

  const handleFontFamilyChange = (value: string) => {
    setSelectedFontFamily(value);
    api.inlineToolbar.close();
  };

  return (
    <div>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a font family"
        optionFilterProp="children"
        onChange={handleFontFamilyChange}
        value={selectedFontFamily}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {fontFamilyList.map((fontFamily) => (
          <Select.Option
            key={fontFamily}
            value={fontFamily}
            style={{ fontFamily }}
          >
            {fontFamily}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default FontFamilySelector;
