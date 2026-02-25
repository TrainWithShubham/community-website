import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// nextCoreWebVitals includes: next (react), next/typescript, next/core-web-vitals
// Merge pre-existing rule overrides into the config objects that own the plugins
const config = nextCoreWebVitals.map((c) => {
  if (c.name === "next") {
    return {
      ...c,
      rules: {
        ...c.rules,
        "react/no-unescaped-entities": "warn",
        "react-hooks/set-state-in-effect": "warn",
        "react-hooks/static-components": "warn",
        "react-hooks/set-state-in-render": "warn",
        "react-hooks/purity": "warn",
      },
    };
  }
  if (c.name === "next/typescript") {
    return {
      ...c,
      rules: {
        ...c.rules,
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-require-imports": "warn",
      },
    };
  }
  if (c.name === "next/core-web-vitals") {
    return {
      ...c,
      rules: {
        ...c.rules,
        "@next/next/no-page-custom-font": "warn",
        "@next/next/no-html-link-for-pages": "warn",
      },
    };
  }
  return c;
});

export default config;
