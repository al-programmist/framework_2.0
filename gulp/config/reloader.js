import {$path} from "./path.js";

const reloader = {
    server: {
      baseDir: $path.buildPath
    },
    notify: false,
    open: true,
    tunnel: false,
    cors: true,
    host: "localhost",
    port: 8000,
    logPrefix: "Terminator v.3.0"
}

export {reloader}
