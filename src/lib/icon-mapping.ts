// Icon mapping from Material Symbols to Huge Icons
// This helps maintain consistency across the app

export const iconMapping: Record<string, string> = {
  // Navigation
  grid_view: "DashboardSquare01Icon",
  dashboard: "DashboardSquare01Icon",
  group: "UserGroupIcon",
  payments: "MoneySend01Icon",
  account_balance: "BankIcon",
  chat: "Message02Icon",
  settings: "Settings01Icon",
  menu: "Menu01Icon",

  // Actions
  search: "Search01Icon",
  notifications: "Notification01Icon",
  help_outline: "HelpCircleIcon",
  help: "HelpCircleIcon",
  add: "Add01Icon",
  add_circle: "AddCircleIcon",
  edit: "PencilEdit01Icon",
  visibility: "ViewIcon",
  download: "Download04Icon",
  filter_list: "FilterHorizontalIcon",
  sort: "Sorting01Icon",
  more_vert: "MoreVerticalIcon",

  // Communication
  mail: "Mail01Icon",
  send: "SentIcon",
  attach_file: "Attachment01Icon",
  edit_square: "Edit01Icon",
  arrow_back: "ArrowLeft01Icon",
  arrow_forward: "ArrowRight01Icon",
  phone: "TelephoneIcon",
  info: "InformationCircleIcon",

  // Financial
  account_balance_wallet: "Wallet01Icon",
  pending_actions: "Task01Icon",
  gavel: "AuctionIcon",
  check_circle: "Tick02Icon",
  cancel: "Cancel01Icon",
  insights: "Analytics01Icon",
  inventory_2: "PackageIcon",

  // Status
  verified_user: "UserCheck01Icon",
  history: "HistoryIcon",
  sticky_note_2: "StickyNote01Icon",
  chevron_left: "ArrowLeft01Icon",
  chevron_right: "ArrowRight01Icon",

  // User
  person_add: "UserAdd01Icon",
  logout: "Logout01Icon",
  badge: "IdIcon",
  lock: "LockIcon",
  apps: "AppsIcon",

  // Misc
  terminal: "CodeIcon",
  contact_support: "CustomerSupportIcon",
  light_mode: "Sun01Icon",
  dark_mode: "Moon02Icon",
  security: "Shield01Icon",
  refresh: "RefreshIcon",
  login: "Login01Icon",
  calculate: "CalculatorIcon",
  book: "Book01Icon",
  campaign: "Announcement01Icon",
  schedule: "Calendar01Icon",
  assessment: "Analytics02Icon",
  water_drop: "DropIcon",
  integration_instructions: "CommandIcon",
  image: "Image01Icon",
  person_off: "UserRemove01Icon",

  // Settings
  save: "Save01Icon",
  shield: "Shield01Icon",
}

// Helper function to get Huge Icon component name
export function getHugeIconName(materialIcon: string): string {
  return iconMapping[materialIcon] || "HelpCircleIcon"
}
