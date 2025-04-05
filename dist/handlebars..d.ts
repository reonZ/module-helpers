declare function render<TData extends RenderData>(...args: RenderArgs<TData>): Promise<string>;
type RenderData = Record<string, any>;
type RenderArgs<TData extends RenderData> = [string, ...string[], TData | string];
export { render };
