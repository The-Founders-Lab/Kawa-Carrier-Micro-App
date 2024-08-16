import { useState } from "react";

const ENVIRONMENTS = {
  test: "test",
  live: "live",
};

export default function useSwitchEnvHook() {
  const [environment, setEnvironment] = useState(() => {
    let env = localStorage.getItem("KCMA:env");
    if (!env) {
      localStorage.setItem("KCMA:env", ENVIRONMENTS.test);
      env = ENVIRONMENTS.test;
    }
    return env;
  });

  function switchEnvironment() {
    const newEnv =
      environment === ENVIRONMENTS.test ? ENVIRONMENTS.live : ENVIRONMENTS.test;
    setEnvironment(newEnv);
    localStorage.setItem("KCMA:env", newEnv);
  }
  return { environment, switchEnvironment };
}
