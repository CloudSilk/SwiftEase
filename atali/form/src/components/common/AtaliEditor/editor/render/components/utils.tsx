export type RenderFn<T = undefined, K = Record<string, any> | undefined> = (
    _: {
      data: T;
      className?: string;
    } & K,
  ) => JSX.Element;

  export type RenderFnWithoutData<K = Record<string, any> | undefined> = (
    _: {
      className?: string;
    } & K,
  ) => JSX.Element;