

//@ts-nocheck
type FontSizeOption = {
    label: string;
    value: string;
};

export class FontSizeTool {
    static title = 'Font Size';
    isDropDownOpen = false;
    togglingCallback: ((opened: boolean) => void) | null = null;
    emptyString = '&nbsp;&nbsp';
    fontSizeDropDown = 'font-size-dropdown';

    static get sanitize() {
        return {
            span: {
                style: true,
                class: "font-size-tool",
            },
            font: {
                style: true,
                class: "font-size-tool",
            }
        };
    }
    static get isInline() {
        return true;
    }
    commandName = 'fontSize';

    CSS = {
        button: 'ce-inline-tool',
        buttonActive: 'ce-font-size-tool--active',
        buttonModifier: 'ce-inline-tool--font',
    };
    nodes = {
        button: undefined as HTMLElement | undefined,
    };
    selectedFontSize: string | null = null;

    selectionList: HTMLElement | undefined;

    buttonWrapperText: HTMLElement | undefined;

    createSvg: HTMLElement | undefined;
    api: any
    constructor({ api }) {
        this.api = api;
        console.log(api)
    }

    make(tagName: string, classNames: string | string[] | null = null): HTMLElement {
        const el = document.createElement(tagName);

        if (Array.isArray(classNames)) {
            el.classList.add(...classNames);
        } else if (classNames) {
            el.classList.add(classNames);
        }
        return el;
    }

    createButton(): void {
        this.nodes.button = this.make('button', [this.CSS.button, this.CSS.buttonModifier]);
        this.nodes.button.type = 'button';
        this.nodes.button.setAttribute('id', 'fontSizeBtn');
        this.getFontSizeForButton();
        this.createSvg = this.svg('toggler-down', 13, 13);
        this.nodes.button.appendChild(this.createSvg);
    }
    getFontSizeForButton(): void {
        this.buttonWrapperText = this.make('div', 'button-wrapper-text');
        const displaySelectedFontSize = this.make('div');
        displaySelectedFontSize.setAttribute('id', this.fontSizeDropDown);
        displaySelectedFontSize.innerHTML = this.emptyString;
        this.buttonWrapperText.append(displaySelectedFontSize);
        this.nodes.button!.append(this.buttonWrapperText);
    }

    addFontSizeOptions(): void {
        const fontSizeList: FontSizeOption[] = [
            // { label: '12px', value: '12px' },
            // { label: '13px', value: '13px' },
            // { label: '14px', value: '14px' },
            // { label: '15px', value: '15px' },
            // { label: '16px', value: '16px' },
            // { label: '19px', value: '19px' },
            // { label: '22px', value: '22px' },
            // { label: '24px', value: '24px' },
            // { label: '29px', value: '29px' },
            // { label: '32px', value: '32px' },
            // { label: '40px', value: '40px' },
            // { label: '48px', value: '48px' },
            { label: '10', value: '1' },
            { label: '13', value: '2' },
            { label: '16', value: '3' },
            { label: '18', value: '4' },
            { label: '24', value: '5' },
            { label: '32', value: '6' },
            { label: '48', value: '7' },
        ];
        this.selectionList = this.make('div', 'selectionList');
        const selectionListWrapper = this.make('div', 'selection-list-wrapper');

        for (const fontSize of fontSizeList) {
            const option = this.make('div');
            option.setAttribute('value', fontSize.value);
            option.setAttribute('id', fontSize.value);
            option.classList.add('selection-list-option');
            if (
                (document.getElementById(this.fontSizeDropDown)!.innerHTML === fontSize.label) ||
                (this.selectedFontSize === fontSize.value)
            ) {
                option.classList.add('selection-list-option-active');
            }
            option.innerHTML = fontSize.label;
            selectionListWrapper.append(option);
        }
        this.selectionList.append(selectionListWrapper);
        this.nodes.button!.append(this.selectionList);
        this.selectionList.addEventListener('click', this.toggleFontSizeSelector);

        setTimeout(() => {
            if (typeof this.togglingCallback === 'function') {
                this.togglingCallback(true);
            }
        }, 50);
    }

    toggleFontSizeSelector = (event: MouseEvent): void => {
        this.selectedFontSize = (event.target as HTMLElement).id;
        this.toggle();
    };

    removeFontSizeOptions(): void {
        if (this.selectionList) {
            this.isDropDownOpen = false;
            this.selectionList = this.selectionList.remove() as HTMLElement | undefined;
        }
        if (typeof this.togglingCallback === 'function') {
            this.togglingCallback(false);
        }
    }

    render(): HTMLElement | undefined {
        this.createButton();
        this.nodes.button!.addEventListener('click', this.toggleDropDown);
        return this.nodes.button;
    }

    toggleDropDown = ($event: MouseEvent): void => {
        if (
            ($event.target as HTMLElement).id === this.fontSizeDropDown ||
            ($event.target as HTMLElement).parentNode!.id === 'fontSizeBtn' ||
            ($event.target as HTMLElement).id === 'fontSizeBtn'
        ) {
            this.toggle((toolbarOpened) => {
                if (toolbarOpened) {
                    this.isDropDownOpen = true;
                }
            });
        }
    };

    toggle(togglingCallback?: (opened: boolean) => void): void {
        if (!this.isDropDownOpen && togglingCallback) {
            this.addFontSizeOptions();
        } else {
            this.removeFontSizeOptions();
        }
        if (typeof togglingCallback === 'function') {
            this.togglingCallback = togglingCallback;
        }
    }

