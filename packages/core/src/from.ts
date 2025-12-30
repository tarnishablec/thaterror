import type { EnrolledErrorFamily, ErrorFamily, ErrorMapOf, ErrorUnionOf } from "./types";


export function enroll<
    F,
    const E extends Error,
>(
    errorFamily:
    F extends EnrolledErrorFamily<infer _M, infer _Es>
        ? F
        : F extends ErrorFamily<ErrorMapOf<F>>
            ? ErrorFamily<ErrorMapOf<F>>
            : never,
    errorClass: new (...args: never[]) => E,
    transformer: (error: E) => ErrorUnionOf<F extends EnrolledErrorFamily<infer M, infer _Es> ? ErrorFamily<M> : F>
): EnrolledErrorFamily<F extends EnrolledErrorFamily<infer EM, infer _Es>
    ? EM
    : F extends ErrorFamily<infer M>
        ? M
        : never,
    [...F extends EnrolledErrorFamily<infer _M, infer Es> ? Es : [], E]> {


    throw new Error("Not implemented");
}