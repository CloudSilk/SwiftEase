//@ts-nocheck
import './index.less';

interface TuneSettings {
  default?: string;
  blocks?: Record<string, string>;
}

interface TuneConstructorOptions {
  api: any;
  data: { alignment: string };
  config: TuneSettings;
  block: any;
}

class AlignmentBlockTune {
  static DEFAULT_ALIGNMENT = 'left';
  static _isTune = true;

  private api: any;
  private block: any;
  private settings: TuneSettings;
  private data: { alignment: string };
  private _CSS: { alignment: Record<string, string> };
  private wrapper: HTMLElement;

  constructor({ api, data, config, block }: TuneConstructorOptions) {
    this.api = api;
    this.block = block;
    this.settings = config;
    this.data = data || { alignment: this.getAlignment() };
    this._CSS = {
      alignment: {
        left: 'ce-tune-alignment--left',
        center: 'ce-tune-alignment--center',
        right: 'ce-tune-alignment--right',
        justify: 'ce-tune-alignment--justify',
      },
    };
  }

  static get isTune(): boolean {
    return true;
  }

  private getAlignment(): string {
    if (!!this.settings?.blocks && this.settings.blocks.hasOwnProperty(this.block.name)) {
      return this.settings.blocks[this.block.name];
    }
    if (this.settings?.default) {
      return this.settings.default;
    }
    return AlignmentBlockTune.DEFAULT_ALIGNMENT;
  }

  wrap(blockContent: HTMLElement): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.toggle(this._CSS.alignment[this.data.alignment]);
    this.wrapper.append(blockContent);
    return this.wrapper;
  }

  setAlignment(alignment: string): void {
    this.data = {
      alignment: alignment,
    };

    this.wrapper.classList.remove(...Object.values(this._CSS.alignment));
    this.wrapper.classList.toggle(this._CSS.alignment[alignment], alignment === this.data.alignment);
  }

  render(): any[] {
    const self = this;

    return [
        {
            name: 'left',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 23h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 45h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>`,
            label: self.api.i18n.t('Align left'),
            isActive: self.data.alignment === 'left',
            closeOnActivate: true,
            onActivate: (item: { name: string; }, e: any) => {
                self.setAlignment(item.name);
            },
        },
        {
            name: 'center',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 23c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 45c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>`,
            label: self.api.i18n.t('Align center'),
            isActive: self.data.alignment === 'center',
            closeOnActivate: true,
            onActivate: (item: { name: string; }, e: any) => {
                self.setAlignment(item.name);
            },
        },
        {
            name: 'right',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 19h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 41h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>`,
            label: self.api.i18n.t('Align right'),
            isActive: self.data.alignment === 'right',
            closeOnActivate: true,
            onActivate: (item: { name: string; }, e: any) => {
                self.setAlignment(item.name);
            },
        }
    ];
  }

  save(): { alignment: string } {
    return this.data;
  }
}

export default AlignmentBlockTune;
