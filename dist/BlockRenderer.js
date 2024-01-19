"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockRenderer = void 0;
const deepMerge_1 = require("./utils/deepMerge");
class BlockRenderer {
    constructor(config) {
        let { blocks } = config;
        // if user provides an array of blockConfigs, we take care of deep merging them together before setting the final config:
        if (blocks && Array.isArray(blocks)) {
            const [target, ...sources] = blocks;
            // @ts-ignore -- TODO: figure out deepMerge TS issue (not really a bug)
            blocks = (0, deepMerge_1.deepMerge)(target, ...sources);
        }
        /**
         * We provide a default function for every filter hook that simply returns the provided value.
         * This allows us to wrap values with filters without worrying whether the filter hook is defined.
         */
        const defaultFilterHook = (value) => value;
        this._config = {
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
    mergeConfigWith(config) {
        const mergedConfig = (0, deepMerge_1.deepMerge)(this._config, config);
        return new BlockRenderer(mergedConfig);
    }
    getComponents(blocksData, options) {
        if (!blocksData || !blocksData.length)
            return [];
        const { parent, customProps } = options ?? {};
        let blocks = [];
        blocksData.forEach((blockData, i) => {
            // if (i > 0) return; // TODO: remove this test line
            const blockId = blockData[this._config.blockIdField];
            const blockConfig = this._config.blocks[blockId];
            if (!blockConfig)
                return;
            const context = {
                config: blockConfig,
                customProps,
                parent,
                index: i,
                prevSibling: i > 0 ? blocksData[i - 1] : null,
                nextSibling: i < blocksData.length - 1 ? blocksData[i + 1] : null,
            };
            // for each block, get its component from blocksConfig, and dataRouter to get props
            const preparedBlock = this.getComponent({
                ...blockData,
                context,
            });
            if (!preparedBlock)
                return;
            blocks.push(preparedBlock);
        });
        return blocks;
    }
    getComponent(block) {
        let { context: { config } = {} } = block;
        const blockId = block[this._config.blockIdField];
        if (!config) {
            // config not directly provided, try getting it ourselves:
            config = this._config.blocks[blockId];
            if (!config) {
                // no luck, log error to console and return early:
                console.error(`Missing config for block "${blockId}", so we skip it.`);
                return;
            }
        }
        // if the block has variants, we need to determine which one to use:
        if (config.variantsRouter) {
            const variant = config.variantsRouter?.(block);
            config = config.variants[variant];
            if (!config) {
                console.error(`Missing variant config for "${variant}" in the block "${blockId}", so we skip it.`);
                return;
            }
        }
        if (!config.component) {
            console.error(`Missing component for block "${blockId}", so we skip it.`);
            return;
        }
        const { filters } = this._config.hooks;
        // call the block's dataRouter to receive its props
        // let dataRouterProps = config.dataRouter?.(block, this) ?? {};
        let dataRouterProps = filters.dataRouterResult(config.dataRouter?.(block, this) ?? {}, { block });
        // TODO: remove globalDataRouter in favor of dataRouterResult filter hook:
        // if (this._config.globalDataRouter) {
        //   // call the global dataRouter to receive the final dataRouter props
        //   dataRouterProps = this._config.globalDataRouter?.({
        //     block,
        //     props: dataRouterProps,
        //   });
        // }
        return {
            Component: config.component,
            props: dataRouterProps,
            block,
        };
    }
    render(blockData, options) {
        const components = this.getComponents(blockData, options);
        if (!this._config.render)
            throw Error(`You need to specify your own "render" function in your BlockRenderer config before you can use BlockRenderer.render(...)`);
        return this._config.render(components, options);
    }
    getConfig() {
        return this._config;
    }
}
exports.BlockRenderer = BlockRenderer;
