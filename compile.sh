#!/bin/bash

deno task compile --target x86_64-unknown-linux-gnu --output bin/remarkable-linux-x64
deno task compile --target x86_64-pc-windows-msvc --output bin/remarkable-windows-x64
deno task compile --target x86_64-apple-darwin --output bin/remarkable-apple-x64
deno task compile --target aarch64-apple-darwin --output bin/remarkable-apple-arm