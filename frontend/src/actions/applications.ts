"use server"

export type ApplicationStatus = "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedAt?: Date;
  notes?: string;
  location?: string;
  salary?: string;
}

const API_URL = process.env.API_URL || 'http://localhost:3002/api';

export async function getApplications(): Promise<Application[]> {
  try {
    const res = await fetch(`${API_URL}/applications`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateApplicationStatus(id: string, newStatus: ApplicationStatus): Promise<Application | null> {
  try {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    
    if (!res.ok) throw new Error('Failed to update application status');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
