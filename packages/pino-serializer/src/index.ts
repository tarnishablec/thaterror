import {
    codeOf,
    isDefinedError,
    payloadOf,
    type ThatError,
} from "@thaterror/core";
import type { LoggerOptions, SerializedError } from "pino";

export const thaterrorSerializer = (e: ThatError): SerializedError => {
    return {
        type: e.constructor.name,
        message: e.message,
        stack: e.stack ?? "",
        raw: e,
        name: e.name,
        code: codeOf(e),
        payload: payloadOf(e),
    };
};

export const thaterrorHooks: LoggerOptions["hooks"] = {
    logMethod(this, args, method) {
        const err = args[0];
        if (err && isDefinedError(err)) {
            return method.apply(this, [
                { thaterror: err },
                args[1],
                ...args.slice(2),
            ]);
        }
        return method.apply(this, args);
    },
};
