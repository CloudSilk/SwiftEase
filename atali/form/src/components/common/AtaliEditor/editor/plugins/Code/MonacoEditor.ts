//@ts-nocheck
import EditorJS,{ EditorTool } from '@editorjs/editorjs';
import * as monaco from 'monaco-editor';

export interface MonacoEditorData {
    code: string;
    language: string;
}

export interface MonacoEditorConfig {
    defaultLanguage?: string;
    availableLanguages?: string[]; // 添加可选的语言列表
}

export class MonacoEditor implements EditorTool {
    static get isReadOnlySupported() {
        return true;
    }

    static get toolbox() {
        return {
            title: 'Monaco',
            icon: '<svg>...</svg>', // 你可以使用一个 SVG 图标
            settings: true,
        };
    }

    private container: HTMLElement;
    private editor: monaco.editor.IStandaloneCodeEditor;
    private selectedLanguage: string

    constructor(private readonly data: MonacoEditorData, private readonly api: any, private readonly config: MonacoEditorConfig) {
        this.container = document.createElement('div');
        this.container.style.height = '300px';

        setTimeout(() => {
            this.editor = monaco.editor.create(this.container, {
                value: this.data.code,
                language: this.data.language,
                theme: 'vs-dark',
            });

            // 添加键盘事件监听器
            this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => { }, 'Enter');
            this.editor.onKeyDown((event: monaco.IKeyboardEvent) => this.onKeyDown(event));
        }, 100);

    }

    renderSettings() {
        return this.data.config.availableLanguages?.map(language => ({
            name: language,
            //   icon: tune.icon,
            label: language,
            isActive: this.data.language === language,
            closeOnActivate: true,
            onActivate: () => {
                this.selectedLanguage = language;
                this.editor.setModel(monaco.editor.createModel(this.editor.getValue(), language));
            },
        }));
    }


    private onKeyDown(event: monaco.IKeyboardEvent) {
        // 当按下 Enter 键时
        if (event.code === 'Enter') {
            // 阻止事件冒泡，以免 Editor.js 响应 Enter 键
            event.stopPropagation();
        }
    }


    render() {
        return this.container;
    }

    async save() {
        const code = this.editor.getValue();
        return {
            code,
            language: this.selectedLanguage,
        };
    }
}


export const colorButton = {
    class: 'color',
    icon: '<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6 0C2.69 0 0 2.69 0 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 11C3.79 11 2 9.21 2 6s1.79-5 4-5 4 1.79 4 5-1.79 5-4 5z"/></svg>',
    title: 'Change color',
    api: {
      // 修改文本颜色的API
      exec: (editor: EditorJS) => {
        const selectedText = editor.selection.getText();
        const newBlock = editor.blocks.getCurrentBlock();
        const newBlockIndex = editor.blocks.getCurrentBlockIndex();
        const newBlockLength = newBlock.text.length;
        const newBlockText = newBlock.text + selectedText;
        const newBlockData = {
          ...newBlock.data,
          color: 'red', // 修改颜色为红色
        };
        editor.blocks.insert(
          newBlockText,
          newBlockIndex,
          newBlockData,
        );
        editor.blocks.delete(newBlockIndex + 1, newBlockLength);
      },
    },
  };
  
  // 在inline-toolbar中添加colorButton
  const editor = new EditorJS({
    // ...
    tools: {
      // ...
      inlineToolbar: {
        // ...
        buttons: [
          // ...
          colorButton,
        ],
      },
    },
  });

export default MonacoEditor

