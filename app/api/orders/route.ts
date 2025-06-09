import { sampleSpireApiResponse } from "@/lib/sampleSpireApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

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

  const territoryCode = request.nextUrl.searchParams.get("territoryCode");

  const encodedCredentials = btoa(
    `${process.env.SPIRE_API_USER}:${process.env.SPIRE_API_PASSWORD}`
  );

  const queryParams = new URLSearchParams({
    limit: '100',
    sort: "-orderDate",
    filter: `{"territoryCode":"${territoryCode}","udf.source":"INTERNET"}`,
    udf: "1",
  });

  const spireURL = `${process.env.SPIRE_API_URL}/?${queryParams.toString()}`;
  console.log(`Fetching orders from ${spireURL}`);

  const res = await fetch(spireURL, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("Error fetching orders:", res.statusText);
    return NextResponse.json({ error: "Failed to fetch orders from Spire" }, { status: res.status });
  }

  const data = await res.json();

  console.log(data);

  return NextResponse.json(data);
}
