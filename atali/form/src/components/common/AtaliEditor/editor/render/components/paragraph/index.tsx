import HTMLReactParser from 'html-react-parser';
import { RenderFn } from '../utils';

export interface ParagraphBlockData {
  text: string;
}

const Paragraph: RenderFn<ParagraphBlockData> = ({ data, className = '', tunes = {} }) => {
  const props: {
    [s: string]: any;
  } = {};

  if (className) {
    props.className = className;
  }
  const style: any = { ...(props.style ?? {}) };
  if (tunes?.anyTuneName?.alignment) {
    style.textAlign = tunes.anyTuneName.alignment
  }
  return <p {...props} style={style} >{data?.text && HTMLReactParser(data.text)}</p>;
};

export default Paragraph;