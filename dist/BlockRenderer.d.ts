import type { BlockRendererConfig, BlockDataWithExtraContext, RenderPreparedBlock, EmptyObjectOrRecord, RenderOptions } from "./types";
import { DeepPartial } from "ts-essentials";
export declare class BlockRenderer<TComponent = any, TRenderOutput = any, TBlockData extends Record<string, any> = Record<string, any>> {
    protected _config: BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>;
    constructor(config: BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>);
    mergeConfigWith(config: DeepPartial<BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>>): BlockRenderer<TComponent, TRenderOutput, Partial<TBlockData>>;
    getComponents(blocksData: Partial<TBlockData>[], options?: RenderOptions<TBlockData>): RenderPreparedBlock<TComponent, EmptyObjectOrRecord, Partial<TBlockData>>[];
    getComponent<TProps = EmptyObjectOrRecord>(block: BlockDataWithExtraContext<Partial<TBlockData>>): RenderPreparedBlock<TComponent, TProps, Partial<TBlockData>>;
    render(blockData: Partial<TBlockData>[], options?: RenderOptions<TBlockData>): TRenderOutput;
    getConfig(): BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>;
}
