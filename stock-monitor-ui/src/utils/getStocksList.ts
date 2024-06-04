import React from "react";
import * as Papa from "papaparse";
import { Stocks } from "@/components/stocks/Dashboard/SearchList";

export async function getStockData(): Promise<Stocks[]> {
  const csv = await fetchCsv();
  const data = Papa.parse<Stocks>(csv, { header: true }); // Specify header row
  return data.data; // Return parsed data array
}

async function fetchCsv(): Promise<string> {
  const response = await fetch("/listing_status.csv");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const csv = await response.text();
  return csv;
}
