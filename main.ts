import { ensureDir } from "https://deno.land/std@0.163.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.163.0/path/mod.ts";
import {
  copy,
  readerFromStreamReader,
} from "https://deno.land/std@0.163.0/streams/conversion.ts";
import { z } from "https://deno.land/x/zod@v3.19.1/mod.ts";

const PROTOCOL = "http";
const IP = "10.11.99.1";
const TS = Date.now();
const TARGET = `./remarkable-${TS}`;

const RemBaseSchema = z.object({
  Bookmarked: z.boolean(),
  ID: z.string().uuid(),
  ModifiedClient: z.string(),
  Parent: z.string(),
  Type: z.enum(["CollectionType", "DocumentType"]),
  Version: z.number().optional(),
  VissibleName: z.string(),
  tags: z.array(z.string()),
});

const RemDocumentSchema = RemBaseSchema.extend({
  Type: z.literal("CollectionType"),
});

const RemFileSchema = RemBaseSchema.extend({
  CurrentPage: z.number().int().default(0),
  Type: z.literal("DocumentType"),
  fileType: z.enum(["notebook", "pdf", "epub"]),

  pageCount: z.number().int(),
  pages: z.array(z.string()).nullish(),
  sizeInBytes: z.string(),
});

const RemEntitySchema = z.union([RemFileSchema, RemDocumentSchema]);
type RemEntity = z.infer<typeof RemEntitySchema>;

const RemEntityArraySchema = z.array(RemEntitySchema);
type RemEntityArray = z.infer<typeof RemEntityArraySchema>;

function getReq(path: string): Promise<Response> {
  const url = `${PROTOCOL}://${IP}${path}`;
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Content-Length": "0",
    "Host": "10.11.99.1",
    "Origin": "http://10.11.99.1",
    "Referer": "http://10.11.99.1/",
  };
  return fetch(url, { headers });
}

async function getDocuments(path: string): Promise<RemEntityArray> {
  const res = await getReq(path)
  const json = await res.json()

  return RemEntityArraySchema.parse(json)
}

async function download(doc: RemEntity, path?: string) {
  if (!path) {
    path = TARGET;
  }

  const name = doc.VissibleName
    .replace(/[^A-Za-z0-9\s]/g, "");

  if (doc.Type === "DocumentType") {
    const filePath = join(path, `${name}.pdf`);

    console.log(`Fetching "${doc.VissibleName}"...`);
    const rdr = await getReq(`/download/${doc.ID}/placeholder`)
      .then((res) => res.body?.getReader());
    if (!rdr) {
      throw new Error(`Couldn't get pdf: "${doc.VissibleName}" (${doc.ID})`);
    }

    const r = readerFromStreamReader(rdr);
    const f = await Deno.open(filePath, { create: true, write: true });
    await copy(r, f);
    f.close();
  } else if (doc.Type === "CollectionType") {
    const dirpath = join(path, name);
    await ensureDir(dirpath);

    const subdocs = await getDocuments(`/documents/${doc.ID}/`);
    for (const subdoc of subdocs) {
      await download(subdoc, dirpath);
    }
  }
}

if (import.meta.main) {
  await ensureDir(TARGET);

  const docs = await getDocuments("/documents/");
  for (const doc of docs) {
    await download(doc);
  }
}
