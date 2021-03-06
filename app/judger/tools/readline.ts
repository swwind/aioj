export default function (stream = process.stdin) {
  const lines: string[] = [];
  const resolves: Function[] = [];
  function update() {
    while (lines.length && resolves.length) {
      const line = lines.shift();
      const resolve = resolves.shift() as Function;
      resolve(line);
    }
  }
  function readline() {
    return new Promise((resolve) => {
      resolves.push(resolve);
      update();
    });
  }
  let fulldata = '';
  stream.on('data', (data) => {
    fulldata += data;
    let index = fulldata.indexOf('\n');
    while (index > -1) {
      lines.push(fulldata.slice(0, index));
      fulldata = fulldata.slice(index + 1);
      index = fulldata.indexOf('\n');
    }
    update();
  });

  return readline;
}
