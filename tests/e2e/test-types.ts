//xx <reference path="../../client/app/model.ts"/>
/// <reference path="../../client/app/constants.ts" />

// This results in a weird outside-the-project error:
//xx <reference path="../../../modules/definitely-typed/types/mocha/index.d.ts"/>
// instead:
declare const it: any;
declare const describe: any;


interface TestSettings {
  debug: boolean;
  prod: boolean;
  secure: boolean;
  host: string;
  scheme: string;
  deleteOldSite: boolean;
  localHostname?: string; // must start with 'e2e-test-' (see settings.ts)
  testLocalHostnamePrefix: string;
  testEmailAddressPrefix: string;
  e2eTestPassword: string;
  forbiddenPassword: string;
  mainSiteOrigin: string;
  newSiteDomain: string;
  bail?: number;
  waitforTimeout: number;
  debugBefore: boolean;
  debugAfterwards: boolean;
  include3rdPartyDependentTests?: boolean;
  grep: string;
  only: string;
  browserName: string;
  gmailEmail?: string;
  gmailPassword?: string;
  facebookAdminPassword?: string;
  facebookAdminEmail?: string;
  facebookUserPassword?: string;
  facebookUserEmail?: string;
}


interface SiteData {
  meta: SiteMeta;
  settings: {
    companyFullName: string,
    allowEmbeddingFrom?: string;
    // inviteOnly?: boolean;
    allowSignup?: boolean;
    // allowLocalSignup?: boolean;
    allowGuestLogin?: boolean,
    requireVerifiedEmail?: boolean;
    mayComposeBeforeSignup?: boolean;
    mayPostBeforeEmailVerified?: boolean;
    numFirstPostsToReview?: number,
    numFirstPostsToApprove?: number,
    numFirstPostsToAllow?: number,
    numFlagsToHidePost?: number,
    numFlagsToBlockNewUser?: number,
    numFlaggersToBlockNewUser?: number,
  };
  groups: GroupInclDetails[];
  members: Member[];
  identities: any;
  guests: TestGuest[];
  permsOnPages: PermsOnPage[];
  blocks: any;
  invites: any;
  categories: TestCategory[];
  pages: Page[];
  pagePaths: PagePathWithId[];
  posts: TestPost[];
  emailsOut: any;
  notifications: any;
  uploads: any;
  auditLog: any;
  reviewTasks: any;
}


interface GroupInclDetails {
  id: UserId;
  summaryEmailIntervalMins?: number;
  summaryEmailIfActive?: boolean;
}


interface SiteMeta {
  id?: string;
  name: string;
  localHostname: string;
  creatorEmailAddress: string;
  status: SiteStatus,
  createdAtMs: number,
}


interface Member {
  id: number;
  username: string;
  fullName: string;
  createdAtMs: number;
  emailAddress: string;
  emailVerifiedAtMs?: number;
  passwordHash: string;
  password: string;
  isOwner?: boolean;
  isAdmin?: boolean;
  isModerator?: boolean;
  trustLevel?: TrustLevel;
  threatLevel?: ThreatLevel;
}


interface TestGuest {  // try to rename to Guest
  id: number;
  fullName: string;
  createdAtMs: number;
  emailAddress?: string;
  isGuest: boolean;
}


interface TestCategory {  // try to merge with Category in model.ts?
  id: number;
  sectionPageId: string;
  parentId?: number;
  defaultCategoryId?: number;
  name: string;
  slug: string;
  position?: number;
  description?: string;
  newTopicTypes?: string;
  defaultTopicType: number;
  createdAtMs: number;
  updatedAtMs: number;
  lockedAtMs?: number;
  frozenAtMs?: number;
  deletedAtMs?: number;
  unlisted?: boolean;
}


interface PageToMake {
  id: PageId;
  role: PageRole;
  categoryId?: CategoryId;
  authorId: UserId;
  createdAtMs?: number;
  updatedAtMs?: number;
  numChildPages?: number;
  numRepliesVisible?: number;
  numRepliesToReview?: number;
  numRepliesTotal?: number;
  numLikes?: number;
  numWrongs?: number;
  numBuryVotes?: number;
  numUnwantedVotes?: number;
  numOpLikeVotes?: number;
  numOpWrongVotes?: number;
  numOpBuryVotes?: number;
  numOpUnwantedVotes?: number;
  numOpRepliesVisible?: number;
  version?: number;
}


interface CategoryJustAdded {
  id: number,
  parentId: number,
  name: string,
  slug: string,
  unlisted?: boolean,
  deletedAtMs?: number,
  aboutPageText?: string,
  aboutPage?: PageJustAdded;
}


interface PageJustAdded {
  id: string;
  folder: string;
  showId: boolean;
  slug: string;
  role: number;
  title: string;
  body: string;
  categoryId: number;
  authorId: number,
  createdAtMs: number;
  updatedAtMs: number;
}


interface PageIdWhen {
  id: string;
  createdAtMs: number;
  updatedAtMs: number;
}


