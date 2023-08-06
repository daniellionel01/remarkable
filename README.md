# remarkable

this is a utility to export all of the contents of your remarkable as PDFs to a local folder.

once you run the program, it creates a folder prefixed with "remarkable-" and the current timestamp.

## instructions
- connect remarkable to computer via USB-C
- activate usbc web interface in remarkable settings
- make sure the remarkable doesn't go in standby
- run the binary `$ ./remarkable`

## developing
if you want to modify the script and run the `main.ts` file directly with deno, you can use the task `run` by running `$ deno task run`

[LICENSE](./LICENSE.md)