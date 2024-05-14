//@ts-nocheck
import { Code } from '@swiftease/atali-pkg';
import { uploadFile } from '../../utils';
import './index.less';
import { ImageConfig, ImageToolData, UploadResponseFormat } from './types';

import Ui from './ui';
import Uploader from './uploader';

import { IconAddBorder, IconStretch, IconAddBackground, IconPicture } from '@codexteam/icons';

export default class ImageTool {
    private readonly api: any;
    private readonly readOnly: boolean;
    private config: ImageConfig;
    private uploader: Uploader;
    private ui: Ui;
    private _data: ImageToolData;

    static get isReadOnlySupported(): boolean {
        return true;
    }

    static get toolbox(): { icon: string; title: string } {
        return {
            icon: IconPicture,
            title: 'Image',
        };
    }

    static get tunes(): Array<any> {
        return [
            {
                name: 'withBorder',
                icon: IconAddBorder,
                title: 'With border',
                toggle: true,
            },
            {
                name: 'stretched',
                icon: IconStretch,
                title: 'Stretch image',
                toggle: true,
            },
            {
                name: 'withBackground',
                icon: IconAddBackground,
                title: 'With background',
                toggle: true,
            },
        ];
    }

    constructor({ data, config, api, readOnly }: { data: ImageToolData; config: ImageConfig; api: any; readOnly: boolean }) {
        this.api = api;
        this.readOnly = readOnly;

        /**
         * Tool's initial config
         */
        this.config = {
            endpoints: config.endpoints || '',
            additionalRequestData: config.additionalRequestData || {},
            additionalRequestHeaders: config.additionalRequestHeaders || {},
            field: config.field || 'image',
            types: config.types || 'image/*',
            captionPlaceholder: this.api.i18n.t(config.captionPlaceholder || 'Caption'),
            buttonContent: config.buttonContent || '',
            uploader: config.uploader || {
                uploadByFile(file: any) {
                    return new Promise((resolve, reject) => {
                        uploadFile(file).then((data) => {
                            if (data.code === Code.Success) {
                                resolve({
                                    success: 1,
                                    file: {
                                        url: '/api/core/file/download?id=' + data.fileID
                                    }
                                })
                            } else {
                                reject(data.message)
                            }

                        }, (err) => {
                            reject(err)
                        })
                    })
                }
            },
            actions: config.actions || [],
        };

        /**
         * Module for file uploading
         */
        this.uploader = new Uploader({
            config: this.config,
            onUpload: (response) => this.onUpload(response),
            onError: (error) => this.uploadingFailed(error),
        });

        /**
         * Module for working with UI
         */
        this.ui = new Ui({
            api,
            config: this.config,
            onSelectFile: () => {
                this.uploader.uploadSelectedFile({
                    onPreview: (src) => {
                        this.ui.showPreloader(src);
                    },
                });
            },
            readOnly,
        });

        /**
         * Set saved state
         */
        this._data = {} as ImageToolData;
        this.data = data;
    }

    render(): HTMLElement {
        return this.ui.render(this.data);
    }

    validate(savedData: ImageToolData): boolean {
        return savedData.file && savedData.file.url;
    }

    save(): ImageToolData {
        const caption = this.ui.nodes.caption;

        this._data.caption = caption.innerHTML;

        return this.data;
    }

    renderSettings(): Array<any> {
        // Merge default tunes with the ones that might be added by user
        // @see https://github.com/editor-js/image/pull/49
        const tunes = ImageTool.tunes.concat(this.config.actions);

        return tunes.map(tune => ({
            icon: tune.icon,
            label: this.api.i18n.t(tune.title),
            name: tune.name,
            toggle: tune.toggle,
            isActive: this.data[tune.name],
            onActivate: () => {
                /* If it'a user defined tune, execute it's callback stored in action property */
                if (typeof tune.action === 'function') {
                    tune.action(tune.name);

                    return;
                }
                this.tuneToggled(tune.name);
            },
        }));
    }

    appendCallback(): void {
        this.ui.nodes.fileButton.click();
    }

    static get pasteConfig(): any {
        return {
            /**
             * Paste HTML into Editor
             */
            tags: [
                {
                    img: { src: true },
                },
            ],
            /**
             * Paste URL of image into the Editor
             */
            patterns: {
                image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp)(\?[a-z0-9=]*)?$/i,
            },

            /**
             * Drag n drop file from into the Editor
             */
            files: {
                mimeTypes: ['image/*'],
            },
        };
    }

    async onPaste(event: CustomEvent): Promise<void> {
        switch (event.type) {
            case 'tag': {
                const image = event.detail.data;

                /** Images from PDF */
                if (/^blob:/.test(image.src)) {
                    const response = await fetch(image.src);
                    const file = await response.blob();

                    this.uploadFile(file);
                    break;
                }

                this.uploadUrl(image.src);
                break;
            }
            case 'pattern': {
                const url = event.detail.data;

                this.uploadUrl(url);
                break;
            }
            case 'file': {
                const file = event.detail.file;

                this.uploadFile(file);
                break;
            }
        }
    }

    private set data(data: ImageToolData) {
        this.image = data.file;

        this._data.caption = data.caption || '';
        this.ui.fillCaption(this._data.caption);

        ImageTool.tunes.forEach(({ name: tune }) => {
            const value = typeof data[tune] !== 'undefined' ? data[tune] === true || data[tune] === 'true' : false;

            this.setTune(tune, value);
        });
    }

    private get data(): ImageToolData {
        return this._data;
    }

    private set image(file: any) {
        this._data.file = file || {};

        if (file && file.url) {
            this.ui.fillImage(file.url, this.config.field ?? 'image');
        }
    }

    private onUpload(response: UploadResponseFormat): void {
        if (response.success && response.file) {
            this.image = response.file;
        } else {
            this.uploadingFailed('incorrect response: ' + JSON.stringify(response));
        }
    }

    private uploadingFailed(errorText: string): void {
        console.log('Image Tool: uploading failed because of', errorText);

        this.api.notifier.show({
            message: this.api.i18n.t('Couldn’t upload image. Please try another.'),
            style: 'error',
        });
        this.ui.hidePreloader();
    }

    private tuneToggled(tuneName: string): void {
        // inverse tune state
        this.setTune(tuneName, !this._data[tuneName]);
    }

    private setTune(tuneName: string, value: boolean): void {
        this._data[tuneName] = value;

        this.ui.applyTune(tuneName, value);

        if (tuneName === 'stretched') {
            /**
             * Wait until the API is ready
             */
            Promise.resolve().then(() => {
                const blockId = this.api.blocks.getCurrentBlockIndex();

                this.api.blocks.stretchBlock(blockId, value);
            })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private uploadFile(file: File): void {
        this.uploader.uploadByFile(file, {
            onPreview: (src) => {
                this.ui.showPreloader(src);
            },
        });
    }

    private uploadUrl(url: string): void {
        this.ui.showPreloader(url);
        this.uploader.uploadByUrl(url);
    }
}
