import { extendTheme, ThemeConfig } from "@chakra-ui/react"
export const themeConfig: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const appTheme = extendTheme({
  config: themeConfig,
  styles: {
    global: () => ({
      body: {
        minHeight: ["100vh", "-webkit-fill-available"],
        // h: "100vh",
        // overflow: "hidden",
        "overscroll-behavior-y": "none",
      },
      html: {
        "overscroll-behavior-y": "none",
        minHeight: "-webkit-fill-available",
      }
    })
  }
})
1