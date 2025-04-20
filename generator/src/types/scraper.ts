import { Program } from 'acorn';

export type Globals = Record<string, unknown | undefined>;

export type ColorData = Map<string, Map<string, {}>>;
export type PantyData = Map<string, {
  color: string;
  desc: string;
  image: string;
  panty: string;
  texture: string;
}>;

export type Content = {
  ast: Program;
  raw: string;
};

export type ContentMap = Map<string, Content>;

export type EvalResultRaw = {
  globals: Globals;
  serializedColorData: string;
  serializedPantyData: string;
  version: string;
};

export type EvalResult = {
  colorData: ColorData;
  pantyData: PantyData;
} & Omit<EvalResultRaw, 'serializedColorData' | 'serializedPantyData'>;

export type ScraperResult = {
  content: ContentMap;
} & EvalResult;
