import { BlockRenderer } from "./BlockRenderer";

// export type DataRouterResultFilter<TComponent, TRenderOutput, TBlockData> =
//   FilterHookFunction<
//     Record<string, any>,
//     {
//       block: BlockDataWithExtraContext<TBlockData>;
//       blockRenderer: BlockRenderer<TComponent, TRenderOutput, TBlockData>;
//     },
//     Record<string, any>
//   >;

export type BlockRendererConfig<
  TComponent extends (props: any) => any = (props: any) => any,
  TRenderOutput = any,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  render?: (
    blockComponents: RenderPreparedBlock<TComponent>[],
    options?: RenderOptions,
    blockRenderer?: BlockRenderer<TComponent, TRenderOutput, TBlockData>
  ) => TRenderOutput;
  hooks?: {
    filters?: {
      /** Allows you to filter the returned result of ALL data routers, so you can inject some global things, log stuff, or whatever you want. */
      dataRouterResult: FilterHookFunction<
        Record<string, any>,
        {
          block: BlockDataWithExtraContext<TBlockData>;
          blockRenderer: BlockRenderer<TComponent, TRenderOutput, TBlockData>;
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
  providers?: ProviderConfig<TComponent, TBlockData>[];
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
  TComponent extends (props: any) => any = (props: any) => any,
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  Component: TComponent;
  props: TProps;
  block: BlockDataWithExtraContext<TBlockData>;
};

export type DataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>,
  TComponent extends (props: any) => any = (props: any) => any,
  TBlockDataWithExtraContext = BlockDataWithExtraContext<TBlockData>
> = (
  block: TBlockDataWithExtraContext extends BlockDataWithExtraContext<any>
    ? TBlockDataWithExtraContext
    : BlockDataWithExtraContext<TBlockData>,
  blockRenderer?: BlockRenderer<TComponent, any, TBlockData>
) => TProps;

export type GlobalDataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>
> = (options: {
  block: BlockDataWithExtraContext<TBlockData>;
  props: TProps;
}) => TProps;

export type SingleBlockConfigWithoutVariants<
  TComponent extends (props: any) => any = (props: any) => any,
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
  TBlockData extends Record<string, any> = Record<string, any>
> = (block: BlockDataWithExtraContext<TBlockData>) => string;

export type SingleBlockConfigWithVariants<
  TComponent extends (props: any) => any = (props: any) => any,
  TProps = EmptyObjectOrRecord,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  variantsRouter: VariantsRouter<TBlockData>; // Replace unknown with the actual return type
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
  TComponent extends (props: any) => any = (props: any) => any,
  TBlockData extends Record<string, any> = Record<string, any>
> =
  | SingleBlockConfigWithoutVariants<
      TComponent,
      EmptyObjectOrRecord,
      TBlockData
    >
  | SingleBlockConfigWithVariants<TComponent, EmptyObjectOrRecord, TBlockData>;

export type BlocksConfig<
  TComponent extends (props: any) => any = (props: any) => any,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  [key: string]: SingleBlockConfig<TComponent, TBlockData>;
};

export type BlockDataWithExtraContext<
  TBlockData extends Record<string, any> = Record<string, any>
> = Partial<TBlockData> & {
  context?: BlockContext<Partial<TBlockData>>;
};

export type BlockContext<
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  customProps?: Record<string, any>;
  parent?: BlockDataWithExtraContext<Partial<TBlockData>> | null;
  index?: number;
  prevSibling?: TBlockData | null;
  nextSibling?: TBlockData | null;
};

export type RenderOptions<
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  parent?: BlockDataWithExtraContext<Partial<TBlockData>>;
  customProps?: Record<string, any>;
};

export type ProviderConfig<
  TComponent extends (props: any) => any = (props: any) => any,
  TBlockData extends Record<string, any> = Record<string, any>
> = {
  condition: (args: { blocks: TBlockData[] }) => boolean;
  component: TComponent;
};
