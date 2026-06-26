import t from "virtual:i18n"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>${t("hello")}</h1>
  <p>${t("welcome")}</p>
  <p>${t("description")}</p>
`