interface Page {
  id: string;
  role: PageRole;
  categoryId?: number;
  embeddingPageUrl?: string;
  authorId: number;
  createdAtMs: number;
  updatedAtMs: number;
  publishedAtMs?: number;
  bumpedAtMs?: number;
  lastReplyAtMs?: number;
  numChildPages?: number;
  numRepliesVisible?: number;
  numRepliesToReview?: number;
  numRepliesTotal?: number;
  pinOrder?: number;
  pinWhere?: PinPageWhere;
  numLikes?: number;
  numWrongs?: number;
  numBuryVotes?: number;
  numUnwantedVotes?: number;
  numOpLikeVotes?: number;
  numOpWrongVotes?: number;
  numOpBuryVotes?: number;
  numOpUnwantedVotes?: number;
  numOpRepliesVisible?: number;
  answeredAtMs?: number;
  answerPostId?: number;
  doneAtMs?: number;
  closedAtMs?: number;
  lockedAtMs?: number;
  frozenAt?: number;
  deletedAtMs?: number;
  deletedById?: number;
  unwantedAt?: number;
  plannedAt?: number;
  version: number;
  lastReplyById?: number;
  frequentPoster1Id?: number;
  frequentPoster2Id?: number;
  frequentPoster3Id?: number;
  frequentPoster4Id?: number;
}


interface PagePathWithId {
  folder: string;
  pageId: string;
  showId: boolean;
  slug: string;
}


interface NewTestPost {
  id?: number;
  // Not just page id, because needs author, creation date, etc.
  page: Page | PageJustAdded;
  nr: number;
  parentNr?: number;
  approvedSource: string;
  approvedHtmlSanitized?: string;
}


interface TestPost {  // later: try to unify with Post?
  id: number;
  pageId: string;
  nr: number;
  parentNr?: number;
  multireply?: string;
  createdAtMs: number;
  createdById: number;
  currRevStartedAtMs: number;
  currRevLastEditedAtMs?: number;
  currRevById: number;
  lastApprovedEditAtMs?: number;
  lastApprovedEditById?: number;
  numDistinctEditors: number;
  numEditSuggestions: number;
  lastEditSuggestionAtMs?: number;
  safeRevNr?: number;
  approvedSource?: string;
  approvedHtmlSanitized?: string;
  approvedAtMs?: number;
  approvedById?: number;
  approvedRevNr?: number;
  currRevSourcePatch?: string;
  currRevNr: number;
  /*
  collapsedStatus         | smallint                    | not null
  collapsed_at             | timestamp without time zone |
  collapsed_by_id          | integer                     |
  closed_status            | smallint                    | not null
  closed_at                | timestamp without time zone |
  closed_by_id             | integer                     |
  hidden_at                | timestamp without time zone |
  hidden_by_id             | integer                     |
  hidden_reason            | character varying           |
  */
  deletedStatus: number;
  deletedAtMs?: number;
  deletedById?: number;
  /*
  pinned_position          | smallint                    |
  pinned_at                | timestamp without time zone |
  pinned_by_id             | integer                     |
  */
  numPendingFlags?: number;
  numHandledFlags?: number;
  numLikeVotes: number;
  numWrongVotes: number;
  numTimesRead: number;
  numBuryVotes: number;
  numUnwantedVotes: number;
  type?: number;
  prevRevNr?: number;
}


interface NewCategoryStuff {
  category: Category;
  aboutPage: Page;
  aboutPageTitlePost: Post;
  aboutPageBody: Post;
}


interface IdAddress {
  id: string;
  origin: string, // e.g. kittens-forum.example.com
  siteIdOrigin: string; // e.g. site-123.example.com
}


interface EmailSubjectBody {
  subject: string;
  bodyHtmlText: string
}


interface EmptyTestForum {
  siteData: SiteData;
  forumPage: any;
  members: {
    owen: any;
    mons: any;
    modya: any;
    corax: any;
    regina: any;
    maria: any;
    michael: any;
    mallory: any;
  },
  guests: {
    gunnar: any;
  },
  categories: {
    categoryA: CategoryJustAdded;
  },
}


interface LargeTestForum extends EmptyTestForum {
  topics: {
    byMariaCategoryA: PageJustAdded;
    byMariaCategoryANr2: PageJustAdded;
    byMariaCategoryANr3: PageJustAdded;
    byMariaCategoryB: PageJustAdded;
    byMariaStaffOnlyCat: PageJustAdded;
    byMariaUnlistedCat: PageJustAdded;
    byMariaDeletedCat: PageJustAdded;
    byMichaelCategoryA: PageJustAdded;
    aboutCategoryA: { title: string };
    aboutCategoryB: { title: string };
    aboutUnlistedCategory: { title: string };
    aboutStaffOnlyCategory: { title: string };
    aboutDeletedCategory: { title: string };
  },
  categories: {
    categoryA: CategoryJustAdded;
    categoryB: CategoryJustAdded;
    staffOnlyCategory: CategoryJustAdded;
    unlistedCategory: CategoryJustAdded;
    deletedCategory: CategoryJustAdded;
  },
}

