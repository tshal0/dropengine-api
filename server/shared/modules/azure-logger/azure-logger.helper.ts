// import * as appInsights from 'applicationinsights';
// import { getCircularReplacer } from 'shared/utils';

// export const initializeAppInsights = (key: string) => {
//   try {
//     appInsights
//       .setup(key)
//       .setAutoDependencyCorrelation(true)
//       .setAutoCollectRequests(true)
//       .setAutoCollectPerformance(true, true)
//       .setAutoCollectExceptions(true)
//       .setAutoCollectDependencies(true)
//       .setAutoCollectConsole(true)
//       .setUseDiskRetryCaching(true)
//       .setSendLiveMetrics(false)
//       .start();
//   } catch (err) {
//     console.log(JSON.stringify(err, getCircularReplacer()));
//     throw err;
//   }
// };
