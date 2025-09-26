export async function json(req: any) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    const body = Buffer.concat(buffers).toString();
    
    if (body.length === 0) {
      return null;
    }

    return JSON.parse(body);
  } catch (error) {
    return null;
  }
}
