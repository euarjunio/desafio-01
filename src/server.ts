import { createServer } from "node:http";
import { routes } from "./routes.ts";

import { json } from "./middleware/json.ts";
import { extractQueryParams } from "./utils/extract-query-params.ts";

declare module "node:http" {
  interface IncomingMessage {
    body?: any;
    params?: any;
    query?: any;
  }
}

const server = createServer(async (req, res) => {
  const { method, url } = req

  try {
    req.body = await json(req);
    res.setHeader("Content-Type", "application/json")
  } catch (error) {
    req.body = null;
  }

  let route = routes.find(
    (route) => route.method === method && url && route.path.test(url)
  )

  if (route) {
    const routeParams = url?.match(route.path)

    const { query, ...params } = routeParams?.groups ?? {}

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    route.handler(req, res);
  } else {
    res.writeHead(404).end();
  }
});

server.listen(80);
