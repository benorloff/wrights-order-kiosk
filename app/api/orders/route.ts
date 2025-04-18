import { NextResponse } from "next/server";

export async function GET() {
  if (
    !process.env.SPIRE_API_URL ||
    !process.env.SPIRE_API_TEST_URL ||
    !process.env.SPIRE_API_USER ||
    !process.env.SPIRE_API_PASSWORD
  ) {
    throw new Error(
      "Missing one more of the following environment variables: SPIRE_API_URL, SPIRE_API_USER, SPIRE_API_PASSWORD"
    );
  }

  const encodedCredentials = btoa(`${process.env.SPIRE_API_USER}:${process.env.SPIRE_API_PASSWORD}`);

  const queryParams = new URLSearchParams({
    sort: "-orderDate",
    filter: '{"territoryCode":"WS","udf.source":"INTERNET"}',
    udf: "1",
  });

  const spireURL = `${process.env.SPIRE_API_TEST_URL}/?${queryParams.toString()}`;
  console.log(`Fetching orders from ${spireURL}`);

  const res = await fetch(spireURL, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();

  console.log(data);

  return NextResponse.json(data);
}
