const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export async function generateCoverLetter(data: {
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  resumeContext?: string;
}) {
  try {
    const res = await fetch(`${API_URL}/ai/cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to generate cover letter');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error in generateCoverLetter action:', error);
    throw error;
  }
}

export async function optimizeResume(data: {
  resumeContent: string;
  jobDescription?: string;
}) {
  try {
    const res = await fetch(`${API_URL}/ai/optimize-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to optimize resume');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error in optimizeResume action:', error);
    throw error;
  }
}
