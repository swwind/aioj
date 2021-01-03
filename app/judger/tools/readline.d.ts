
declare function createReader(stream: NodeJS.EventEmitter): () => Promise<string>;
export = createReader;
