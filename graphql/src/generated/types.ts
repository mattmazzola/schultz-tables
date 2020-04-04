export type Maybe<T> = T | null;

export interface ScoreInput {
  signedStartTime: string;

  userId: string;

  startTime: number;

  userSequence: AnswerInput[];

  expectedSequence: string[];

  randomizedSequence: string[];

  tableWidth: number;

  tableHeight: number;

  tableProperties: KvPairInput[];
}

export interface AnswerInput {
  time: number;

  cell: CellInput;

  correct: boolean;
}

export interface CellInput {
  classes: string[];

  text: string;

  x: number;

  y: number;
}

export interface KvPairInput {
  key: string;

  value: string;
}

// ====================================================
// Types
// ====================================================

export interface Query {
  _empty?: Maybe<string>;

  scores: ScoresResponse;

  score: Score;

  userScores: Score[];

  users: User[];
}

export interface ScoresResponse {
  scores: Score[];

  users: User[];
}

export interface Score {
  id: string;

  userId: string;

  startTime: number;

  endTime: number;

  durationMilliseconds: number;

  userSequence: (Maybe<Answer>)[];

  expectedSequence: (Maybe<string>)[];

  randomizedSequence: (Maybe<string>)[];

  tableWidth: number;

  tableHeight: number;

  tableProperties: KvPair[];

  tableTypeId: string;
}

export interface Answer {
  time: number;

  cell: Cell;

  correct: boolean;
}

export interface Cell {
  classes: string[];

  text: string;

  x: number;

  y: number;
}

export interface KvPair {
  key: string;

  value: string;
}

export interface User {
  id: string;

  email: string;

  name: string;
}

export interface Mutation {
  _empty?: Maybe<string>;

  start: Start;

  addScore: Score;
}

export interface Start {
  value: string;
}

// ====================================================
// Arguments
// ====================================================

export interface ScoresQueryArgs {
  tableTypeId: string;

  page?: Maybe<number>;
}
export interface ScoreQueryArgs {
  id: string;
}
export interface UserScoresQueryArgs {
  userId: string;
}
export interface UsersQueryArgs {
  ignored?: Maybe<string>;
}
export interface StartMutationArgs {
  ignored?: Maybe<string>;
}
export interface AddScoreMutationArgs {
  scoreInput?: Maybe<ScoreInput>;
}

import { GraphQLResolveInfo } from "graphql";

import { IContext } from "../context";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = IContext, TypeParent = {}> {
    _empty?: _EmptyResolver<Maybe<string>, TypeParent, Context>;

    scores?: ScoresResolver<ScoresResponse, TypeParent, Context>;

    score?: ScoreResolver<Score, TypeParent, Context>;

    userScores?: UserScoresResolver<Score[], TypeParent, Context>;

    users?: UsersResolver<User[], TypeParent, Context>;
  }

  export type _EmptyResolver<
    R = Maybe<string>,
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type ScoresResolver<
    R = ScoresResponse,
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context, ScoresArgs>;
  export interface ScoresArgs {
    tableTypeId: string;

    page?: Maybe<number>;
  }

  export type ScoreResolver<
    R = Score,
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context, ScoreArgs>;
  export interface ScoreArgs {
    id: string;
  }

  export type UserScoresResolver<
    R = Score[],
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context, UserScoresArgs>;
  export interface UserScoresArgs {
    userId: string;
  }

  export type UsersResolver<
    R = User[],
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context, UsersArgs>;
  export interface UsersArgs {
    ignored?: Maybe<string>;
  }
}

export namespace ScoresResponseResolvers {
  export interface Resolvers<Context = IContext, TypeParent = ScoresResponse> {
    scores?: ScoresResolver<Score[], TypeParent, Context>;

    users?: UsersResolver<User[], TypeParent, Context>;
  }

  export type ScoresResolver<
    R = Score[],
    Parent = ScoresResponse,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type UsersResolver<
    R = User[],
    Parent = ScoresResponse,
    Context = IContext
  > = Resolver<R, Parent, Context>;
}

export namespace ScoreResolvers {
  export interface Resolvers<Context = IContext, TypeParent = Score> {
    id?: IdResolver<string, TypeParent, Context>;

    userId?: UserIdResolver<string, TypeParent, Context>;

    startTime?: StartTimeResolver<number, TypeParent, Context>;

    endTime?: EndTimeResolver<number, TypeParent, Context>;

    durationMilliseconds?: DurationMillisecondsResolver<
      number,
      TypeParent,
      Context
    >;

    userSequence?: UserSequenceResolver<(Maybe<Answer>)[], TypeParent, Context>;

    expectedSequence?: ExpectedSequenceResolver<
      (Maybe<string>)[],
      TypeParent,
      Context
    >;

