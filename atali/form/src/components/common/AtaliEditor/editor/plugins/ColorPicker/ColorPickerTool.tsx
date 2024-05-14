// ColorPickerTool.tsx
//@ts-nocheck
import ReactDOM from 'react-dom';
import ColorPicker from './ColorPicker';
import { ColorResult } from 'react-color';

class ColorPickerTool {
  static title = 'Color Picker';
  static isInline = true;

  selectedColor = '#000000';

  nodes = {
    button: null,
  };

  constructor() {
    this.nodes.button = document.createElement('div');
    this.createButton();
  }

  static get sanitize() {
    return {
      span: {
        style: true,
      },
      font:{
        style: true,
      }
    };
  }

  createButton() {
    const pickerWrapper = document.createElement('div');
    this.nodes.button.appendChild(pickerWrapper);

    ReactDOM.render(
      <ColorPicker
        color={this.selectedColor}
        onColorChange={this.applyColor}
      />,
      pickerWrapper
    );
  }

  handleColorChange = (color: ColorResult) => {
    this.selectedColor = color.hex;
  };

  applyColor = (color: any) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
  
    const range = selection.getRangeAt(0);
    if (range && !range.collapsed) {
      this.selectedColor = color.hex;
      this.surround(range);
    }
  };
  

  render() {
    return this.nodes.button;
  }

  surround(range: Range) {
    if (this.selectedColor) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('foreColor', false, this.selectedColor);
      }
    }
  }

  checkState(selection: Selection): boolean {
    const isActive = document.queryCommandState('foreColor');
    return isActive;

    if (!selection || selection.rangeCount === 0) {
      return false;
    }

    const range = selection.getRangeAt(0);
    const commonAncestorContainer = range.commonAncestorContainer;
    const parentElement =
      commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (commonAncestorContainer as HTMLElement)
        : commonAncestorContainer.parentElement;

    if (!parentElement) {
      return false;
    }

    const computedStyle = window.getComputedStyle(parentElement);
    const currentColor = computedStyle.getPropertyValue('color');

    return currentColor === this.selectedColor;
  }
}

export default ColorPickerTool;
