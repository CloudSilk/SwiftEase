//@ts-nocheck
import Code from './components/code';
import Delimiter from './components/delimiter';
import Embed from './components/embed';
import Header from './components/header';
import Image from './components/image';
import List from './components/list';
import Paragraph from './components/paragraph';
import Quote from './components/quote';
import Raw from './components/raw';
import Table from './components/table';
import { RenderFn } from './components/utils';
import Video from './components/video';

export type ConfigProp = Record<string, RenderConfig>;

export type RenderConfig = Record<string, any>;

export type RenderersProp = Record<string, RenderFn<any>>;

export interface Block {
  id?: string;
  type: string;
  data: Record<string, any>;
}

export interface DataProp {
  time: number;
  version: string;
  blocks: Block[];
}

const Blocks = ({
  data,
  config = {},
  renderers = {},
}: {
  data: DataProp;
  config?: ConfigProp;
  renderers?: RenderersProp;
}) => {
  const defaultRenderers = {
    code: Code,
    delimiter: Delimiter,
    embed: Embed,
    header: Header,
    image: Image,
    simpleImage: Image,
    video: Video,
    list: List,
    paragraph: Paragraph,
    quote: Quote,
    table: Table,
    raw: Raw,
  };

  const availableRenderers = {
    ...defaultRenderers,
    ...renderers,
  };

  const hasBlockId = data.version?.includes('2.21');

  return (
    <>
      {data.blocks?.map((block, i) => {
        if (block.type.toString() in availableRenderers) {
          // @ts-ignore Todo: find a fix
          const Tag = availableRenderers[block.type];
          return <Tag key={hasBlockId && block.id ? block.id : i} data={block.data} tunes={block['tunes']} {...config[block.type]} />;
        }
      })}
    </>
  );
};

export {
  Blocks as default,
  Blocks,
  Code as CodeBlock,
  Delimiter as DelimiterBlock,
  Embed as EmbedBlock,
  Header as HeaderBlock,
  Image as ImageBlock,
  List as ListBlock,
  Paragraph as ParagraphBlock,
  Quote as QuoteBlock,
  Table as TableBlock,
  Raw as RawBlock,
};