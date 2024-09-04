import { PrismaClient, Change, Changelog} from '@prisma/client';
import { CreateChangeDTO } from './changelog.types';

const prisma = new PrismaClient();

export const getChanges = async (changelogId: number): Promise<Change[]> => {
  return await prisma.change.findMany({ where: { changelogId } });
};

export const createChange = async (change: CreateChangeDTO, changelogId:number): Promise<Change> => {
  return await prisma.change.create({
      data: {...change, changelogId}
  });
};

/* export const updateChangelog = async (changelogId: number, changelog: UpdateChangelogDTO): Promise<Changelog> => {
    return await prisma.changelog.update({
        where: { id: changelogId},
        data: changelog,
    })
} */



