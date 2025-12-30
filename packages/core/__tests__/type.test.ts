class MyCustomError extends Error {
    public readonly code = 500; // 添加一个特有属性
}


export function test<E extends Error>(ctor: new (...args: any[]) => E): [E] {
    throw new Error("Not implemented");

}

const result = test(SyntaxError);

export function test2<T extends new (...args: any[]) => Error>(ctor: T): [InstanceType<T>] {
    throw new Error("Not implemented");
}

const result2 = test2(MyCustomError);

const result3 = test2(SyntaxError);


export { result, result2, result3 }