import { Raid } from './raids.model';

export interface Unit {
  id: number;
  active_raid?: Raid | null;

  // relations
  model?: UnitModel | null;
}

export interface UnitModel {
  id: number;
  name: string;
}
