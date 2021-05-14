const { NODE_ENV: nenv } = process.env;

export function log(...msgs) {
  if (nenv !== "development") {
    return;
  }

  if (!msgs.length) {
    return;
  }

  for (const msg of msgs) {
    if (typeof msg === "string") {
      console.log(msg);
    } else {
      console.log(`%c${msg.t}`, `color: ${msg.c || 'initial'}`);
    }
  }
}

export function logRaw(...msgs) {
  if (nenv !== "development") {
    return;
  }

  console.log.apply(console, msgs);
}


export function logLocationComponents(children, location) {
  if (nenv !== "development") {
    return;
  }

  const { type } = children;
  const { pathname, search } = location;
  if (type._result && type._result.name) {
    logRaw(`<Layout> %c(lazy)<${type._result.name}> - %c${pathname}${search}`, 'color: green', 'color: blue');
  } else if (type.name) {
    logRaw(`<Layout> %c<${type.name}> - %c${pathname}${search}`, 'color: green', 'color: blue');
  }
}
