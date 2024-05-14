//@ts-nocheck
/**
 * Build styles
 */
import './index.css';

import { IconAddBorder, IconStretch, IconAddBackground } from '@codexteam/icons';

/**
 * SimpleImage Tool for the Editor.js
 * Works only with pasted image URLs and requires no server-side uploader.
 *
 * @typedef {object} SimpleImageData
 * @description Tool's input and output data format
 * @property {string} url — image URL
 * @property {string} caption — image caption
 * @property {boolean} withBorder - should image be rendered with border
 * @property {boolean} withBackground - should image be rendered with background
 * @property {boolean} stretched - should image be stretched to full width of container
 */

interface SimpleImageData {
    url: string;
    caption: string;
    withBorder: boolean;
    withBackground: boolean;
    stretched: boolean;
}

export default class SimpleImage {
    private api: any;
    private readOnly: boolean;
    private blockIndex: number;
    private CSS: any;
    private nodes: any;
    private _data: SimpleImageData;
    private tunes: any[];

    /**
     * Render plugin`s main Element and fill it with saved data
     *
     * @param {{data: SimpleImageData, config: object, api: object}}
     *   data — previously saved data
     *   config - user config for Tool
     *   api - Editor.js API
     *   readOnly - read-only mode flag
     */
    constructor({ data, config, api, readOnly }: { data: SimpleImageData, config: object, api: object, readOnly: boolean }) {
        this.api = api;
        this.readOnly = readOnly;
        this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;
        this.CSS = {
            baseClass: this.api.styles.block,
            loading: this.api.styles.loader,
            input: this.api.styles.input,
            wrapper: 'cdx-simple-image',
            imageHolder: 'cdx-simple-image__picture',
            caption: 'cdx-simple-image__caption',
        };

        this.nodes = {
            wrapper: null,
            imageHolder: null,
            image: null,
            caption: null,
        };

        this.data = {
            url: data.url || '',
            caption: data.caption || '',
            withBorder: data.withBorder !== undefined ? data.withBorder : false,
            withBackground: data.withBackground !== undefined ? data.withBackground : false,
            stretched: data.stretched !== undefined ? data.stretched : false,
        };

        this.tunes = [
            {
                name: 'withBorder',
                label: 'Add Border',
                icon: IconAddBorder,
            },
            {
                name: 'stretched',
                label: 'Stretch Image',
                icon: IconStretch,
            },
            {
                name: 'withBackground',
                label: 'Add Background',
                icon: IconAddBackground,
            },
        ];
    }

    render(): HTMLElement {
        const wrapper = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]),
            loader = this._make('div', this.CSS.loading),
            imageHolder = this._make('div', this.CSS.imageHolder),
            image = this._make('img'),
            caption = this._make('div', [this.CSS.input, this.CSS.caption], {
                contentEditable: !this.readOnly,
                innerHTML: this.data.caption || '',
            });

        caption.dataset.placeholder = 'Enter a caption';

        wrapper.appendChild(loader);

        if (this.data.url) {
            image['src'] = this.data.url;
        }

        image.onload = () => {
            wrapper.classList.remove(this.CSS.loading);
            imageHolder.appendChild(image);
            wrapper.appendChild(imageHolder);
            wrapper.appendChild(caption);
            loader.remove();
            this._acceptTuneView();
        };
        image.onerror = (e) => {
            console.log('Failed to load an image', e);
        };

        this.nodes.imageHolder = imageHolder;
        this.nodes.wrapper = wrapper;
        this.nodes.image = image;
        this.nodes.caption = caption;

        return wrapper;
    }

    save(blockContent: HTMLElement): SimpleImageData {
        const image = blockContent.querySelector('img'),
            caption = blockContent.querySelector('.' + this.CSS.input);
        if (!image) {
            return this.data;
        }

        return Object.assign(this.data, {
            url: image.src,
            caption: caption?.innerHTML,
        });
    }

    static get sanitize() {
        return {
            url: {},
            withBorder: {},
            withBackground: {},
            stretched: {},
            caption: {
                br: true,
            },
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    onDropHandler(file: File): Promise<SimpleImageData> {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise(resolve => {
            reader.onload = (event) => {
                resolve({
                    url: event.target?.result ?? '',
                    caption: file.name,
                });
            };
        });
    }

    onPaste(event: any) {
        switch (event.type) {
            case 'tag': {
                const img = event.detail.data;
                this.data = {
                    url: img.src,
                };
                break;
            }

            case 'pattern': {
                const { data: text } = event.detail;
                this.data = {
                    url: text,
                };
                break;
            }

            case 'file': {
                const { file } = event.detail;

                this.onDropHandler(file)
                    .then(data => {
                        this.data = data;
                    });

                break;
            }
        }
    }

    public get data(): SimpleImageData {
        return this._data;
    }

    public set data(data: SimpleImageData) {
        this._data = Object.assign({}, this._data, data);
        if (this.nodes.image) {
            this.nodes.image.src = this.data.url;
          }
      
          if (this.nodes.caption) {
            this.nodes.caption.innerHTML = this.data.caption;
          }
    }

    static get pasteConfig(): any {
        return {
            patterns: {
                simpleImage: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|webp)$/i,
            },
            tags: [
                {
                    img: {
                        src: true,
                    },
                },
            ],
            files: {
                mimeTypes: ['image/*'],
            },
        };
    }

    renderSettings() {
        return this.tunes.map(tune => ({
            ...tune,
            label: this.api.i18n.t(tune.label),
            toggle: true,
            onActivate: () => this._toggleTune(tune.name),
            isActive: !!this.data[tune.name],
        }))
    };

    _make(tagName: string, classNames: Array<string> | string | undefined = undefined, attributes: object = {}): HTMLElement {
        const el = document.createElement(tagName);
        if (Array.isArray(classNames)) {
            el.classList.add(...classNames);
        } else if (classNames) {
            el.classList.add(classNames);
        }

        for (const attrName in attributes) {
            el[attrName] = attributes[attrName];
        }

        return el;
    }



    _toggleTune(tune: string) {
        this.data[tune] = !this.data[tune];
        this._acceptTuneView();
    }

    _acceptTuneView() {
        this.tunes.forEach(tune => {
            this.nodes.imageHolder.classList.toggle(this.CSS.imageHolder + '--' + tune.name.replace(/([A-Z])/g, (g: string[]) => `-${g[0].toLowerCase()}`), !!this._data[tune.name]);
            if (tune.name === 'stretched') {
                this.api.blocks.stretchBlock(this.blockIndex, !!this.data.stretched);
            }
        });
    }
}
