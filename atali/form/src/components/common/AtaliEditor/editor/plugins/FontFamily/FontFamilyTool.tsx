//@ts-nocheck
type FontFamilyOption = {
    label: string;
    value: string;
};

export default class FontFamilyTool {
    static title = 'Font Family';
    isDropDownOpen = false;
    togglingCallback: ((opened: boolean) => void) | null = null;
    fontFamilyDropDown = 'font-family-dropdown';

    static get sanitize() {
        return {
            span: {
                style: true,
            },
        };
    }
    static get isInline() {
        return true;
    }
    commandName = 'fontName';

    CSS = {
        button: 'ce-inline-tool',
        buttonActive: 'ce-font-family-tool--active',
        buttonModifier: 'ce-inline-tool--font',
    };
    nodes = {
        button: undefined as HTMLElement | undefined,
    };
    selectedFontFamily: string | null = null;

    selectionList: HTMLElement | undefined;

    createButton(): void {
        this.nodes.button = this.createNode('button', [this.CSS.button, this.CSS.buttonModifier]);
        this.nodes.button.type = 'button';
        this.nodes.button.setAttribute('id', 'fontFamilyBtn');
        this.getFontFamilyForButton();
        const createSvg = this.svg('toggler-down', 13, 13);
        this.nodes.button.appendChild(createSvg);
    }
    getFontFamilyForButton(): void {
        const buttonWrapperText = this.createNode('div', 'button-wrapper-text');
        const displaySelectedFontFamily = this.createNode('div');
        displaySelectedFontFamily.setAttribute('id', this.fontFamilyDropDown);
        displaySelectedFontFamily.innerHTML = 'Font Family';
        buttonWrapperText.append(displaySelectedFontFamily);
        this.nodes.button!.append(buttonWrapperText);
    }

    addFontFamilyOptions(): void {
        const fontFamilyList: FontFamilyOption[] = [
            { label: 'Arial', value: 'Arial' },
            { label: 'Courier New', value: 'Courier New' },
            { label: 'Georgia', value: 'Georgia' },
            { label: 'Times New Roman', value: 'Times New Roman' },
            { label: 'Verdana', value: 'Verdana' },
        ];
        this.selectionList = this.createNode('div', 'selectionList');
        const selectionListWrapper = this.createNode('div', 'selection-list-wrapper');

        for (const fontFamily of fontFamilyList) {
            const option = this.createNode('div');
            option.setAttribute('value', fontFamily.value);
            option.setAttribute('id', fontFamily.value);
            option.classList.add('selection-list-option');
            if (this.selectedFontFamily === fontFamily.value) {
                option.classList.add('selection-list-option-active');
            }
            option.innerHTML = fontFamily.label;
            selectionListWrapper.append(option);
        }
        this.selectionList.append(selectionListWrapper);
        this.nodes.button!.append(this.selectionList);
        this.selectionList.addEventListener('click', this.toggleFontFamilySelector);

        setTimeout(() => {
            if (typeof this.togglingCallback === 'function') {
                this.togglingCallback(true);
            }
        }, 50);
    }

    createNode(tagName: string, classNames: string | string[] | null = null): HTMLElement {
        const el = document.createElement(tagName);

        if (Array.isArray(classNames)) {
            el.classList.add(...classNames);
        } else if (classNames) {
            el.classList.add(classNames);
        }
        return el;
    }

    toggleFontFamilySelector = (event: MouseEvent): void => {
        this.selectedFontFamily = (event.target as HTMLElement).id;
        this.toggle();
    };

    removeFontFamilyOptions(): void {
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
            ($event.target as HTMLElement).id === this.fontFamilyDropDown ||
            ($event.target as HTMLElement).parentNode!.id === 'fontFamilyBtn' ||
            ($event.target as HTMLElement).id === 'fontFamilyBtn'
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
            this.addFontFamilyOptions();
        } else {
            this.removeFontFamilyOptions();
        }
        if (typeof togglingCallback === 'function') {
            this.togglingCallback = togglingCallback;
        }
    }

    surround(range: Range): void {
        if (this.selectedFontFamily) {
            document.execCommand('fontName', false, this.selectedFontFamily);
        }
    }

    checkState(selection: Selection): boolean {
        const isActive = document.queryCommandState('fontName');
        const anchoredElementFontFamily = window.getComputedStyle(selection.anchorNode!.parentElement!, null).getPropertyValue('font-family');
        const focusedElementFontFamily = window.getComputedStyle(selection.focusNode!.parentElement!, null).getPropertyValue('font-family');
        if (anchoredElementFontFamily === focusedElementFontFamily) {
            this.replaceFontFamilyInWrapper(anchoredElementFontFamily);
        } else {
            this.replaceFontFamilyInWrapper('Font Family');
        }
        return isActive;
    }

    replaceFontFamilyInWrapper(family: string): void {
        const displaySelectedFontFamily = document.getElementById(this.fontFamilyDropDown)!;
        displaySelectedFontFamily.innerHTML = family;
    }

    clear(): void {
        this.toggle();
        this.selectedFontFamily = null;
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

