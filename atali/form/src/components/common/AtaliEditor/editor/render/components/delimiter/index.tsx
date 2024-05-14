
 import { RenderFnWithoutData } from '../utils';

const Delimiter: RenderFnWithoutData = ({ className = '' }) => {
  const props: {
    [s: string]: string;
  } = {};

  if (className) {
    props.className = className;
  }

  return <hr {...props} />;
};

export default Delimiter;