import React from "react";
import {
  ComponentsLab,
  CounterLab,
  ListLab,
  FormLab,
  IdentityLab,
  RefLab,
  CustomHookLab,
} from "./BasicLabs";
import { EffectLab, ResourceLab } from "./AsyncLabs";
import { ReducerLab, ContextLab, RoutingLab } from "./ArchitectureLabs";
import { MemoLab, TransitionLab, ReliabilityLab } from "./PerformanceLabs";
export const labComponents = {
  components: ComponentsLab,
  props: (props) => <ComponentsLab {...props} propsMode />,
  state: CounterLab,
  lists: ListLab,
  snapshots: (props) => <CounterLab {...props} snapshots />,
  immutable: (props) => <ListLab {...props} immutable />,
  forms: FormLab,
  identity: IdentityLab,
  refs: RefLab,
  effects: EffectLab,
  fetching: ResourceLab,
  "custom-hooks": CustomHookLab,
  reducers: ReducerLab,
  context: ContextLab,
  routing: RoutingLab,
  memoization: MemoLab,
  transitions: TransitionLab,
  reliability: ReliabilityLab,
};
export default function Lab({ id, onExplore }) {
  const Example = labComponents[id];
  return Example ? (
    <Example onExplore={onExplore} />
  ) : (
    <p>This lab is unavailable.</p>
  );
}
