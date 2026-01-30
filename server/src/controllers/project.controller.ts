
import { Response } from 'express';
import prisma from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

// Create a new project
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, techStack, lookingFor } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return 
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        lookingFor,
        userId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all projects with pagination and filtering
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const pageQuery = req.query.page;
    const limitQuery = req.query.limit;
    
    const page = pageQuery ? parseInt(String(pageQuery)) : 1;
    const limit = limitQuery ? parseInt(String(limitQuery)) : 10;
    const skip = (page - 1) * limit;

    const projects = await prisma.project.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            githubUsername: true
          }
        }
      }
    });

    const total = await prisma.project.count();

    res.status(200).json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProjects: total
    });
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single project details
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            githubUsername: true,
            githubUrl: true
          }
        }
      }
    });

    if (!project) {
       res.status(404).json({ message: "Project not found" });
       return
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Get Project Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update project
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, techStack, lookingFor, status } = req.body;
    const userId = req.user?.userId;

    const existingProject = await prisma.project.findUnique({ where: { id } });

    if (!existingProject) {
       res.status(404).json({ message: "Project not found" });
       return
    }

    if (existingProject.userId !== userId) {
       res.status(403).json({ message: "Unauthorized to edit this project" });
       return
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        techStack,
        lookingFor,
        status
      },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete project
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const existingProject = await prisma.project.findUnique({ where: { id } });

    if (!existingProject) {
       res.status(404).json({ message: "Project not found" });
       return
    }

    if (existingProject.userId !== userId) {
       res.status(403).json({ message: "Unauthorized to delete this project" });
       return
    }

    await prisma.project.delete({ where: { id } });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
