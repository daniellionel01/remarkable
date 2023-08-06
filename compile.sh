#!/bin/bash

deno task compile --target x86_64-unknown-linux-gnu --output remarkable-linux-x64
deno task compile --target x86_64-pc-windows-msvc --output remarkable-windows-x64
deno task compile --target x86_64-apple-darwin --output remarkable-apple-x64
deno task compile --target aarch64-apple-darwin --output remarkable-apple-arm