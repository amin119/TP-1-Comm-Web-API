import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  firstName: string;
  @Column()
  age: number;
  @Column()
  Cin:string;
  @Column()
  Job: string;
  @Column()
  path:string;
  @ManyToOne(() => User, user => user.cvs)
  user:User;
  @ManyToMany(() => Skill)
  @JoinTable()
  skills : Skill[];
}
