import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { CreateReportDto } from "./report.types";
import { createReport, getReport, listReports } from "./report.service";

const index = async (req: Request, res: Response) => {
    try {
        const reports = await listReports();
        res.status(StatusCodes.OK).json(reports);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const create = async (req: Request, res: Response) => {
    const reportData = req.body as CreateReportDto;
    try {
        const newReport = await createReport(reportData);
        res.status(StatusCodes.CREATED).json(newReport);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const report = await getReport(id);
        if (!report) {
            return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND);
        }
        return res.json(report)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};


export default { index, read, create};
