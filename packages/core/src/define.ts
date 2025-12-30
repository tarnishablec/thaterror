import {
    CodeField,
    type DefinedError,
    ErrorBrand,
    type ErrorFamily,
    type ErrorMap,
    PayloadField,
    ScopeField
} from "./types";


class InternalBaseError<const Code extends string, const Payloads extends readonly unknown[]> extends Error implements DefinedError<Code, Payloads> {
    readonly [ ErrorBrand ] = true as const;
    readonly [ ScopeField ]: symbol;
    readonly [ PayloadField ]: Payloads;
    readonly [ CodeField ]: Code;

    constructor(
        public readonly code: Code,
        args: Payloads,
        readonly scope: symbol,
        message: string,
        options?: ErrorOptions
    ) {
        super(message, options);
        this.name = code;
        this[ CodeField ] = code;
        this[ ScopeField ] = scope;
        this[ PayloadField ] = args;
    }
}

export function defineError<const M extends ErrorMap>(
    map: M
): ErrorFamily<M> {
    const result = {} as Record<string, unknown>;
    const scope = Symbol();

    for (const key in map) {
        const spec = map[ key ];

        const factory = (...args: unknown[]) => {
            let finalArgs = args;
            let options: ErrorOptions | undefined;

            if (typeof spec === "function") {
                if (args.length > spec.length) {
                    const lastArg = args[ args.length - 1 ];
                    if (typeof lastArg === "object" && lastArg !== null) {
                        options = lastArg as ErrorOptions;
                        finalArgs = args.slice(0, -1);
                    }
                }

                const message = (spec as (...args: unknown[]) => string)(...finalArgs);
                return new InternalBaseError(key, finalArgs, scope, message, options);
            }

            if (typeof spec === "string") {
                options = args[ 0 ] as ErrorOptions | undefined;
                return new InternalBaseError(key, [], scope, spec, options);
            }
        };

        Reflect.set(factory, CodeField, key);
        Reflect.set(factory, ScopeField, scope);

        result[ key ] = factory;
    }

    Reflect.set(result, ScopeField, scope);
    return result as ErrorFamily<M>;
}
