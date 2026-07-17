"use server";

export async function fetchScrapedJobs() {
  try {
    const res = await fetch("http://localhost:3002/api/jobs/scrape", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch jobs: ${res.statusText}`);
    }

    const data = await res.json();
    return data.jobs || [];
  } catch (error) {
    console.error("Error fetching scraped jobs:", error);
    throw error;
  }
}