    /**
   * Looks ahead to find passed tag from current selection
   *
   * @param  {string} tagName       - tag to found
   * @param  {string} [className]   - tag's class name
   * @param  {number} [searchDepth] - count of tags that can be included. For better performance.
   * @returns {HTMLElement|null}
   */
    public findParentTag(tagName: string, className?: string, searchDepth = 10): HTMLElement | null {
        const selection = window.getSelection();
        let parentTag = null;

        /**
         * If selection is missing or no anchorNode or focusNode were found then return null
         */
        if (!selection || !selection.anchorNode || !selection.focusNode) {
            return null;
        }

        /**
         * Define Nodes for start and end of selection
         */
        const boundNodes = [
            /** the Node in which the selection begins */
            selection.anchorNode as HTMLElement,
            /** the Node in which the selection ends */
            selection.focusNode as HTMLElement,
        ];

        /**
         * For each selection parent Nodes we try to find target tag [with target class name]
         * It would be saved in parentTag variable
         */
        boundNodes.forEach((parent) => {
            /** Reset tags limit */
            let searchDepthIterable = searchDepth;

            while (searchDepthIterable > 0 && parent.parentNode) {
                /**
                 * Check tag's name
                 */
                if (parent.tagName === tagName) {
                    /**
                     * Save the result
                     */
                    parentTag = parent;

                    /**
                     * Optional additional check for class-name mismatching
                     */
                    if (className && parent.classList && !parent.classList.contains(className)) {
                        parentTag = null;
                    }

                    /**
                     * If we have found required tag with class then go out from the cycle
                     */
                    if (parentTag) {
                        break
                    }
                }
                const len = parent.children?.length;
                for (let i = 0; i < len; i++) {
                    const child = parent.children.item(i);
                    if (!child) continue;
                    if (child.tagName === tagName) {
                        /**
                         * Save the result
                         * */
                        parentTag = child;
                        /**
                         * Optional additional check for class-name mismatching
                         */
                        if (className && child.classList && !child.classList.contains(className)) {
                            parentTag = null;
                        }
                        /**
                         *  
                         * If we have found required tag with class then go out from the cycle
                         * */
                        if (parentTag) {
                            break
                        }
                    }
                }

                if (parentTag) {
                    break
                }

                /**
                 * Target tag was not found. Go up to the parent and check it
                 */
                parent = parent.parentNode as HTMLElement;
                searchDepthIterable--;
            }

        });

        /**
         * Return found tag or null
         */
        return parentTag;
    }

    surround(range: Range): void {
        if (this.selectedFontSize) {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
                // const termWrapper = this.findParentTag("SPAN");
                // //判断选中内容的父节点是否是一个span标签
                // if (!termWrapper || selection.anchorNode?.textContent !== termWrapper?.textContent) {
                //     const span = document.createElement('span');
                //     span.style.fontSize = `${this.selectedFontSize}`;
                //     span.classList.add('font-size-tool');
                //     span.appendChild(range.extractContents());
                //     range.insertNode(span);
                //     // this.api.selection.expandToTag(span);
                //     // range.surroundContents(span);
                //     // this.api.selection.expandToTag(range);
                // } else {
                //     termWrapper.style.fontSize = `${this.selectedFontSize}`;
                //     // this.api.selection.expandToTag(termWrapper);
                //     // this.api.selection.expandToTag(range);
                //     // if (selection.anchorNode?.parentElement) {
                //     //     selection.anchorNode?.parentElement?.style.setProperty('font-size', `${this.selectedFontSize}`, 'important')
                //     // }
                //     // range.surroundContents(termWrapper);
                // }
                document.execCommand('styleWithCSS', false, 'true');
                document.execCommand('fontSize', false, this.selectedFontSize);
                // document.execCommand('className', false, 'font-size-tool');
            }
            this.selectedFontSize = null;
        }
    }

    getComputedFontStyle(node: Node): string {
        return window.getComputedStyle(node.parentElement!, null).getPropertyValue('font-size');
    }

    checkState(selection: Selection): boolean {
        const isActive = document.queryCommandState('fontSize');
        let anchoredElementFontSize = this.getComputedFontStyle(selection.anchorNode!);
        const focusedElementFontSize = this.getComputedFontStyle(selection.focusNode!);
        if (anchoredElementFontSize === focusedElementFontSize) {
            anchoredElementFontSize = anchoredElementFontSize.slice(0, anchoredElementFontSize.indexOf('p'));
            const elementContainsDecimalValue = anchoredElementFontSize.indexOf('.');
            if (elementContainsDecimalValue !== -1) {
                anchoredElementFontSize = anchoredElementFontSize.slice(0, anchoredElementFontSize.indexOf('.'));
            }
            this.replaceFontSizeInWrapper(anchoredElementFontSize);
        } else {
            const emptyWrapper = this.emptyString;
            this.replaceFontSizeInWrapper(emptyWrapper);
        }
        return isActive;
        // const termWrapper = this.api.selection.findParentTag("SPAN");
        // if (!termWrapper) return false;
        // this.replaceFontSizeInWrapper(termWrapper.style.fontSize);
        // return true;
    }

    replaceFontSizeInWrapper(size: string): void {
        const displaySelectedFontSize = document.getElementById(this.fontSizeDropDown)!;
        displaySelectedFontSize.innerHTML = size;
    }

    clear(): void {
        this.toggle();
        this.selectedFontSize = null;
    }

    svg(name: string, width = 14, height = 14): HTMLElement {
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.classList.add('icon', 'icon--' + name);
        icon.setAttribute('width', width + 'px');
        icon.setAttribute('height', height + 'px');
        icon.innerHTML = `<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${name}"></use>`;

        return icon;
    }
}
