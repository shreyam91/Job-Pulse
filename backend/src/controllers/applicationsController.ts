import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        job: {
          include: {
            company: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map Prisma schema to the expected frontend model
    const mappedApplications = applications.map(app => ({
      id: app.id,
      company: app.job.company.name,
      role: app.job.title,
      status: app.status,
      appliedAt: app.appliedAt,
      notes: app.notes,
      location: app.job.location,
      salary: app.job.salary,
    }));

    res.json(mappedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: {
          include: {
            company: true
          }
        }
      }
    });

    res.json({
      id: application.id,
      company: application.job.company.name,
      role: application.job.title,
      status: application.status,
      appliedAt: application.appliedAt,
      notes: application.notes,
      location: application.job.location,
      salary: application.job.salary,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};
