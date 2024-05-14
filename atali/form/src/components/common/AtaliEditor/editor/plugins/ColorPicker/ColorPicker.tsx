//@ts-nocheck
import { Button } from 'antd';
import React, { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import './ColorPicker.less'

interface ColorPickerProps {
  color: string;
  onColorChange: (color: ColorResult) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onColorChange }) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
  };

  return (
    <div>
      <Button onClick={togglePicker} type="text" style={{ color: color }}>Aa</Button>
      {pickerVisible && (
        <SketchPicker style="position:absolute;" color={color} onChangeComplete={onColorChange} />
      )}
    </div>
  );
};

export default ColorPicker;
