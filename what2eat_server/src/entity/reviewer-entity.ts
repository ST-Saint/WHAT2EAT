import { Reviewer } from '../interface/reviewer';

import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'reviewer' })
export class ReviewerEntity implements Reviewer {
    @PrimaryColumn('text')
    name: string;
}
