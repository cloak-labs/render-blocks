import type {
  BlockRendererConfig,
  BlockContext,
  BlockDataWithExtraContext,
  RenderPreparedBlock,
  EmptyObjectOrRecord,
  RenderOptions,
  FilterHookFunction,
  TransformedBlock,
  SingleBlockConfig,
} from "./types";
import { deepMerge } from "./utils/deepMerge";
import type { DeepPartial } from "ts-essentials";
import { removeUndefinedProperties } from "./utils/removeUndefinedProperties";

export class BlockRenderer<
  TComponent = any,
  TRenderOutput = any,
  TBlockData extends Record<string, any> = Record<string, any>
> {
  protected _config: BlockRendererConfig<
    TComponent,
    TRenderOutput,
    Partial<TBlockData>
  >;

  constructor(
    config: BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>
  ) {
    let { blocks } = config;

    // if user provides an array of blockConfigs, we take care of deep merging them together before setting the final config:
    if (blocks && Array.isArray(blocks)) {
      const [target, ...sources] = blocks;
      // @ts-ignore -- TODO: figure out deepMerge TS issue (not really a bug)
      blocks = deepMerge(target, ...sources);
    }

    /**
     * We provide a default function for every filter hook that simply returns the provided value.
     * This allows us to wrap values with filters without worrying whether the filter hook is defined.
     */
    const defaultFilterHook: FilterHookFunction = (value) => value;

    this._config = {
      innerBlocksPropsKey: "children",
      ...config,
      hooks: {
        filters: {
          // Set filter defaults
          dataRouterResult: defaultFilterHook,
          ...config.hooks.filters,
        },
        // TODO: set actions defaults:
        // actions: {
        //   ...config.hooks.actions,
        // },
      },
      blocks,
    };
  }

  mergeConfigWith(
    config: DeepPartial<
      BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>
    >
  ) {
    const mergedConfig = deepMerge(this._config, config);
    return new BlockRenderer<TComponent, TRenderOutput, Partial<TBlockData>>(
      mergedConfig
    );
  }

  // async getComponents(
  //   blocksData: Partial<TBlockData>[],
  //   options?: RenderOptions<TBlockData>
  // ): Promise<
  //   RenderPreparedBlock<TComponent, EmptyObjectOrRecord, Partial<TBlockData>>[]
  // > {
  //   if (!blocksData || !blocksData.length) return [];
  //   const { parent, customProps } = options ?? {};

  //   let blocks = [];

  //   for (const [i, blockData] of blocksData.entries()) {
  //     const blockId = blockData[this._config.blockIdField];
  //     const blockConfig = this._config.blocks[blockId];

  //     if (!blockConfig) continue;

  //     const context: BlockContext<Partial<TBlockData>> = {
  //       config: blockConfig,
  //       customProps,
  //       parent,
  //       index: i,
  //       prevSibling: i > 0 ? blocksData[i - 1] : null,
  //       nextSibling: i < blocksData.length - 1 ? blocksData[i + 1] : null,
  //     };

  //     // for each block, get its component from blocksConfig, and dataRouter to get props
  //     const preparedBlock = await this.getComponent({ ...blockData, context });
  //     if (preparedBlock) {
  //       blocks.push(preparedBlock);
  //     }
  //   }

  //   return blocks;
  // }

  // async getComponent<TProps = EmptyObjectOrRecord>(
  //   block: BlockDataWithExtraContext<Partial<TBlockData>>
  // ): Promise<RenderPreparedBlock<TComponent, TProps, Partial<TBlockData>>> {
  //   const blockId = block[this._config.blockIdField];

  //     // config not directly provided, try getting it ourselves:
  //     let config = this._config.blocks[blockId];
  //     if (!config) {
  //       // no luck, log error to console and return early:
  //       console.error(`Missing config for block "${blockId}", so we skip it.`);
  //       return;
  //     }

  //   // if the block has variants, we need to determine which one to use:
  //   if (config.variantsRouter) {
  //     const variant = config.variantsRouter?.(block);
  //     config = config.variants[variant];
  //     if (!config) {
  //       console.error(
  //         `Missing variant config for "${variant}" in the block "${blockId}", so we skip it.`
  //       );
  //       return;
  //     }
  //   }

  //   if (!config.component) {
  //     console.error(`Missing component for block "${blockId}", so we skip it.`);
  //     return;
  //   }

  //   const { filters } = this._config.hooks;

  //   // call the block's dataRouter to receive its props
  //   // let filteredProps = config.dataRouter?.(block, this) ?? {};
  //   const rawProps = (await config.dataRouter?.(block, this)) ?? {};
  //   const filteredProps = filters.dataRouterResult(rawProps, { block });

  //   return {
  //     Component: config.component,
  //     props: filteredProps as TProps,
  //     block,
  //   };
  // }

  transformBlockData(
    blocksData: Partial<TBlockData>[],
    options?: RenderOptions<TBlockData>
  ): TransformedBlock<TBlockData>[] {
    if (!blocksData || !blocksData.length) return [];

    let finalBlockData: TransformedBlock<TBlockData>[] = [];
    let extendedBlocksData = this.extendBlocksData(blocksData, options);

    // we convert any undefined property values returned by dataRouters to `null` for consistency and to avoid serialization errors in certain contexts
    for (const block of extendedBlocksData) {
      // retrieve each block's component props by running its user-provided dataRouter function
      const props = this.runDataRouter(block);

      finalBlockData.push({
        props: removeUndefinedProperties(props),
        block: removeUndefinedProperties(block),
      });
    }

    return finalBlockData;
  }

  async transformBlockDataAsync(
    blocksData: Partial<TBlockData>[],
    options?: RenderOptions<TBlockData>
  ): Promise<TransformedBlock<TBlockData>[]> {
    if (!blocksData || !blocksData.length) return [];

    let finalBlockData: TransformedBlock<TBlockData>[] = [];
    let extendedBlocksData = this.extendBlocksData(blocksData, options);

    // we convert any undefined property values returned by dataRouters to `null` for consistency and to avoid serialization errors in certain contexts
    for (const block of extendedBlocksData) {
      // retrieve each block's component props by running its user-provided dataRouter function
      const props = await this.runDataRouterAsync(block);

      finalBlockData.push({
        props: removeUndefinedProperties(props),
        block: removeUndefinedProperties(block),
      });
    }

    return finalBlockData;
  }

  private prepBlockDataForRender(
    blocksData: TransformedBlock<TBlockData>[]
  ): RenderPreparedBlock<TComponent>[] {
    const blocks = [];

    blocksData?.forEach((data) => {
      const { component } = this.getBlockConfig(data.block) ?? {};
      const blockId = this.getBlockId(data.block);

      if (!component) {
        console.error(
          `Missing component for block "${blockId}", so it won't render.`
        );
        return;
      }

      if (!data.hasOwnProperty("props")) {
        console.log("RUN DATA ROUTER CLIENT-SIDE for block: ", data.block);
        // this block's is missing props, meaning its dataRouter hasn't run, so we run it here:
        data.props = this.runDataRouter(data.block);
        console.log("props: ", data.props);
      }

      let innerBlocks = data.props[this._config.innerBlocksPropsKey];
      // console.log({ innerBlocks, blockId });
      // use recursion to prep nested blocks:
      if (innerBlocks && this.isTransformedBlocks(innerBlocks)) {
        data.props[this._config.innerBlocksPropsKey] =
          this.prepBlockDataForRender(innerBlocks);
      }

      blocks.push({
        ...data,
        Component: component,
      });
    });

    return blocks;
  }

  render(
    blocksData: TransformedBlock<TBlockData>[],
    options?: RenderOptions<TBlockData>
  ) {
    if (!blocksData || !Array.isArray(blocksData) || blocksData.length == 0)
      return;

    if (!this._config.render)
      throw Error(
        `You need to specify your own "render" function in your BlockRenderer config before you can use 'BlockRenderer.render(...)'`
      );

    const blocksToRender = this.prepBlockDataForRender(blocksData);

    return this._config.render(blocksToRender, options);
    // console.log("internal rendered: ", rendered);
    // return rendered;
  }

  getConfig(): BlockRendererConfig<
    TComponent,
    TRenderOutput,
    Partial<TBlockData>
  > {
    return this._config;
  }

  private runDataRouter<TProps = EmptyObjectOrRecord>(
    block: BlockDataWithExtraContext<Partial<TBlockData>>
  ): TProps {
    const blockConfig = this.getBlockConfig(block);
    if (!blockConfig) return null;

    const { filters } = this._config.hooks;

    // call the block's dataRouter to receive its props
    const rawProps = blockConfig.dataRouter?.(block, this) ?? {};
    const filteredProps = filters.dataRouterResult(rawProps, { block });

    return filteredProps as TProps;
  }

  private async runDataRouterAsync<TProps = EmptyObjectOrRecord>(
    block: BlockDataWithExtraContext<Partial<TBlockData>>
  ): Promise<TProps> {
    const blockConfig = this.getBlockConfig(block);
    if (!blockConfig) return null;

    const { filters } = this._config.hooks;

    // call the block's dataRouter to receive its props
    const rawProps = (await blockConfig.dataRouter?.(block, this)) ?? {};
    const filteredProps = filters.dataRouterResult(rawProps, { block });

    return filteredProps as TProps;
  }

  private getBlockId(block: BlockDataWithExtraContext<Partial<TBlockData>>) {
    return block[this._config.blockIdField];
  }

  private getBlockConfig(
    block: BlockDataWithExtraContext<Partial<TBlockData>>
  ): SingleBlockConfig<TComponent, TBlockData> {
    const blockId = this.getBlockId(block);
    let config = this._config.blocks[blockId];

    if (!config) {
      // no luck, log error to console and return early:
      console.error(`Missing config for block "${blockId}".`);
      return null;
    }

    // if the block has variants, we need to determine which one to use:
    if (config.variantsRouter) {
      const variant = config.variantsRouter?.(block);
      config = config.variants[variant];
      if (!config) {
        console.error(
          `Missing variant config for "${variant}" in the block "${blockId}".`
        );
        return null;
      }
    }

    return config;
  }

  private extendBlocksData(
    blocksData: Partial<TBlockData>[],
    options?: RenderOptions<TBlockData>
  ): BlockDataWithExtraContext<TBlockData>[] {
    if (!blocksData || !blocksData.length) return;
    const { parent = null, customProps = null } = options ?? {};

    let blocks = [];
    blocksData.forEach((block, index) => {
      const config = this.getBlockConfig(block);
      if (!config) return;

      const context: BlockContext<Partial<TBlockData>> = {
        // config,
        customProps,
        parent,
        index,
      };

      blocks.push({ ...block, context });
    });

    blocks?.map((block, i) => ({
      ...block,
      prevSibling: i > 0 ? blocks[i - 1] : null,
      nextSibling: i < blocks.length - 1 ? blocks[i + 1] : null,
    }));

    return blocks;
  }

  private isTransformedBlocks(blocks: any): boolean {
    if (!Array.isArray(blocks)) return false;

    for (const block of blocks) {
      const requiredProperties = ["props", "block"];
      for (const prop of requiredProperties) {
        if (!block.hasOwnProperty(prop)) return false;
      }
    }

    // if we made it here, `blocks` is valid
    return true;
  }
}
