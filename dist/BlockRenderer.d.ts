import type { BlockRendererConfig, RenderOptions, TransformedBlock } from "./types";
import type { DeepPartial } from "ts-essentials";
export declare class BlockRenderer<TComponent = any, TRenderOutput = any, TBlockData extends Record<string, any> = Record<string, any>> {
    protected _config: BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>;
    constructor(config: BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>);
    mergeConfigWith(config: DeepPartial<BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>>): BlockRenderer<TComponent, TRenderOutput, Partial<TBlockData>>;
    transformBlockData(blocksData: Partial<TBlockData>[], options?: RenderOptions<TBlockData>): TransformedBlock<TBlockData>[];
    transformBlockDataAsync(blocksData: Partial<TBlockData>[], options?: RenderOptions<TBlockData>): Promise<TransformedBlock<TBlockData>[]>;
    private prepBlockDataForRender;
    render(blocksData: TransformedBlock<TBlockData>[], options?: RenderOptions<TBlockData>): TRenderOutput;
    getConfig(): BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>;
    private runDataRouter;
    private runDataRouterAsync;
    private getBlockId;
    private getBlockConfig;
    private extendBlocksData;
    private isTransformedBlocks;
}
