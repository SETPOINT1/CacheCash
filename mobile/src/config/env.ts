import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
};

function inferExpoHost() {
  const manifestConstants = Constants as typeof Constants & {
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
    manifest?: { debuggerHost?: string };
  };

  const hostCandidate =
    Constants.expoConfig?.hostUri ??
    manifestConstants.manifest2?.extra?.expoClient?.hostUri ??
    manifestConstants.manifest?.debuggerHost;

  if (!hostCandidate) {
    return undefined;
  }

  return hostCandidate.split(":")[0];
}

const inferredHost = inferExpoHost();
const rawApiBaseUrl = extra.apiBaseUrl ?? "http://localhost:3000/api";
const normalizedApiBaseUrl = inferredHost
  ? rawApiBaseUrl.replace("localhost", inferredHost).replace("127.0.0.1", inferredHost)
  : rawApiBaseUrl;

export const env = {
  apiBaseUrl: normalizedApiBaseUrl,
};
