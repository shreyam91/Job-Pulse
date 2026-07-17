import { Request, Response } from 'express';
import { openai } from '../lib/openai';
import { prisma } from '../lib/prisma';

export const generateCoverLetter = async (req: Request, res: Response) => {
  try {
    const { userId, jobId, jobTitle, companyName, jobDescription, resumeContext } = req.body;

    if (!jobTitle || !companyName) {
      return res.status(400).json({ error: 'Job title and company name are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const prompt = `
      You are an expert career coach and professional copywriter.
      Write a compelling, professional cover letter for the following job:
      Job Title: ${jobTitle}
      Company: ${companyName}
      Job Description: ${jobDescription || 'N/A'}

      Use the following context about the applicant to tailor the cover letter:
      ${resumeContext || 'The applicant is a highly motivated professional.'}

      The cover letter should be concise (around 3 paragraphs), engaging, and focus on the value the applicant brings to the company. Do not use generic placeholders like [Your Name] unless absolutely necessary; try to write it smoothly.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const generatedContent = completion.choices[0]?.message?.content || "";

    // If userId is provided, we can optionally save this to the database
    let savedCoverLetter = null;
    if (userId) {
      savedCoverLetter = await prisma.coverLetter.create({
        data: {
          userId,
          jobId: jobId || null,
          content: generatedContent,
        }
      });
    }

    res.json({
      content: generatedContent,
      id: savedCoverLetter?.id,
    });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate cover letter' });
  }
};

export const optimizeResume = async (req: Request, res: Response) => {
  try {
    const { userId, resumeId, resumeContent, jobDescription } = req.body;

    if (!resumeContent) {
      return res.status(400).json({ error: 'Resume content is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const prompt = `
      You are an expert ATS (Applicant Tracking System) optimizer and career coach.
      Review the following resume content and tailor it to the target job description to maximize the ATS match score.
      
      Target Job Description:
      ${jobDescription || 'Make it a strong general resume.'}

      Original Resume Content:
      ${resumeContent}

      Instructions:
      1. Rewrite bullet points to highlight relevant impact and metrics.
      2. Incorporate keywords from the job description naturally.
      3. Return ONLY the optimized resume text in a clear, structured markdown format. Do not add conversational filler.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const optimizedContent = completion.choices[0]?.message?.content || "";

    // If resumeId is provided, save as a new version
    let savedVersion = null;
    if (resumeId) {
      savedVersion = await prisma.resumeVersion.create({
        data: {
          resumeId,
          versionName: "AI Optimized Version",
          content: optimizedContent,
        }
      });
    }

    res.json({
      content: optimizedContent,
      versionId: savedVersion?.id,
    });
  } catch (error: any) {
    console.error('Error optimizing resume:', error);
    res.status(500).json({ error: error.message || 'Failed to optimize resume' });
  }
};
