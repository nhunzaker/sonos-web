import { mutator } from "./request";

export const Play = mutator(`
  mutation Play($group: ID!) {
    play(group: $group)
  }
`);

export const Pause = mutator(`
  mutation Pause($group: ID!) {
    pause(group: $group)
  }
`);

export const Next = mutator(`
  mutation Next($group: ID!) {
    next(group: $group)
  }
`);

export const Previous = mutator(`
  mutation Previous($group: ID!) {
    previous(group: $group)
  }
`);
