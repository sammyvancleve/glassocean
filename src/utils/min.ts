export function filterObjectKeys<A extends object, B extends keyof A>(
    obj: A,
    keys: B[]
  ): Pick<A, B> {
    const result: Pick<A, B> = {} as Pick<A, B>;
    keys.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    });
    return result;
  }

//   const filterObjectKeys = <A extends object, B extends keyof A>(
//     obj: A,
//     keys: B[]
//   ): Pick<A, B> => {
//     const result: Pick<A, B> = {} as Pick<A, B>;
//     keys.forEach((key) => {
//       if (obj.hasOwnProperty(key)) {
//         result[key] = obj[key];
//       }
//     });
//     return result;
//   };