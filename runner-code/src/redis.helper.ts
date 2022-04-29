export default function mockClientRedisTest(): any {
  return {
    getAsync: () => {
      // tslint:disable-next-line
      console.log('Async');
      return null;
    },
    setAsync: () => null
  };
}
