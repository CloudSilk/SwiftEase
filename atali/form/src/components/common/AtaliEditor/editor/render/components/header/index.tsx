import HTMLReactParser from 'html-react-parser';
import { RenderFn } from '../utils';

export interface HeaderBlockData {
  text: string;
  level: number;
}

const Header: RenderFn<HeaderBlockData> = ({ data, className = '', tunes = {} }) => {
  const props: {
    [s: string]: any;
  } = {};

  if (className) {
    props.className = className;
  }

  const Tag = `h${data?.level || 1}` as keyof JSX.IntrinsicElements;
  const style: any = { ...(props.style ?? {}) };
  if (tunes?.anyTuneName?.alignment) {
    style.textAlign = tunes.anyTuneName.alignment
  }
  return <Tag {...props} style={style}>{data?.text && HTMLReactParser(data.text)}</Tag>;
};

export default Header;