export function assertNever(x: never, msg= "Unexpedcted value"): never{
    throw new Error(`${msg}: ${JSON.stringify(x)}`);
}