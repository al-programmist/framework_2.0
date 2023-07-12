export function reloader(buildPath) {
  return {
    server: {
      baseDir: buildPath
    },
    notify: false,
    open: true,
    tunnel: false,
    cors: true,
    host: "localhost",
    port: 8000,
    logPrefix: "Terminator v.3.0"
  }
}
