import { PrismaClient, Report} from '@prisma/client';
import { CreateReportDto} from './report.types';

const prisma = new PrismaClient();

export const listReports = async (): Promise<Report[]> => {
  return await prisma.report.findMany();
};

export const createReport = async (report: CreateReportDto): Promise<Report> => {
  return await prisma.report.create({
      data: report ,
  });
};

export const getReport = async (id: string): Promise<Report | null> => {
  return await prisma.report.findUnique({ where: { id } });
};