    randomizedSequence?: RandomizedSequenceResolver<
      (Maybe<string>)[],
      TypeParent,
      Context
    >;

    tableWidth?: TableWidthResolver<number, TypeParent, Context>;

    tableHeight?: TableHeightResolver<number, TypeParent, Context>;

    tableProperties?: TablePropertiesResolver<KvPair[], TypeParent, Context>;

    tableTypeId?: TableTypeIdResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type UserIdResolver<
    R = string,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type StartTimeResolver<
    R = number,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type EndTimeResolver<
    R = number,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type DurationMillisecondsResolver<
    R = number,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type UserSequenceResolver<
    R = (Maybe<Answer>)[],
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type ExpectedSequenceResolver<
    R = (Maybe<string>)[],
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type RandomizedSequenceResolver<
    R = (Maybe<string>)[],
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type TableWidthResolver<
    R = number,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type TableHeightResolver<
    R = number,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type TablePropertiesResolver<
    R = KvPair[],
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type TableTypeIdResolver<
    R = string,
    Parent = Score,
    Context = IContext
  > = Resolver<R, Parent, Context>;
}

export namespace AnswerResolvers {
  export interface Resolvers<Context = IContext, TypeParent = Answer> {
    time?: TimeResolver<number, TypeParent, Context>;

    cell?: CellResolver<Cell, TypeParent, Context>;

    correct?: CorrectResolver<boolean, TypeParent, Context>;
  }

  export type TimeResolver<
    R = number,
    Parent = Answer,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type CellResolver<
    R = Cell,
    Parent = Answer,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type CorrectResolver<
    R = boolean,
    Parent = Answer,
    Context = IContext
  > = Resolver<R, Parent, Context>;
}

export namespace CellResolvers {
  export interface Resolvers<Context = IContext, TypeParent = Cell> {
    classes?: ClassesResolver<string[], TypeParent, Context>;

    text?: TextResolver<string, TypeParent, Context>;

    x?: XResolver<number, TypeParent, Context>;

    y?: YResolver<number, TypeParent, Context>;
  }

  export type ClassesResolver<
    R = string[],
    Parent = Cell,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type TextResolver<
    R = string,
    Parent = Cell,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type XResolver<
    R = number,
    Parent = Cell,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type YResolver<
    R = number,
    Parent = Cell,
    Context = IContext
  > = Resolver<R, Parent, Context>;
}

export namespace KvPairResolvers {
  export interface Resolvers<Context = IContext, TypeParent = KvPair> {
    key?: KeyResolver<string, TypeParent, Context>;

    value?: ValueResolver<string, TypeParent, Context>;
  }

  export type KeyResolver<
    R = string,
    Parent = KvPair,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = string,
    Parent = KvPair,
    Context = IContext
  > = Resolver<R, Parent, Context>;
}

export namespace UserResolvers {
  export interface Resolvers<Context = IContext, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    email?: EmailResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = User,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type EmailResolver<
    R = string,
    Parent = User,
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = User,
    Context = IContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = IContext, TypeParent = {}> {
    _empty?: _EmptyResolver<Maybe<string>, TypeParent, Context>;

    start?: StartResolver<Start, TypeParent, Context>;

    addScore?: AddScoreResolver<Score, TypeParent, Context>;
  }

  export type _EmptyResolver<
    R = Maybe<string>,
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context>;
  export type StartResolver<
    R = Start,
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context, StartArgs>;
  export interface StartArgs {
    ignored?: Maybe<string>;
  }

  export type AddScoreResolver<
    R = Score,
    Parent = {},
    Context = IContext
  > = Resolver<R, Parent, Context, AddScoreArgs>;
  export interface AddScoreArgs {
    scoreInput?: Maybe<ScoreInput>;
  }
}

export namespace StartResolvers {
  export interface Resolvers<Context = IContext, TypeParent = Start> {
    value?: ValueResolver<string, TypeParent, Context>;
  }

  export type ValueResolver<
    R = string,
    Parent = Start,
    Context = IContext
  > = Resolver<R, Parent, Context>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  IContext
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  IContext
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  IContext
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface IResolvers<Context = IContext> {
  Query?: QueryResolvers.Resolvers<Context>;
  ScoresResponse?: ScoresResponseResolvers.Resolvers<Context>;
  Score?: ScoreResolvers.Resolvers<Context>;
  Answer?: AnswerResolvers.Resolvers<Context>;
  Cell?: CellResolvers.Resolvers<Context>;
  KvPair?: KvPairResolvers.Resolvers<Context>;
  User?: UserResolvers.Resolvers<Context>;
  Mutation?: MutationResolvers.Resolvers<Context>;
  Start?: StartResolvers.Resolvers<Context>;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
