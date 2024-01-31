import { BlockRenderer } from "./BlockRenderer";

export type BlockRendererConfig<
  TComponent = any,
  TRenderOutput = any,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  render?: (
    blockComponents: RenderPreparedBlock<TComponent>[],
    options?: RenderOptions
  ) => TRenderOutput;
  hooks?: {
    filters?: {
      dataRouterResult: FilterHookFunction<
        Record<string, any>,
        {
          block: BlockDataWithExtraContext<TComponent, TBlockData>;
        },
        Record<string, any>
      >;
    };
    // actions?: {}; // TODO: sprinkle action hooks throughout block rendering lifecycle
  };
  blocks?:
    | BlocksConfig<TComponent, TBlockData>
    | BlocksConfig<TComponent, TBlockData>[];
  blockIdField?: keyof TBlockData;
};

export type FilterHookFunction<TValue = any, TProps = any, TResult = any> = (
  valueToFilter: TValue,
  props?: TProps
) => TResult;

export type EmptyObject = {};
export type EmptyObjectOrRecord<T = Record<string, any>> = T extends Record<
  string,
  any
>
  ? T
  : EmptyObject;

export type RenderPreparedBlock<
  TComponent = any,
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  Component: TComponent;
  props: TProps;
  block: BlockDataWithExtraContext<TComponent, TBlockData>;
};

export type DataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>,
  TComponent = any
> = (
  block: BlockDataWithExtraContext<TComponent, TBlockData>,
  blockRenderer?: BlockRenderer<TComponent, any, TBlockData>
) => TProps;

export type GlobalDataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>,
  TComponent = any
> = (options: {
  block: BlockDataWithExtraContext<TComponent, TBlockData>;
  props: TProps;
}) => TProps;

export type SingleBlockConfigWithoutVariants<
  TComponent = any,
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  dataRouter?: DataRouter<TProps, TBlockData, TComponent>;
  component?: TComponent;

  // Set the following to `never` as hacky way of ensuring they can't be used alongside above properties:
  variantsRouter?: never;
  variants?: never;
};

export type VariantsRouter<
  TComponent = any,
  TBlockData extends Record<string, any> = Record<string, any>
> = (block: BlockDataWithExtraContext<TComponent, TBlockData>) => string;

export type SingleBlockConfigWithVariants<
  TComponent = any,
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  variantsRouter: VariantsRouter<TComponent, TBlockData>; // Replace unknown with the actual return type
  variants: {
    [key: string]: SingleBlockConfigWithoutVariants<
      TComponent,
      TProps,
      TBlockData
    >; // Replace {} with the actual type for your variations
  };

  // Set the following to `never` as hacky way of ensuring they can't be used alongside variants:
  dataRouter?: never;
  component?: never;
};

export type SingleBlockConfig<
  TComponent = any,
  TBlockData extends Record<string, any> = Record<string, any>
> =
  | SingleBlockConfigWithoutVariants<
      TComponent,
      EmptyObjectOrRecord,
      TBlockData
    >
  | SingleBlockConfigWithVariants<TComponent, EmptyObjectOrRecord, TBlockData>;

export type BlocksConfig<
  TComponent = any,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  [key: string]: SingleBlockConfig<TComponent, TBlockData>;
};

export type BlockDataWithExtraContext<
  TComponent = any,
  TBlockData extends Record<string, any> = Record<string, any>
> = Partial<TBlockData> & {
  context?: BlockContext<TComponent, Partial<TBlockData>>;
};

export type BlockContext<
  TComponent = any,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  config?: SingleBlockConfig<TComponent, TBlockData>;
  customProps?: Record<string, any>;
  parent?: BlockDataWithExtraContext<TComponent, Partial<TBlockData>> | null;
  index?: number;
  prevSibling?: TBlockData | null;
  nextSibling?: TBlockData | null;
};

export type RenderOptions<
  TComponent = any,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  parent?: BlockDataWithExtraContext<TComponent, Partial<TBlockData>>;
  customProps?: Record<string, any>;
};
