import { Changelog, Change } from '@prisma/client';

export type CreateChangelogDTO = Pick<Changelog, 'id' | 'sprint_name'>
export type CreateChangeDTO = Pick<Change, 'id' | 'message' | 'changelogId'>
export interface SubmitCreateChange  {
    messages: CreateChangeDTO[],
    changelogId: number
}