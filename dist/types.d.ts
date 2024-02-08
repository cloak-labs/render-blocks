import { type BlockRenderer } from "./BlockRenderer";
export type BlockRenderFunction<TComponent = any, TRenderOutput = any> = (blockComponents: RenderPreparedBlock<TComponent>[], options?: RenderOptions) => TRenderOutput;
export type BlockRendererConfig<TComponent = any, TRenderOutput = any, TBlockData extends Record<string, any> = Record<string, any>> = {
    render?: BlockRenderFunction<TComponent, TRenderOutput>;
    hooks?: {
        filters?: {
            dataRouterResult?: FilterHookFunction<Record<string, any>, {
                block: BlockDataWithExtraContext<TBlockData>;
            }, Record<string, any>>;
        };
    };
    blocks?: BlocksConfig<TComponent, TBlockData> | BlocksConfig<TComponent, TBlockData>[];
    blockIdField?: keyof TBlockData;
    innerBlocksPropsKey?: string;
};
export type FilterHookFunction<TValue = any, TProps = any, TResult = any> = (valueToFilter: TValue, props?: TProps) => TResult;
export type EmptyObject = {};
export type EmptyObjectOrRecord<T = Record<string, any>> = T extends Record<string, any> ? T : EmptyObject;
export type TransformedBlock<TBlockData extends Record<string, any> = Record<string, any>, TProps = EmptyObjectOrRecord> = {
    props?: TProps;
    block: BlockDataWithExtraContext<TBlockData>;
};
export type RenderPreparedBlock<TComponent = any, TProps = EmptyObjectOrRecord, TBlockData extends Record<string, any> = Record<string, any>> = TransformedBlock<TBlockData, TProps> & {
    Component: TComponent;
};
export type DataRouter<TProps = EmptyObjectOrRecord, TBlockData extends Record<string, any> = Record<string, any>, TComponent = any> = (block: BlockDataWithExtraContext<TBlockData>, blockRenderer?: BlockRenderer<TComponent, any, TBlockData>) => TProps | Promise<TProps>;
export type GlobalDataRouter<TProps = EmptyObjectOrRecord, TBlockData extends Record<string, any> = Record<string, any>> = (options: {
    block: BlockDataWithExtraContext<TBlockData>;
    props: TProps;
}) => TProps;
export type SingleBlockConfigWithoutVariants<TComponent = any, TProps = EmptyObjectOrRecord, TBlockData extends Record<string, any> = Record<string, any>> = {
    dataRouter?: DataRouter<TProps, TBlockData, TComponent>;
    component?: TComponent;
    variantsRouter?: never;
    variants?: never;
};
export type VariantsRouter<TBlockData extends Record<string, any> = Record<string, any>> = (block: BlockDataWithExtraContext<TBlockData>) => string;
export type SingleBlockConfigWithVariants<TComponent = any, TProps = EmptyObjectOrRecord, TBlockData extends Record<string, any> = Record<string, any>> = {
    variantsRouter: VariantsRouter<TBlockData>;
    variants: {
        [key: string]: SingleBlockConfigWithoutVariants<TComponent, TProps, TBlockData>;
    };
    dataRouter?: never;
    component?: never;
};
export type SingleBlockConfig<TComponent = any, TBlockData extends Record<string, any> = Record<string, any>> = SingleBlockConfigWithoutVariants<TComponent, EmptyObjectOrRecord, TBlockData> | SingleBlockConfigWithVariants<TComponent, EmptyObjectOrRecord, TBlockData>;
export type BlocksConfig<TComponent = any, TBlockData extends Record<string, any> = Record<string, any>> = {
    [key: string]: SingleBlockConfig<TComponent, TBlockData>;
};
export type BlockDataWithExtraContext<TBlockData extends Record<string, any> = Record<string, any>> = Partial<TBlockData> & {
    context?: BlockContext<Partial<TBlockData>>;
};
export type BlockContext<TBlockData extends Record<string, any> = Record<string, any>> = {
    customProps?: Record<string, any>;
    parent?: BlockDataWithExtraContext<Partial<TBlockData>> | null;
    index?: number;
    prevSibling?: TBlockData | null;
    nextSibling?: TBlockData | null;
};
export type RenderOptions<TBlockData extends Record<string, any> = Record<string, any>> = {
    parent?: BlockDataWithExtraContext<Partial<TBlockData>>;
    customProps?: Record<string, any>;
};
