import HTMLReactParser from 'html-react-parser';
import { RenderFn } from '../utils';

export interface VideoBlockData {
  file?: {
    url: string;
    name?: string;
  };
  url?: string;
  caption: string;
  withBorder: boolean;
  withBackground: boolean;
  stretched: boolean;
  [s: string]: any;
}

export interface VideoBlockConfig {
  actionsClassNames?: {
    [s: string]: string;
  };
}

const Video: RenderFn<VideoBlockData, VideoBlockConfig> = ({
  data,
  className = '',
  actionsClassNames = {
    stretched: 'video-block--stretched',
    withBorder: 'video-block--with-border',
    withBackground: 'video-block--with-background',
  },
}) => {
  const classNames: string[] = [];
  if (className) classNames.push(className);

  Object.keys(actionsClassNames).forEach((actionName) => {
    if (data && data[actionName] === true && actionName in actionsClassNames) {
      // @ts-ignore
      classNames.push(actionsClassNames[actionName]);
    }
  });

  const figureprops: {
    [s: string]: string;
  } = {};

  if (classNames.length > 0) {
    figureprops.className = classNames.join(' ');
  }

  return (
    <figure {...figureprops}>
      {data?.file?.url && <video style={{ width: '100%' }} controls={true} src={data.file.url} />}
      {data?.url && <video src={data.url} />}
      {data?.caption && <figcaption>{HTMLReactParser(data.caption)}</figcaption>}
    </figure>
  );
};

export default Video;